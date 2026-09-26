"use client";

import clsx from "clsx";
import type { KeyboardEvent } from "react";
import { ZONES, type Zone } from "@/data/hall";

export type PlanTable = {
  id: string;
  code: string;
  label: string;
  zone: string;
  seatsMin: number;
  seatsMax: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: string;
  note?: string | null;
  /** free: fits and free, taken: booked, unfit: wrong size or closed zone, idle: no booking context */
  state?: "free" | "taken" | "unfit" | "idle";
};

type Props = {
  tables: PlanTable[];
  selectedId?: string | null;
  onSelect?: (table: PlanTable) => void;
  onFocusTable?: (table: PlanTable | null) => void;
  activeZone?: string | null;
  onZone?: (zone: Zone | null) => void;
  terraceOpen?: boolean;
  className?: string;
  title?: string;
};

const ZONE_LABELS: { zone: Zone; x: number; y: number; anchor?: "start" | "middle" | "end" }[] = [
  { zone: "window", x: 112, y: 460 - 10, anchor: "middle" },
  { zone: "hall", x: 360, y: 240, anchor: "middle" },
  { zone: "sofa", x: 646, y: 160, anchor: "middle" },
  { zone: "communal", x: 640, y: 384, anchor: "middle" },
  { zone: "bar", x: 880, y: 400, anchor: "middle" },
  { zone: "terrace", x: 505, y: 628, anchor: "middle" },
];

function seatsLabel(t: PlanTable) {
  return t.seatsMin === t.seatsMax ? `${t.seatsMax}` : `${t.seatsMin}–${t.seatsMax}`;
}

function describe(t: PlanTable) {
  const zone = ZONES[t.zone as Zone]?.title ?? t.zone;
  const state = t.state === "taken" ? "занят" : t.state === "unfit" ? "не подходит" : t.state === "free" ? "свободен" : "";
  return `Стол ${t.label}, ${zone.toLowerCase()}, на ${seatsLabel(t)} ${t.seatsMax > 4 ? "гостей" : "гостя"}${state ? `, ${state}` : ""}`;
}

export function HallPlan({ tables, selectedId, onSelect, onFocusTable, activeZone, onZone, terraceOpen = true, className, title = "План зала" }: Props) {
  const interactive = Boolean(onSelect);

  const handleKey = (e: KeyboardEvent<SVGGElement>, t: PlanTable) => {
    if ((e.key === "Enter" || e.key === " ") && t.state === "free") {
      e.preventDefault();
      onSelect?.(t);
    }
  };

  return (
    <svg viewBox="0 0 1000 640" className={clsx("hall-plan h-auto w-full select-none", className)} role="group" aria-label={title}>
      <defs>
        <pattern id="plan-terrazzo" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="6" r="1.2" fill="rgb(var(--ink) / 0.08)" />
          <circle cx="15" cy="15" r="0.9" fill="rgb(var(--honey) / 0.18)" />
          <circle cx="17" cy="4" r="0.7" fill="rgb(var(--ink) / 0.06)" />
        </pattern>
        <pattern id="plan-pavers" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="none" stroke="rgb(var(--ink) / 0.07)" strokeWidth="1" />
        </pattern>
        <pattern id="plan-taken" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="rgb(var(--ink) / 0.08)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(var(--ink) / 0.22)" strokeWidth="2" />
        </pattern>
        <radialGradient id="plan-candle">
          <stop offset="0" stopColor="rgb(var(--honey))" stopOpacity="0.9" />
          <stop offset="1" stopColor="rgb(var(--honey))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floor */}
      <rect x="40" y="40" width="920" height="420" fill="rgb(var(--surface))" />
      <rect x="40" y="40" width="920" height="420" fill="url(#plan-terrazzo)" />

      {/* Terrace */}
      <g className={clsx("transition-opacity duration-500", !terraceOpen && "opacity-40")}>
        <rect x="120" y="494" width="780" height="120" rx="6" fill="url(#plan-pavers)" stroke="rgb(var(--ink) / 0.25)" strokeDasharray="6 6" />
        <path d="M130 504 Q 225 530 320 504 Q 415 530 510 504 Q 605 530 700 504 Q 795 530 890 504" fill="none" stroke="rgb(var(--honey) / 0.7)" strokeWidth="1.5" strokeDasharray="1 11" strokeLinecap="round" />
        {[150, 870].map((x) => (
          <circle key={x} cx={x} cy="590" r="14" fill="rgb(var(--ink) / 0.06)" stroke="rgb(var(--ink) / 0.3)" />
        ))}
      </g>
      {!terraceOpen && (
        <text x="505" y="560" textAnchor="middle" className="fill-ink-2 font-label text-[20px] uppercase tracking-[0.14em]">
          Терраса закрыта до мая
        </text>
      )}

      {/* Walls */}
      <g stroke="rgb(var(--ink))" strokeWidth="6" strokeLinecap="square" fill="none">
        <path d="M40 40 H960 V460 H540" />
        <path d="M470 460 H40 V430" />
        <path d="M40 70 V40" />
      </g>
      {/* Steel-framed windows on the left wall and on the facade */}
      <g stroke="rgb(var(--ink))" fill="none">
        <path d="M40 70 V430" strokeWidth="2" />
        <path d="M46 70 V430" strokeWidth="1" opacity="0.6" />
        {[70, 160, 250, 340, 430].map((y) => (
          <line key={y} x1="36" x2="50" y1={y} y2={y} strokeWidth="3" />
        ))}
        <path d="M120 460 H440" strokeWidth="2" />
        <path d="M120 454 H440" strokeWidth="1" opacity="0.6" />
        <path d="M580 460 H900" strokeWidth="2" />
        <path d="M580 454 H900" strokeWidth="1" opacity="0.6" />
      </g>
      {/* Entrance and door swing */}
      <path d="M470 460 A 70 70 0 0 1 540 390" fill="none" stroke="rgb(var(--ink) / 0.35)" strokeDasharray="4 5" />
      <line x1="540" y1="460" x2="540" y2="390" stroke="rgb(var(--ink) / 0.5)" strokeWidth="2" />
      <text x="505" y="482" textAnchor="middle" className="fill-ink-2 font-label text-[16px] uppercase tracking-[0.16em]">
        вход
      </text>

      {/* Bar */}
      <rect x="836" y="104" width="44" height="286" rx="6" fill="rgb(var(--stone))" stroke="rgb(var(--ink) / 0.55)" strokeWidth="1.5" />
      <rect x="842" y="118" width="32" height="44" rx="4" fill="rgb(var(--ink) / 0.75)" />
      <circle cx="858" cy="140" r="6" fill="rgb(var(--honey))" opacity="0.8" />
      <rect x="908" y="96" width="44" height="300" fill="rgb(var(--ink) / 0.06)" stroke="rgb(var(--ink) / 0.3)" />
      {[120, 170, 220, 270, 320, 370].map((y) => (
        <line key={y} x1="910" x2="950" y1={y} y2={y} stroke="rgb(var(--ink) / 0.25)" />
      ))}
      {/* Kitchen door */}
      <path d="M896 40 A 44 44 0 0 1 940 84" fill="none" stroke="rgb(var(--ink) / 0.3)" strokeDasharray="4 5" />
      <text x="930" y="30" textAnchor="middle" className="fill-ink-2 font-label text-[15px] uppercase tracking-[0.14em]">
        кухня
      </text>

      {/* Olive trees */}
      {[
        [70, 440],
        [516, 70],
        [230, 70],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="17" fill="rgb(var(--ink) / 0.05)" stroke="rgb(var(--ink) / 0.3)" />
          <circle cx={x - 5} cy={y - 4} r="7" fill="rgb(var(--ink) / 0.12)" />
          <circle cx={x + 6} cy={y + 3} r="6" fill="rgb(var(--ink) / 0.1)" />
        </g>
      ))}

      {/* Zone labels (hover to preview a zone) */}
      {ZONE_LABELS.map((z) => (
        <text
          key={z.zone}
          x={z.x}
          y={z.y}
          textAnchor={z.anchor}
          onMouseEnter={() => onZone?.(z.zone)}
          onMouseLeave={() => onZone?.(null)}
          className={clsx(
            "font-label text-[17px] font-semibold uppercase tracking-[0.18em] transition-colors",
            activeZone === z.zone ? "fill-honey-ink" : "fill-ink-3",
          )}
        >
          {ZONES[z.zone].title}
        </text>
      ))}

      {/* Tables */}
      {tables.map((t) => {
        const state = t.state ?? "idle";
        const selected = t.id === selectedId;
        const clickable = interactive && state === "free";
        const zoneActive = activeZone === t.zone;
        return (
          <g
            key={t.id}
            className={clsx("plan-table", `plan-table--${state}`, selected && "plan-table--selected", zoneActive && "plan-table--zone")}
            role={interactive ? "button" : undefined}
            tabIndex={clickable ? 0 : interactive ? -1 : undefined}
            aria-pressed={interactive ? selected : undefined}
            aria-disabled={interactive && !clickable ? true : undefined}
            aria-label={describe(t)}
            onClick={() => clickable && onSelect?.(t)}
            onKeyDown={(e) => handleKey(e, t)}
            onMouseEnter={() => {
              onFocusTable?.(t);
              onZone?.(t.zone as Zone);
            }}
            onMouseLeave={() => {
              onFocusTable?.(null);
              onZone?.(null);
            }}
            onFocus={() => onFocusTable?.(t)}
            onBlur={() => onFocusTable?.(null)}
            style={{ cursor: clickable ? "pointer" : "default" }}
          >
            <title>{describe(t)}</title>
            <TableShape t={t} />
            {selected && (
              <g className="plan-candle" pointerEvents="none">
                <circle cx={t.x} cy={t.y} r={Math.min(t.w, t.h) * 0.9} fill="url(#plan-candle)" />
                <circle cx={t.x} cy={t.y} r="7" fill="#fff4dc" />
              </g>
            )}
            {!selected && (
              <text x={t.x} y={t.y + 5} textAnchor="middle" pointerEvents="none" className="plan-table__num font-sans text-[15px] font-semibold">
                {t.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TableShape({ t }: { t: PlanTable }) {
  const chair = (cx: number, cy: number, key: string) => <circle key={key} cx={cx} cy={cy} r="9" className="plan-chair" />;

  if (t.shape === "round") {
    const r = t.w / 2;
    const chairs =
      t.seatsMax <= 2
        ? [chair(t.x - r - 12, t.y, "l"), chair(t.x + r + 12, t.y, "r")]
        : [chair(t.x - r - 12, t.y, "l"), chair(t.x + r + 12, t.y, "r"), chair(t.x, t.y - r - 12, "t"), chair(t.x, t.y + r + 12, "b")];
    return (
      <g>
        {chairs}
        <circle cx={t.x} cy={t.y} r={r} className="plan-top" />
      </g>
    );
  }
  if (t.shape === "square") {
    const hw = t.w / 2;
    return (
      <g>
        {[chair(t.x - hw - 12, t.y, "l"), chair(t.x + hw + 12, t.y, "r"), chair(t.x, t.y - hw - 12, "t"), chair(t.x, t.y + hw + 12, "b")]}
        <rect x={t.x - hw} y={t.y - t.h / 2} width={t.w} height={t.h} rx="8" className="plan-top" />
      </g>
    );
  }
  if (t.shape === "sofa") {
    return (
      <g>
        <rect x={t.x - t.w / 2} y={t.y - t.h / 2 - 16} width={t.w} height="22" rx="10" className="plan-chair" />
        <rect x={t.x - t.w / 2 + 18} y={t.y - 8} width={t.w - 36} height="36" rx="8" className="plan-top" />
        {[chair(t.x - 22, t.y + 44, "a"), chair(t.x + 22, t.y + 44, "b")]}
      </g>
    );
  }
  if (t.shape === "rect") {
    const hw = t.w / 2;
    const seats = [-0.75, -0.25, 0.25, 0.75].flatMap((k) => [chair(t.x + k * hw, t.y - t.h / 2 - 13, `t${k}`), chair(t.x + k * hw, t.y + t.h / 2 + 13, `b${k}`)]);
    return (
      <g>
        {seats}
        <rect x={t.x - hw} y={t.y - t.h / 2} width={t.w} height={t.h} rx="8" className="plan-top" />
      </g>
    );
  }
  // bar: two stools along the counter
  return (
    <g>
      <rect x={t.x - t.w / 2 - 6} y={t.y - t.h / 2 - 6} width={t.w + 12} height={t.h + 12} rx="18" className="plan-top plan-top--bar" />
      <circle cx={t.x} cy={t.y - 20} r="12" className="plan-chair" />
      <circle cx={t.x} cy={t.y + 20} r="12" className="plan-chair" />
    </g>
  );
}
