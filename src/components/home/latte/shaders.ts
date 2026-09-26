// GLSL for the live latte. Stable-fluids solver (advection, vorticity, pressure projection)
// on a square grid; the cup is the inscribed circle.

export const BASE_VERT = `#version 300 es
precision highp float;
in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`;

const NOISE = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
`;

export const SPLAT_FRAG = `${HEAD}
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
void main() {
  vec2 d = vUv - uPoint;
  vec3 splat = exp(-dot(d, d) / uRadius) * uColor;
  fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
}`;

export const ADVECT_FRAG = `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uVelTexel;
uniform float uDt;
uniform float uDissipation;
uniform float uWall;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uVelTexel;
  vec4 result = texture(uSource, coord) / (1.0 + uDissipation * uDt);
  float r = length(vUv * 2.0 - 1.0);
  result *= 1.0 - uWall * smoothstep(0.93, 1.0, r);
  fragColor = result;
}`;

export const DIVERGENCE_FRAG = `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

export const CURL_FRAG = `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

export const VORTICITY_FRAG = `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlStrength;
uniform float uDt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`;

export const PRESSURE_FRAG = `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`;

export const GRADIENT_FRAG = `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 vel = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(vel, 0.0, 1.0);
}`;

export const SCALE_FRAG = `${HEAD}
uniform sampler2D uTexture;
uniform float uValue;
void main() {
  fragColor = uValue * texture(uTexture, vUv);
}`;

/** Draws a latte-art pattern into the milk field. p is cup space: [-1, 1], y up. */
export const STAMP_FRAG = `${HEAD}
uniform sampler2D uTarget;
uniform int uPattern;
uniform float uReveal;
uniform float uSeed;
${NOISE}
float dot2(vec2 v) { return dot(v, v); }
float sdHeart(vec2 p) {
  p.x = abs(p.x);
  if (p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
  return sqrt(min(dot2(p - vec2(0.0, 1.0)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
}
float circle(vec2 p, vec2 c, float r) { return length(p - c) - r; }
float fill(float d, float soft) { return 1.0 - smoothstep(-soft, soft, d); }
float stem(vec2 p, float y0, float y1, float w) {
  return (1.0 - smoothstep(w * 0.55, w, abs(p.x))) * smoothstep(y0 - 0.01, y0 + 0.01, p.y) * (1.0 - smoothstep(y1 - 0.01, y1 + 0.01, p.y));
}
float heart(vec2 p) {
  vec2 q = (p - vec2(0.0, -0.6)) / 1.14;
  float m = fill(sdHeart(q) * 1.14, 0.016);
  return max(m, stem(p, -0.82, -0.54, 0.026));
}
float tulip(vec2 p) {
  float c1 = max(circle(p, vec2(0.0, -0.2), 0.56), -circle(p, vec2(0.0, 0.0), 0.5));
  float c2 = max(circle(p, vec2(0.0, 0.06), 0.4), -circle(p, vec2(0.0, 0.2), 0.36));
  float h = sdHeart((p - vec2(0.0, 0.16)) / 0.46) * 0.46;
  float m = fill(min(min(c1, c2), h), 0.014);
  m *= smoothstep(-0.8, -0.74, p.y);
  return max(m, stem(p, -0.8, 0.32, 0.026));
}
float rosetta(vec2 p) {
  vec2 q = vec2(p.x * (1.0 + 1.1 * max(p.y + 0.15, 0.0)), p.y + 0.02);
  float leaf = length(q / vec2(0.5, 0.7)) - 1.0;
  float inside = fill(leaf * 0.5, 0.012);
  float s = p.y + 1.25 * p.x * p.x;
  float band = 0.5 + 0.5 * sin(s * 40.0);
  float width = mix(0.2, 0.62, 1.0 - smoothstep(0.0, 0.45, abs(p.x)));
  float ribs = smoothstep(1.0 - width - 0.08, 1.0 - width + 0.08, band);
  float m = inside * max(ribs, 1.0 - smoothstep(0.035, 0.06, abs(p.x)));
  return max(m, stem(p, -0.86, 0.66, 0.024));
}
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float m = uPattern == 0 ? heart(p) : (uPattern == 1 ? tulip(p) : rosetta(p));
  // The pour spreads from a point just below the center, with a ragged front.
  float d = length(p - vec2(0.0, -0.18)) + (noise(p * 5.0 + uSeed) - 0.5) * 0.14;
  float front = uReveal * 1.45;
  float reveal = 1.0 - smoothstep(front - 0.16, front, d);
  float cur = texture(uTarget, vUv).r;
  fragColor = vec4(max(cur, m * reveal), 0.0, 0.0, 1.0);
}`;

/** Final image: crema and milk foam by day, wine by night. */
export const DISPLAY_FRAG = `${HEAD}
uniform sampler2D uDye;
uniform sampler2D uVelocity;
uniform vec2 uDyeTexel;
uniform float uNight;
uniform float uLightSide;
${NOISE}
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float alpha = 1.0 - smoothstep(0.985, 1.0, r);
  if (alpha <= 0.0) { fragColor = vec4(0.0); return; }

  float m = clamp(texture(uDye, vUv).r, 0.0, 1.2);
  float mL = texture(uDye, vUv - vec2(uDyeTexel.x, 0.0)).r;
  float mR = texture(uDye, vUv + vec2(uDyeTexel.x, 0.0)).r;
  float mT = texture(uDye, vUv + vec2(0.0, uDyeTexel.y)).r;
  float mB = texture(uDye, vUv - vec2(0.0, uDyeTexel.y)).r;
  vec3 n = normalize(vec3((mL - mR) * 2.2, (mB - mT) * 2.2, 1.0));
  vec2 vel = texture(uVelocity, vUv).xy;

  // Day: crema with tiger speckle, milk microfoam with a caramel halo at its edge.
  float speck = fbm(p * 7.0 + 3.1);
  float fine = noise(p * 42.0);
  vec3 cremaLight = vec3(0.64, 0.4, 0.2);
  vec3 cremaDark = vec3(0.3, 0.16, 0.08);
  vec3 crema = mix(cremaLight, cremaDark, clamp(smoothstep(0.35, 1.0, r) * 0.75 + (speck - 0.5) * 0.7, 0.0, 1.0));
  crema *= 0.94 + fine * 0.1;
  vec3 foam = vec3(0.975, 0.95, 0.9) - (speck - 0.5) * 0.05 - fine * 0.035;
  float body = smoothstep(0.2, 0.6, m);
  float halo = smoothstep(0.03, 0.28, m) * (1.0 - body);
  vec3 latte = mix(crema, foam, body);
  latte = mix(latte, vec3(0.8, 0.58, 0.35), halo * 0.6);

  // Night: deep ruby, lighter at the rim like a real glass, swirls where the "milk" field moves.
  vec3 wineDeep = vec3(0.14, 0.008, 0.035);
  vec3 wineRim = vec3(0.52, 0.045, 0.085);
  vec3 wine = mix(wineDeep, wineRim, smoothstep(0.45, 1.0, r));
  wine = mix(wine, vec3(0.42, 0.03, 0.09), smoothstep(0.08, 0.9, m) * 0.75);
  wine += (speck - 0.5) * 0.02;

  vec3 col = mix(latte, wine, uNight);

  // Light: window at the upper left by day, a candle by night.
  vec3 light = normalize(vec3(-0.55, 0.6, 0.78));
  col *= 0.86 + 0.2 * clamp(dot(n, light), 0.0, 1.0);
  vec2 wobble = n.xy * 0.4 + vel * 0.00035;
  vec2 lightAt = mix(vec2(-0.4, 0.42), vec2(0.32 * uLightSide, 0.36), uNight);
  vec2 hp = p - lightAt - wobble;
  vec2 hs = mix(vec2(2.0, 3.2), vec2(6.0, 6.0), uNight);
  float spec = exp(-dot(hp * hs, hp * hs) * 3.2);
  // Foam is matte: the window reflects mostly on the crema around it.
  float gloss = mix(1.0 - body * 0.6, 1.0, uNight);
  col += spec * gloss * mix(vec3(0.34, 0.33, 0.3), vec3(0.95, 0.72, 0.4), uNight);

  // Meniscus at the wall, and the wall's shadow on the lit side.
  col *= 1.0 - smoothstep(0.82, 1.0, r) * 0.5;
  vec2 lightDir = normalize(mix(vec2(-0.7, 0.7), vec2(0.7 * uLightSide, 0.7), uNight));
  float side = smoothstep(0.55, 1.0, r) * clamp(dot(normalize(p + 1e-4), lightDir), 0.0, 1.0);
  col *= 1.0 - side * 0.3;

  col += (hash(vUv * 731.0) - 0.5) / 255.0;
  fragColor = vec4(col, alpha);
}`;
