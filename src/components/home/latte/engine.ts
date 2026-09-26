import {
  ADVECT_FRAG,
  BASE_VERT,
  CURL_FRAG,
  DISPLAY_FRAG,
  DIVERGENCE_FRAG,
  GRADIENT_FRAG,
  PRESSURE_FRAG,
  SCALE_FRAG,
  SPLAT_FRAG,
  STAMP_FRAG,
  VORTICITY_FRAG,
} from "./shaders";

export const PATTERNS = ["Сердце", "Тюльпан", "Розетта"] as const;

type Program = { program: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type Target = { texture: WebGLTexture; fbo: WebGLFramebuffer; size: number };
type DoubleTarget = { read: Target; write: Target; size: number; swap: () => void };

type Options = { simRes: number; dyeRes: number; reducedMotion: boolean };

/**
 * Timed steps of the cup: stir the old picture away, pour a pattern, swirl the glass.
 * They advance on accumulated frame time, so a hidden tab resumes them instead of skipping them.
 */
type Phase = { kind: "wipe"; t: number; factor: number } | { kind: "pour"; t: number } | { kind: "swirl"; t: number };

const POUR_SECONDS = 1.9;
const WIPE_SECONDS = 0.55;
const SWIRL_SECONDS = 1.5;
const VELOCITY_DISSIPATION = 1.4;
const DYE_DISSIPATION = 0.004;
const PRESSURE_ITERATIONS = 20;
const CURL = 5;
const STIR_FORCE = 5200;
const STIR_RADIUS = 0.0011;

/**
 * A cup of latte you can stir. By day the field is milk foam on crema; by night the same field
 * is drawn as wine, so the stir gesture keeps working after the café turns into a bistro.
 */
export class LatteEngine {
  private gl: WebGL2RenderingContext;
  private vao: WebGLVertexArrayObject;
  private p: Record<string, Program> = {};
  private velocity!: DoubleTarget;
  private dye!: DoubleTarget;
  private pressure!: DoubleTarget;
  private divergence!: Target;
  private curl!: Target;

  private night = 0;
  private nightTarget = 0;
  private pattern = 0;
  private phases: Phase[] = [];
  private lightSide = 1;
  private seed = Math.random() * 50;
  private raf = 0;
  private running = false;
  private visible = true;
  private lastFrame = 0;
  private lastActivity = 0;
  private pointer = { x: 0.5, y: 0.5, has: false };
  private onPour?: (pattern: number) => void;

  constructor(private canvas: HTMLCanvasElement, private opts: Options) {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) throw new Error("WebGL2 unavailable");
    if (!gl.getExtension("EXT_color_buffer_float")) throw new Error("Float render targets unavailable");
    this.gl = gl;

    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!vao || !buffer) throw new Error("WebGL buffers unavailable");
    this.vao = vao;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vert = this.compile(gl.VERTEX_SHADER, BASE_VERT);
    const frags: Record<string, string> = {
      splat: SPLAT_FRAG,
      advect: ADVECT_FRAG,
      divergence: DIVERGENCE_FRAG,
      curl: CURL_FRAG,
      vorticity: VORTICITY_FRAG,
      pressure: PRESSURE_FRAG,
      gradient: GRADIENT_FRAG,
      scale: SCALE_FRAG,
      stamp: STAMP_FRAG,
      display: DISPLAY_FRAG,
    };
    for (const [name, src] of Object.entries(frags)) this.p[name] = this.link(vert, this.compile(gl.FRAGMENT_SHADER, src));

    const sim = opts.simRes;
    const dye = opts.dyeRes;
    this.velocity = this.double(sim, gl.RG16F, gl.RG, gl.LINEAR);
    this.dye = this.double(dye, gl.RG16F, gl.RG, gl.LINEAR);
    this.pressure = this.double(sim, gl.R16F, gl.RED, gl.NEAREST);
    this.divergence = this.target(sim, gl.R16F, gl.RED, gl.NEAREST);
    this.curl = this.target(sim, gl.R16F, gl.RED, gl.NEAREST);

    this.bindPointer();
    this.resize();
  }

  static create(canvas: HTMLCanvasElement, opts: Options): LatteEngine | null {
    try {
      return new LatteEngine(canvas, opts);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.warn("Live latte disabled:", error);
      return null;
    }
  }

  // ---------- public API ----------

  /** Pours a pattern. With `wipe`, the old picture is stirred away first. */
  pour(pattern: number, wipe = true) {
    if (this.nightTarget === 1) {
      this.phases = [{ kind: "swirl", t: 0 }];
      this.wake();
      return;
    }
    this.pattern = pattern % PATTERNS.length;
    if (this.opts.reducedMotion) {
      this.fade(0);
      this.stamp(1);
      this.onPour?.(this.pattern);
      this.renderOnce();
      return;
    }
    this.phases = wipe ? [{ kind: "wipe", t: 0, factor: 0.9 }, { kind: "pour", t: 0 }] : [{ kind: "pour", t: 0 }];
    this.onPour?.(this.pattern);
    this.wake();
  }

  setNight(night: boolean, instant = false) {
    const target = night ? 1 : 0;
    const changed = target !== this.nightTarget;
    this.nightTarget = target;
    if (instant || this.opts.reducedMotion) {
      this.night = target;
      if (changed && night) this.fade(0);
      if (changed && !night) this.stamp(1);
      this.renderOnce();
      return;
    }
    if (!changed) return;
    if (night) {
      // The foam is stirred into faint streaks: they read as wine moving in the glass.
      this.phases = [{ kind: "wipe", t: 0, factor: 0.93 }, { kind: "swirl", t: 0 }];
    } else {
      this.pattern = 0;
      this.phases = [{ kind: "wipe", t: 0, factor: 0.86 }, { kind: "pour", t: 0 }];
      this.onPour?.(0);
    }
    this.wake();
  }

  /** Which side the evening light comes from: 1 = right (drawn candle), -1 = left (photo). */
  setLightSide(side: 1 | -1) {
    this.lightSide = side;
    this.renderOnce();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.wake();
    else this.stop();
  }

  onPattern(cb: (pattern: number) => void) {
    this.onPour = cb;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(2, Math.round(this.canvas.clientWidth * dpr));
    if (this.canvas.width !== size || this.canvas.height !== size) {
      this.canvas.width = size;
      this.canvas.height = size;
    }
    this.renderOnce();
  }

  destroy() {
    this.stop();
    this.canvas.removeEventListener("pointermove", this.handleMove);
    this.canvas.removeEventListener("pointerdown", this.handleDown);
    this.canvas.removeEventListener("pointerleave", this.handleLeave);
    // Free GPU objects but keep the context alive: React may mount the hero again on the same canvas.
    const gl = this.gl;
    for (const t of this.allTargets) {
      gl.deleteTexture(t.texture);
      gl.deleteFramebuffer(t.fbo);
    }
    for (const p of Object.values(this.p)) gl.deleteProgram(p.program);
  }

  // ---------- loop ----------

  private wake() {
    this.lastActivity = performance.now();
    if (this.running || !this.visible) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame = (nowMs: number) => {
    if (!this.running) return;
    const dt = Math.min(Math.max((nowMs - this.lastFrame) / 1000, 1 / 144), 1 / 30);
    this.lastFrame = nowMs;

    const phase = this.phases[0];
    if (phase) {
      phase.t += dt;
      this.lastActivity = nowMs;
      if (phase.kind === "wipe") {
        this.fade(Math.pow(phase.factor, dt * 60));
        this.swirl(dt);
        if (phase.t >= WIPE_SECONDS) this.phases.shift();
      } else if (phase.kind === "pour") {
        const t = phase.t / POUR_SECONDS;
        if (t < 1) {
          this.stamp(1 - Math.pow(1 - t, 3));
          this.splat(0.5, 0.41, 0, -40 * (1 - t), 0.004);
          if (t > 0.78) this.splat(0.5, 0.82 - (t - 0.78) * 1.6, 0, -900, 0.0006);
        } else {
          this.stamp(1);
          this.phases.shift();
        }
      } else {
        const t = phase.t / SWIRL_SECONDS;
        if (t < 1) this.wineSwirl(t, dt);
        else this.phases.shift();
      }
    }

    this.night += (this.nightTarget - this.night) * Math.min(1, dt * 2.2);
    if (Math.abs(this.nightTarget - this.night) > 0.002) this.lastActivity = nowMs;
    else this.night = this.nightTarget;

    this.step(dt);
    this.render();

    if (this.phases.length === 0 && nowMs - this.lastActivity > 4500) {
      this.running = false;
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  private renderOnce() {
    if (!this.running) this.render();
  }

  // ---------- simulation ----------

  private step(dt: number) {
    const gl = this.gl;
    const simTexel = 1 / this.velocity.size;

    this.use("curl", simTexel);
    this.tex("uVelocity", this.velocity.read, 0);
    this.blit(this.curl);

    this.use("vorticity", simTexel);
    this.tex("uVelocity", this.velocity.read, 0);
    this.tex("uCurl", this.curl, 1);
    gl.uniform1f(this.p.vorticity.u.uCurlStrength, CURL);
    gl.uniform1f(this.p.vorticity.u.uDt, dt);
    this.blit(this.velocity.write);
    this.velocity.swap();

    this.use("divergence", simTexel);
    this.tex("uVelocity", this.velocity.read, 0);
    this.blit(this.divergence);

    this.use("scale", simTexel);
    this.tex("uTexture", this.pressure.read, 0);
    gl.uniform1f(this.p.scale.u.uValue, 0.8);
    this.blit(this.pressure.write);
    this.pressure.swap();

    this.use("pressure", simTexel);
    this.tex("uDivergence", this.divergence, 1);
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      this.tex("uPressure", this.pressure.read, 0);
      this.blit(this.pressure.write);
      this.pressure.swap();
    }

    this.use("gradient", simTexel);
    this.tex("uPressure", this.pressure.read, 0);
    this.tex("uVelocity", this.velocity.read, 1);
    this.blit(this.velocity.write);
    this.velocity.swap();

    this.use("advect", simTexel);
    gl.uniform2f(this.p.advect.u.uVelTexel, simTexel, simTexel);
    gl.uniform1f(this.p.advect.u.uDt, dt);
    gl.uniform1f(this.p.advect.u.uDissipation, VELOCITY_DISSIPATION);
    gl.uniform1f(this.p.advect.u.uWall, 1);
    this.tex("uVelocity", this.velocity.read, 0);
    this.tex("uSource", this.velocity.read, 1);
    this.blit(this.velocity.write);
    this.velocity.swap();

    this.use("advect", 1 / this.dye.size);
    gl.uniform2f(this.p.advect.u.uVelTexel, simTexel, simTexel);
    gl.uniform1f(this.p.advect.u.uDt, dt);
    gl.uniform1f(this.p.advect.u.uDissipation, DYE_DISSIPATION);
    gl.uniform1f(this.p.advect.u.uWall, 0);
    this.tex("uVelocity", this.velocity.read, 0);
    this.tex("uSource", this.dye.read, 1);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private render() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.use("display", 1 / this.dye.size);
    gl.uniform2f(this.p.display.u.uDyeTexel, 1 / this.dye.size, 1 / this.dye.size);
    gl.uniform1f(this.p.display.u.uNight, this.night);
    gl.uniform1f(this.p.display.u.uLightSide, this.lightSide);
    this.tex("uDye", this.dye.read, 0);
    this.tex("uVelocity", this.velocity.read, 1);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private splat(x: number, y: number, dx: number, dy: number, radius = STIR_RADIUS) {
    const gl = this.gl;
    this.use("splat", 1 / this.velocity.size);
    this.tex("uTarget", this.velocity.read, 0);
    gl.uniform2f(this.p.splat.u.uPoint, x, y);
    gl.uniform3f(this.p.splat.u.uColor, dx, dy, 0);
    gl.uniform1f(this.p.splat.u.uRadius, radius);
    this.blit(this.velocity.write);
    this.velocity.swap();
  }

  /** A slow spoon circle, used while the old picture is stirred away. */
  private swirl(dt: number) {
    const t = performance.now() / 1000;
    const a = t * 7;
    const x = 0.5 + Math.cos(a) * 0.22;
    const y = 0.5 + Math.sin(a) * 0.22;
    this.splat(x, y, -Math.sin(a) * 2600 * dt * 60 * 0.12, Math.cos(a) * 2600 * dt * 60 * 0.12, 0.004);
  }

  /** Swirling the glass: the wine climbs the wall and leaves lighter streaks in a spiral. */
  private wineSwirl(t: number, dt: number) {
    const turns = 2.6;
    const a = t * Math.PI * 2 * turns;
    const ease = Math.sin(Math.PI * Math.min(t * 1.15, 1));
    for (let k = 0; k < 3; k++) {
      const ak = a + (k * Math.PI * 2) / 3;
      const rr = 0.3;
      const x = 0.5 + Math.cos(ak) * rr;
      const y = 0.5 + Math.sin(ak) * rr;
      const f = 1700 * ease * dt * 60 * 0.1;
      this.splat(x, y, -Math.sin(ak) * f, Math.cos(ak) * f, 0.006);
    }
    const sr = 0.08 + t * 0.3;
    this.splatDye(0.5 + Math.cos(a * 1.3) * sr, 0.5 + Math.sin(a * 1.3) * sr, 0.12 * ease, 0.0016);
  }

  private splatDye(x: number, y: number, amount: number, radius: number) {
    const gl = this.gl;
    this.use("splat", 1 / this.dye.size);
    this.tex("uTarget", this.dye.read, 0);
    gl.uniform2f(this.p.splat.u.uPoint, x, y);
    gl.uniform3f(this.p.splat.u.uColor, amount, 0, 0);
    gl.uniform1f(this.p.splat.u.uRadius, radius);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private stamp(reveal: number) {
    const gl = this.gl;
    this.use("stamp", 1 / this.dye.size);
    this.tex("uTarget", this.dye.read, 0);
    gl.uniform1i(this.p.stamp.u.uPattern, this.pattern);
    gl.uniform1f(this.p.stamp.u.uReveal, reveal);
    gl.uniform1f(this.p.stamp.u.uSeed, this.seed);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  private fade(value: number) {
    const gl = this.gl;
    this.use("scale", 1 / this.dye.size);
    this.tex("uTexture", this.dye.read, 0);
    gl.uniform1f(this.p.scale.u.uValue, value);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  // ---------- input ----------

  private bindPointer() {
    this.canvas.addEventListener("pointermove", this.handleMove);
    this.canvas.addEventListener("pointerdown", this.handleDown);
    this.canvas.addEventListener("pointerleave", this.handleLeave);
  }

  private toUv(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
  }

  private handleDown = (e: PointerEvent) => {
    e.preventDefault(); // no text selection while stirring
    const { x, y } = this.toUv(e);
    this.pointer = { x, y, has: true };
    this.wake();
  };

  private handleMove = (e: PointerEvent) => {
    const { x, y } = this.toUv(e);
    if (!this.pointer.has) {
      this.pointer = { x, y, has: true };
      return;
    }
    const dx = x - this.pointer.x;
    const dy = y - this.pointer.y;
    this.pointer.x = x;
    this.pointer.y = y;
    const r = Math.hypot(x - 0.5, y - 0.5) * 2;
    if (r > 0.97 || (dx === 0 && dy === 0)) return;
    this.splat(x, y, dx * STIR_FORCE, dy * STIR_FORCE);
    this.wake();
  };

  private handleLeave = () => {
    this.pointer.has = false;
  };

  // ---------- GL helpers ----------

  private compile(type: number, source: string) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) throw new Error("shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      throw new Error(`Shader compile error: ${log}`);
    }
    return shader;
  }

  private link(vert: WebGLShader, frag: WebGLShader): Program {
    const gl = this.gl;
    const program = gl.createProgram();
    if (!program) throw new Error("program");
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Link error: ${gl.getProgramInfoLog(program)}`);
    const u: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (info) u[info.name] = gl.getUniformLocation(program, info.name);
    }
    return { program, u };
  }

  private target(size: number, internal: number, format: number, filter: number): Target {
    const gl = this.gl;
    const texture = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!texture || !fbo) throw new Error("target");
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, size, size, 0, format, gl.HALF_FLOAT, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Framebuffer incomplete");
    gl.viewport(0, 0, size, size);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const t = { texture, fbo, size };
    this.allTargets.push(t);
    return t;
  }

  private allTargets: Target[] = [];

  private double(size: number, internal: number, format: number, filter: number): DoubleTarget {
    let a = this.target(size, internal, format, filter);
    let b = this.target(size, internal, format, filter);
    const d: DoubleTarget = {
      size,
      get read() {
        return a;
      },
      get write() {
        return b;
      },
      swap() {
        [a, b] = [b, a];
      },
    } as DoubleTarget;
    return d;
  }

  private current: Program | null = null;

  private use(name: string, texel: number) {
    const program = this.p[name];
    this.gl.useProgram(program.program);
    this.current = program;
    this.gl.uniform2f(program.u.uTexel, texel, texel);
  }

  private tex(uniform: string, target: Target, unit: number) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, target.texture);
    gl.uniform1i(this.current?.u[uniform] ?? null, unit);
  }

  private blit(target: Target) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.size, target.size);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
