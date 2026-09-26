"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

/**
 * Between the day and the evening menu: scrolling through this band is the hour
 * from 17:30 to 18:30. The page darkens, the clock runs and a candle is lit.
 */
export function DuskInterlude({ onPhase }: { onPhase: (phase: "day" | "night") => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [clock, setClock] = useState("17:30");

  const background = useTransform(scrollYProgress, [0.1, 0.62], ["#f3f3f0", "#0f1011"]);
  const color = useTransform(scrollYProgress, [0.36, 0.4], ["#1e1d1b", "#ece9e2"]);
  const muted = useTransform(scrollYProgress, [0.36, 0.4], ["#5c5d59", "#a8a59e"]);
  const flame = useTransform(scrollYProgress, [0.46, 0.6], [0, 1]);
  const glow = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);
  const sun = useTransform(scrollYProgress, [0, 0.45], [0, 160]);
  const sunOpacity = useTransform(scrollYProgress, [0.25, 0.45], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const minutes = Math.round(17 * 60 + 30 + v * 60);
    setClock(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
    onPhase(v > 0.5 ? "night" : "day");
  });

  return (
    <section ref={ref} className="relative h-[240vh]" aria-label="18:00: свет приглушают, начинается вечернее меню">
      <motion.div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4" style={{ backgroundColor: background, color }}>
        <motion.div
          className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ffd48a,#e39b35_45%,transparent_70%)] blur-[2px]"
          style={{ y: sun, opacity: sunOpacity }}
          aria-hidden
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgb(240_168_74/0.32),transparent_45%)]"
          style={{ opacity: glow }}
          aria-hidden
        />
        <p className="relative font-label text-[15px] font-semibold uppercase tracking-[0.2em]" aria-hidden>
          <motion.span style={{ color: muted }}>Смена света</motion.span>
        </p>
        <p className="display tabular relative mt-4 text-[clamp(5.5rem,20vw,17rem)] font-light leading-none" aria-hidden>
          {clock}
        </p>
        <svg viewBox="0 0 80 120" className="relative mt-6 h-28 w-20" aria-hidden>
          <rect x="22" y="58" width="36" height="56" rx="6" fill="#b8893e" opacity="0.9" />
          <rect x="26" y="52" width="28" height="10" rx="3" fill="#ece9e2" />
          <line x1="40" y1="52" x2="40" y2="44" stroke="#1e1d1b" strokeWidth="2" />
          <motion.g style={{ scale: flame, opacity: flame, originX: 0.5, originY: 1 }}>
            <ellipse cx="40" cy="30" rx="18" ry="24" fill="#f0a84a" opacity="0.35" />
            <path d="M40 10 C 50 24 49 36 40 44 C 31 36 30 24 40 10 Z" fill="#ffd48a" />
            <path d="M40 22 C 45 30 44 37 40 42 C 36 37 35 30 40 22 Z" fill="#fff4dc" />
          </motion.g>
        </svg>
        <motion.p className="relative mt-8 max-w-md text-center text-[18px] leading-relaxed" style={{ color: muted }}>
          В шесть вечера мы приглушаем свет, зажигаем свечи и меняем меню. Дальше вино, маленькие тарелки и горячее.
        </motion.p>
      </motion.div>
    </section>
  );
}
