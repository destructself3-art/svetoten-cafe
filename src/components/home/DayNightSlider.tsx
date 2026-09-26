"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { MediaFrame } from "@/components/ui/MediaFrame";

/** The same room at 08:40 and at 21:15. Drag the seam, or use the arrow keys. */
export function DayNightSlider() {
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const inView = useInView(frame, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const touched = useRef(false);

  // A small hint on first view: the seam walks right, then left.
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(50, [50, 72, 30, 50], {
      duration: 2.6,
      ease: "easeInOut",
      delay: 0.4,
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce]);

  const setFromPointer = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={frame}
      className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] sm:aspect-[16/10] lg:aspect-[16/8]"
      onPointerDown={(e) => {
        touched.current = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging && setFromPointer(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <MediaFrame shot="interior-night" alt="Зал вечером: лампы, свечи на столах, за окнами синие сумерки" sizes="(max-width: 1360px) 100vw, 1360px" className="absolute inset-0" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <MediaFrame shot="interior-day" alt="Тот же зал утром: солнце из окон, тени от рам на полу" sizes="(max-width: 1360px) 100vw, 1360px" className="absolute inset-0" />
      </div>

      <span className="tone-day pointer-events-none absolute left-4 top-4 rounded-full px-3 py-1.5 text-[13.5px] font-semibold tabular sm:left-6 sm:top-6">
        08:40 · утро
      </span>
      <span className="tone-night pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1.5 text-[13.5px] font-semibold tabular sm:right-6 sm:top-6">
        21:15 · вечер
      </span>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden>
        <div className="absolute inset-y-0 -left-px w-[2px] bg-[#f3f3f0] shadow-[0_0_24px_rgb(0_0_0/0.35)]" />
        <div className="absolute left-0 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#f3f3f0] text-[#1e1d1b] shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)]">
          <span className="relative h-5 w-5 overflow-hidden rounded-full bg-[#e39b35]">
            <span className="absolute inset-y-0 right-0 w-1/2 bg-[#1e1d1b]" />
          </span>
        </div>
      </div>

      <label className="sr-only" htmlFor="day-night-range">
        Сравнить зал днём и вечером
      </label>
      <input
        id="day-night-range"
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        className="peer sr-only"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-honey-ink peer-focus-visible:ring-2" />
    </div>
  );
}
