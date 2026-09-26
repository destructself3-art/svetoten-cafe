"use client";

import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Anatomy, LayerKind, Vessel } from "@/data/menu";

// Cross-section of a cup or glass. viewBox 0 0 200 240, the table line is y = 214.

type VesselShape = {
  /** Interior outline: where the liquid can be */
  inner: string;
  /** Wall drawn around the interior */
  wall: string;
  top: number;
  bottom: number;
  capacity: number;
  glass: boolean;
  handle?: string;
};

const VESSELS: Record<Vessel, VesselShape> = {
  demitasse: {
    inner: "M76 150 L124 150 L118 196 Q117 202 110 202 L90 202 Q83 202 82 196 Z",
    wall: "M68 144 L132 144 L125 200 Q123 210 112 210 L88 210 Q77 210 75 200 Z",
    handle: "M129 160 C150 158 152 184 126 186",
    top: 150,
    bottom: 202,
    capacity: 90,
    glass: false,
  },
  cup: {
    inner: "M46 116 L154 116 Q152 170 128 194 Q122 200 112 200 L88 200 Q78 200 72 194 Q48 170 46 116 Z",
    wall: "M38 110 L162 110 Q160 176 134 202 Q126 210 114 210 L86 210 Q74 210 66 202 Q40 176 38 110 Z",
    handle: "M159 128 C190 124 190 170 150 170",
    top: 116,
    bottom: 200,
    capacity: 280,
    glass: false,
  },
  "small-cup": {
    inner: "M58 132 L142 132 Q141 172 124 192 Q119 198 110 198 L90 198 Q81 198 76 192 Q59 172 58 132 Z",
    wall: "M50 126 L150 126 Q149 178 130 200 Q123 208 112 208 L88 208 Q77 208 70 200 Q51 178 50 126 Z",
    handle: "M147 142 C172 138 172 178 138 178",
    top: 132,
    bottom: 198,
    capacity: 200,
    glass: false,
  },
  gibraltar: {
    inner: "M70 118 L130 118 L126 198 Q126 204 120 204 L80 204 Q74 204 74 198 Z",
    wall: "M64 112 L136 112 L131 204 Q130 212 120 212 L80 212 Q70 212 69 204 Z",
    top: 118,
    bottom: 204,
    capacity: 150,
    glass: true,
  },
  glass: {
    inner: "M66 50 L134 50 L127 198 Q126 204 120 204 L80 204 Q74 204 73 198 Z",
    wall: "M60 44 L140 44 L132 204 Q131 212 120 212 L80 212 Q69 212 68 204 Z",
    top: 50,
    bottom: 204,
    capacity: 420,
    glass: true,
  },
  highball: {
    inner: "M70 36 L130 36 L128 198 Q128 204 122 204 L78 204 Q72 204 72 198 Z",
    wall: "M64 30 L136 30 L133 204 Q132 212 122 212 L78 212 Q68 212 67 204 Z",
    top: 36,
    bottom: 204,
    capacity: 350,
    glass: true,
  },
  carafe: {
    inner: "M90 62 L110 62 L111 96 Q150 118 148 164 Q146 204 118 204 L82 204 Q54 204 52 164 Q50 118 89 96 Z",
    wall: "M84 54 L116 54 L117 92 Q158 116 156 166 Q154 212 120 212 L80 212 Q46 212 44 166 Q42 116 83 92 Z",
    top: 62,
    bottom: 204,
    capacity: 420,
    glass: true,
  },
};

// `ref` fills point at gradients defined inside each SVG instance.
const LAYERS: Record<LayerKind, { label: string; fill: string; ref?: boolean; opacity?: number }> = {
  espresso: { label: "Эспрессо", fill: "#3a2212" },
  crema: { label: "Крема", fill: "#b97b3c" },
  americano: { label: "Вода", fill: "#5b3822" },
  milk: { label: "Молоко", fill: "milk", ref: true },
  foam: { label: "Пена", fill: "foam", ref: true },
  raf: { label: "Сливки с эспрессо и карамелью", fill: "raf", ref: true },
  caramel: { label: "Карамельная крошка", fill: "caramel", ref: true },
  filter: { label: "Фильтр-кофе", fill: "#8b4a1d", opacity: 0.88 },
  tonic: { label: "Тоник", fill: "tonic", ref: true },
  coldbrew: { label: "Колд брю", fill: "#2b190f" },
};

const SWATCH: Record<LayerKind, string> = {
  espresso: "#3a2212",
  crema: "#b97b3c",
  americano: "#5b3822",
  milk: "#e6d6be",
  foam: "#f7f2ea",
  raf: "#dcbf96",
  caramel: "#b8742c",
  filter: "#8b4a1d",
  tonic: "#e4e1cf",
  coldbrew: "#2b190f",
};

export type AnatomyDrink = { slug: string; title: string; anatomy: Anatomy };

export function DrinkAnatomy({ drink, className }: { drink: AnatomyDrink; className?: string }) {
  const reduce = useReducedMotion();
  // Two instances can share a page (mobile and desktop layouts): every SVG id must be unique.
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const shape = VESSELS[drink.anatomy.vessel];
  const scale = (shape.bottom - shape.top) / shape.capacity;
  const total = drink.anatomy.layers.reduce((sum, l) => sum + l.ml, 0);

  let cursor = shape.bottom;
  const rects = drink.anatomy.layers.map((layer, i) => {
    const h = layer.ml * scale;
    cursor -= h;
    return { ...layer, i, y: cursor, h };
  });
  const surface = cursor;

  return (
    <figure className={className}>
      <svg viewBox="0 0 200 240" className="h-auto w-full overflow-visible" role="img" aria-label={`${drink.title} в разрезе`}>
        <defs>
          <linearGradient id={id("milk")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#b98a5c" />
            <stop offset="0.35" stopColor="#dcc4a3" />
            <stop offset="1" stopColor="#efe4d2" />
          </linearGradient>
          <linearGradient id={id("raf")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#c99e6c" />
            <stop offset="1" stopColor="#e9d3ae" />
          </linearGradient>
          <linearGradient id={id("tonic")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#dcd8c2" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8a5a34" stopOpacity="0.85" />
          </linearGradient>
          <pattern id={id("foam")} width="9" height="7" patternUnits="userSpaceOnUse">
            <rect width="9" height="7" fill="#f6f0e6" />
            <circle cx="2" cy="2" r="1.1" fill="#e6dccb" />
            <circle cx="6.5" cy="5" r="0.8" fill="#e9e0d0" />
          </pattern>
          <pattern id={id("caramel")} width="6" height="4" patternUnits="userSpaceOnUse">
            <rect width="6" height="4" fill="#c98a3e" />
            <circle cx="1.5" cy="2" r="1" fill="#8d5418" />
            <circle cx="4.5" cy="1" r="0.7" fill="#f0c98c" />
          </pattern>
          <clipPath id={id("inner")}>
            <path d={shape.inner} />
          </clipPath>
        </defs>

        <line x1="18" x2="182" y1="214" y2="214" stroke="rgb(var(--line) / 0.25)" strokeWidth="1" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={drink.slug}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35 }}
          >
            {/* Wall: porcelain is drawn as a cut section, glass as a thin transparent shell */}
            {shape.handle && <path d={shape.handle} fill="none" stroke="rgb(var(--ink))" strokeWidth="7" strokeLinecap="round" opacity="0.9" />}
            {shape.handle && <path d={shape.handle} fill="none" stroke="#f4f3ef" strokeWidth="4.5" strokeLinecap="round" />}
            <path
              d={shape.wall}
              fill={shape.glass ? "rgb(255 255 255 / 0.1)" : "#f4f3ef"}
              stroke="rgb(var(--ink))"
              strokeWidth={shape.glass ? 1.2 : 1.6}
            />
            <path d={shape.inner} fill={shape.glass ? "rgb(var(--paper) / 0.6)" : "#e7e4dd"} />

            <g clipPath={`url(#${id("inner")})`}>
              {rects.map((r) => {
                const layer = LAYERS[r.kind];
                return (
                  <motion.rect
                    key={`${drink.slug}-${r.i}`}
                    x={0}
                    width={200}
                    fill={layer.ref ? `url(#${id(layer.fill)})` : layer.fill}
                    fillOpacity={layer.opacity ?? 1}
                    initial={reduce ? { y: r.y, height: r.h } : { y: shape.bottom, height: 0 }}
                    animate={{ y: r.y, height: r.h + 0.6 }}
                    transition={{ duration: 0.9, delay: reduce ? 0 : 0.15 + r.i * 0.32, ease: [0.16, 1, 0.3, 1] }}
                  />
                );
              })}
              {drink.anatomy.cold &&
                [0, 1, 2, 3].map((k) => {
                  const y = surface + 10 + k * ((shape.bottom - surface - 30) / 3.5);
                  const x = 82 + ((k * 23) % 34);
                  return (
                    <motion.g
                      key={`ice-${k}`}
                      initial={reduce ? { y } : { y: surface - 60, opacity: 0 }}
                      animate={{ y, opacity: 1 }}
                      transition={{ duration: 0.8, delay: reduce ? 0 : 0.6 + k * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <rect
                        x={x}
                        width={24}
                        height={20}
                        rx={4}
                        fill="rgb(255 255 255 / 0.28)"
                        stroke="rgb(255 255 255 / 0.75)"
                        strokeWidth={1}
                        transform={`rotate(${k % 2 ? 12 : -9} ${x + 12} 10)`}
                      />
                    </motion.g>
                  );
                })}
            </g>

            {shape.glass && (
              <path d={shape.wall} fill="none" stroke="rgb(255 255 255 / 0.55)" strokeWidth="1" strokeDasharray="0 18 60 400" />
            )}

            {!drink.anatomy.cold && (
              <g className="anatomy-steam" fill="none" stroke="rgb(var(--ink-2))" strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
                <path d={`M92 ${shape.top - 14} q-6 -10 0 -20 q6 -10 0 -20`} />
                <path d={`M104 ${shape.top - 10} q-6 -10 0 -20 q6 -10 0 -20`} />
                <path d={`M116 ${shape.top - 16} q-6 -10 0 -20 q6 -10 0 -20`} />
              </g>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>

      <figcaption className="mt-4">
        <ul className="space-y-1.5 text-[14.5px]">
          {[...drink.anatomy.layers].reverse().map((layer, i) => (
            <li key={`${drink.slug}-${layer.kind}-${i}`} className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full border border-line/25" style={{ background: SWATCH[layer.kind] }} />
              <span className="flex-1 text-ink-2">{LAYERS[layer.kind].label}</span>
              <span className="tabular">{layer.ml} мл</span>
            </li>
          ))}
          {drink.anatomy.cold && (
            <li className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-[3px] border border-line/40" />
              <span className="flex-1 text-ink-2">Лёд</span>
              <span className="tabular text-ink-2">4 кубика</span>
            </li>
          )}
        </ul>
        <p className="mt-3 flex justify-between border-t border-line/10 pt-3 text-[14.5px]">
          <span className="text-ink-2">{drink.anatomy.cold ? "Подаём холодным" : "Подаём горячим"}</span>
          <span className="tabular font-semibold">{total} мл</span>
        </p>
      </figcaption>
    </figure>
  );
}
