// Generates the terrazzo tabletop used by the hero until the real photos arrive.
// Output: public/textures/terrazzo.webp (seamless enough for a single large tile).
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SIZE = 1600;

let seed = 20260925;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const chipColors = [
  ["#bdb8ae", 0.9], ["#a8a39a", 0.8], ["#c9c4bb", 0.9], ["#8f8a82", 0.7],
  ["#c79a78", 0.75], ["#b98767", 0.7], ["#d8b49a", 0.7], ["#6f6b66", 0.55],
  ["#e7e3dc", 0.95], ["#9aa1a4", 0.6],
];

function chip(cx, cy, r) {
  const points = [];
  const n = 5 + Math.floor(rand() * 4);
  const rot = rand() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2 + (rand() - 0.5) * 0.6;
    const rr = r * (0.55 + rand() * 0.6);
    points.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  const [color, opacity] = chipColors[Math.floor(rand() * chipColors.length)];
  return `<polygon points="${points.join(" ")}" fill="${color}" fill-opacity="${opacity}"/>`;
}

const shapes = [];
for (let i = 0; i < 5200; i++) shapes.push(chip(rand() * SIZE, rand() * SIZE, 1.2 + Math.pow(rand(), 3) * 7));
for (let i = 0; i < 260; i++) shapes.push(chip(rand() * SIZE, rand() * SIZE, 6 + rand() * 9));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs>
    <filter id="n" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7"/>
      <feColorMatrix values="0 0 0 0 0.84  0 0 0 0 0.83  0 0 0 0 0.81  0 0 0 0.18 0"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#d9d7d1"/>
  <rect width="100%" height="100%" filter="url(#n)"/>
  ${shapes.join("\n  ")}
</svg>`;

mkdirSync(join(root, "public/textures"), { recursive: true });
await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(join(root, "public/textures/terrazzo.webp"));
console.log("public/textures/terrazzo.webp");
