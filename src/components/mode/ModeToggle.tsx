"use client";

import clsx from "clsx";
import { useMode } from "./ModeProvider";

/** Switches the light of the whole site. The circle of new light starts at the button. */
export function ModeToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { toggle } = useMode();
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={clsx(
        "group relative inline-flex h-11 items-center gap-2.5 rounded-full border border-line/20 pl-1.5 pr-4 text-[15px] font-semibold text-ink transition-colors hover:border-ink/60",
        compact && "w-11 justify-center !px-0",
        className,
      )}
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-sunk">
        {/* Sun by day, moon by night: one circle and a sliding shadow */}
        <span className="relative h-3.5 w-3.5 overflow-hidden rounded-full bg-honey shadow-[0_0_12px_rgb(var(--honey)/0.7)]">
          <span className="brand-toggle-shade absolute inset-0 rounded-full bg-sunk" />
        </span>
      </span>
      {!compact && (
        <>
          <span className="only-day">Свет</span>
          <span className="only-night">Тень</span>
        </>
      )}
      <span className="sr-only only-day">Включить вечерний режим</span>
      <span className="sr-only only-night">Включить дневной режим</span>
    </button>
  );
}
