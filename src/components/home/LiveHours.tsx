"use client";

import clsx from "clsx";
import { HOURS_TABLE } from "@/lib/cafe";
import { cafeParts, openStatus } from "@/lib/time";
import { useCafeClock } from "@/lib/use-cafe-clock";

/** Opening hours with today highlighted and a live open/closed line. */
export function LiveHours() {
  const now = useCafeClock(30_000);
  const today = now ? cafeParts(now).isoDay : null;
  const status = now ? openStatus(now) : null;

  return (
    <div>
      <p className="eyebrow mb-3">Часы</p>
      <ul className="tabular space-y-1.5 text-[15.5px]">
        {HOURS_TABLE.map((row) => {
          const isToday = today !== null && (row.isoDays as readonly number[]).includes(today);
          return (
            <li key={row.days} className={clsx("flex justify-between gap-6", isToday ? "font-semibold text-ink" : "text-ink-2")}>
              <span>
                {row.days}
                {isToday && <span className="ml-2 text-[13px] font-medium text-honey-ink">сегодня</span>}
              </span>
              <span>{row.hours}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 flex items-center gap-2.5 text-[15px]" aria-live="polite">
        <span className={clsx("h-2 w-2 rounded-full", status?.open ? "bg-honey shadow-[0_0_10px_rgb(var(--honey))]" : "bg-ink-3")} />
        <span>{status ? status.label : " "}</span>
      </p>
    </div>
  );
}
