"use client";

import { motion, useReducedMotion } from "framer-motion";

/** The ticket slides out as if printed. */
export function TicketReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", y: -24 }}
      animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
