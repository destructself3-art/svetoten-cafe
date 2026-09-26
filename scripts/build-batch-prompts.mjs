// Builds docs/BATCH_PROMPTS.md: the whole shot list as three self-contained texts
// (one per priority) that can be pasted into a chat-based image model as-is.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "docs/shot-list.json"), "utf8"));

const BIBLE = `STYLE BIBLE (applies to every image)
This is one continuous photoshoot for "Svetoten", a small café by day that turns into a wine bistro in the evening. Every image shows the same place and the same props:
- pale grey terrazzo tabletops with small warm-toned stone chips
- white porcelain with a thin charcoal rim (cups, plates, bowls)
- a brushed zinc bar counter, brushed brass details, dark graphite-stained oak bentwood chairs
- warm limestone-plaster walls, tall black steel-framed grid windows, olive trees in clay pots

DAY light: ${data.modes.day.light.replace(/^Light: /, "")} ${data.modes.day.palette}
NIGHT light: ${data.modes.night.light.replace(/^Light: /, "")} ${data.modes.night.palette}
Photo style: ${data.style} Photorealistic.
Menu shots: subject centered with generous empty space around it.
Never: text, lettering, readable labels or signs, logos, watermarks, faces, people (hands only where a shot says so), collages or grids.`;

const RULES = `HOW TO WORK
1. Generate every shot below as a separate photorealistic image, in the listed order, at the listed aspect ratio and the highest resolution you can.
2. Right before each image, write its file name on its own line (for example: hero-day.jpg).
3. One image per shot. Do not combine shots into a grid or collage.
4. A shot marked TWIN must reuse the image of the shot it names as its base: keep the same camera angle, framing and object positions and change only what the shot describes. If that image is not in this chat, ask me to attach it.
5. If you can only make a few images per reply, stop after them and wait. When I write "continue", resume from the next number.`;

const order = { A: 0, B: 1, C: 2 };
const sectionIndex = Object.fromEntries(data.sections.map((s, i) => [s.id, i]));
const shots = [...data.shots].sort(
  (a, b) => order[a.priority] - order[b.priority] || sectionIndex[a.section] - sectionIndex[b.section],
);
// Twins must come right after their base shot.
const sorted = [];
for (const s of shots) {
  if (sorted.includes(s)) continue;
  if (s.editFrom && !sorted.some((x) => x.id === s.editFrom)) continue;
  sorted.push(s);
  for (const t of shots) if (t.editFrom === s.id && !sorted.includes(t) && t.priority === s.priority) sorted.push(t);
}
for (const s of shots) if (!sorted.includes(s)) sorted.push(s);

const num = new Map(sorted.map((s, i) => [s.id, String(i + 1).padStart(2, "0")]));

function entry(s) {
  const n = num.get(s.id);
  const mode = s.mode.toUpperCase();
  const head = `[${n}] ${s.id}.jpg | ${s.ratio} | ${mode} light`;
  const lines = [head];
  if (s.editFrom) {
    const base = `[${num.get(s.editFrom)}] ${s.editFrom}.jpg`;
    const change = s.edit
      .replace(/^Edit the attached image\. /, "")
      .replace(/^Expand the attached image /, "Expand it ")
      .replace(/ No people, no text, no logos, no watermark\.$/, "");
    lines.push(`TWIN of ${base}: ${change}`);
  } else {
    lines.push(s.subject);
  }
  if (s.light) lines.push(`Light for this shot: ${s.light.replace(/^Light: /, "")}`);
  if (s.people === "hands") lines.push("Hands are allowed in this shot, but no faces.");
  return lines.join("\n");
}

const passes = [
  { p: "A", title: "site structure: hero, interior, hall zones, coffee process, events" },
  { p: "B", title: "menu highlights" },
  { p: "C", title: "extra menu items, atmosphere details, vertical hero versions" },
];

const blocks = passes.map(({ p, title }, i) => {
  const list = sorted.filter((s) => s.priority === p);
  const first = num.get(list[0].id);
  const last = num.get(list[list.length - 1].id);
  return [
    `PASS ${i + 1} OF 3: ${title} (${list.length} images, shots ${first} to ${last})`,
    "",
    BIBLE,
    "",
    RULES,
    "",
    "SHOTS",
    "",
    list.map(entry).join("\n\n"),
    "",
    `When all ${list.length} images of this pass are done, write: PASS ${i + 1} DONE.`,
  ].join("\n");
});

const md = [
  "# Svetoten — batch prompts",
  "",
  "Three self-contained texts, one per pass. Paste a whole block into a chat-based image model (in one chat, in order).",
  "Generated from `docs/shot-list.json` by `scripts/build-batch-prompts.mjs`.",
  "",
  ...blocks.flatMap((b, i) => [`## Pass ${i + 1}`, "", "```text", b, "```", ""]),
].join("\n");

writeFileSync(join(root, "docs/BATCH_PROMPTS.md"), md, "utf8");
blocks.forEach((b, i) => console.log(`pass ${i + 1}: ${b.length} chars`));
