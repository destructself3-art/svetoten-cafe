"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { MediaFrame } from "@/components/ui/MediaFrame";
import type { MenuItemView } from "./types";

const WIDTH = 260;

/** The dish photo follows the cursor while you read the menu. Desktop pointers only. */
export function FloatingPreview({ item }: { item: MenuItemView | null }) {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1400, 0, 1400], [-9, 0, 9], { clamp: true });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine);
    if (!fine) return;
    const move = (e: PointerEvent) => {
      const flip = e.clientX > window.innerWidth - WIDTH - 60;
      x.set(flip ? e.clientX - WIDTH - 28 : e.clientX + 28);
      y.set(e.clientY - WIDTH * 0.62);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-40" style={{ x: sx, y: sy, rotate, width: WIDTH }} aria-hidden>
      <AnimatePresence>
        {item?.photo && (
          <motion.div
            key={item.slug}
            className="absolute inset-x-0 top-0 overflow-hidden rounded-[20px] shadow-[0_30px_60px_-24px_rgb(var(--shadow)/0.55)]"
            initial={{ opacity: 0, scale: 0.92, clipPath: "inset(18% 12% 18% 12% round 20px)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 20px)" }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <MediaFrame shot={item.photo} alt="" sizes="260px" className="aspect-[4/5]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
