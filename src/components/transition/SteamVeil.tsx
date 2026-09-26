"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export type VeilHandle = {
  /** Steam rises from the bottom and covers the page. Resolves when fully covered. */
  cover: (title: string) => Promise<void>;
  /** The steam keeps rising and uncovers the new page from the bottom. */
  reveal: () => Promise<void>;
};

const VERT = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uT;
uniform float uTime;
uniform float uReveal;
uniform vec3 uPaper;
uniform vec3 uGlow;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
void main(){
  vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 2.4;
  float n = fbm(p + vec2(0.0, -uTime * 0.55));
  float n2 = fbm(p * 1.7 + vec2(3.0, -uTime * 0.9));
  float field = vUv.y * 0.82 + n * 0.46 + n2 * 0.08;
  float t = uT * 1.78 - 0.36;
  float edge = smoothstep(field - 0.12, field + 0.12, t);
  float a = uReveal > 0.5 ? 1.0 - edge : edge;
  vec3 col = mix(uPaper, uGlow, 0.12 * (1.0 - vUv.y) + 0.07 * n2);
  gl_FragColor = vec4(col, a);
}`;

type Renderer = { draw: (t: number, time: number, reveal: boolean) => void; resize: () => void };

function cssColor(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return raw.length === 3 && raw.every((v) => !Number.isNaN(v)) ? [raw[0] / 255, raw[1] / 255, raw[2] / 255] : [0.95, 0.95, 0.94];
}

function createRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = u("uRes"), uT = u("uT"), uTime = u("uTime"), uReveal = u("uReveal"), uPaper = u("uPaper"), uGlow = u("uGlow");

  const resize = () => {
    // Steam is soft: half resolution is enough and keeps it cheap on phones.
    const scale = 0.5;
    canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
    canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  return {
    resize,
    draw(t, time, reveal) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uReveal, reveal ? 1 : 0);
      gl.uniform3fv(uPaper, cssColor("--paper"));
      gl.uniform3fv(uGlow, cssColor("--honey"));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export const SteamVeil = forwardRef<VeilHandle>(function SteamVeil(_, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const renderer = useRef<Renderer | null | undefined>(undefined);
  const clock = useRef(0);

  const ensure = () => {
    if (renderer.current === undefined && canvasRef.current) renderer.current = createRenderer(canvasRef.current);
    return renderer.current;
  };

  const run = (reveal: boolean, duration: number) =>
    new Promise<void>((resolve) => {
      const root = rootRef.current;
      if (!root) return resolve();
      root.style.visibility = "visible";
      root.style.pointerEvents = "auto";
      const r = ensure();
      if (r) r.resize();
      const start = performance.now();
      let finished = false;
      const paint = (raw: number) => {
        const t = easeInOut(raw);
        clock.current += 1 / 60;
        if (r) r.draw(t, clock.current, reveal);
        else if (fallbackRef.current) fallbackRef.current.style.opacity = String(reveal ? 1 - t : t);
        if (titleRef.current) {
          const titleOpacity = reveal ? Math.max(0, 1 - raw * 2.2) : Math.max(0, (raw - 0.55) / 0.45);
          titleRef.current.style.opacity = String(titleOpacity);
          titleRef.current.style.transform = `translateY(${(1 - titleOpacity) * (reveal ? -18 : 18)}px)`;
        }
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(safety);
        paint(1);
        if (reveal) {
          root.style.visibility = "hidden";
          root.style.pointerEvents = "none";
        }
        resolve();
      };
      // Animation frames pause in background tabs: the timer makes sure navigation never waits on them.
      const safety = window.setTimeout(finish, duration + 250);
      const frame = (now: number) => {
        if (finished) return;
        const raw = Math.min(1, (now - start) / duration);
        paint(raw);
        if (raw < 1) requestAnimationFrame(frame);
        else finish();
      };
      requestAnimationFrame(frame);
    });

  useImperativeHandle(ref, () => ({
    cover: (title: string) => {
      if (titleRef.current) titleRef.current.textContent = title;
      return run(false, 720);
    },
    reveal: () => run(true, 950),
  }));

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[70]" style={{ visibility: "hidden" }} aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={fallbackRef} className="absolute inset-0 bg-paper" style={{ opacity: 0 }} />
      <div className="absolute inset-0 grid place-items-center">
        <p ref={titleRef} className="wordmark text-d-2 text-ink" style={{ opacity: 0 }} />
      </div>
    </div>
  );
});
