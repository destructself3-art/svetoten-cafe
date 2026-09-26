"use client";

import { createElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Canonical portfolio timing: opacity + y 28 + blur 8, cubic-bezier(0.16, 1, 0.3, 1), once at 30% in view.
const EASE = [0.16, 1, 0.3, 1] as const;

const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  p: motion.p,
  h2: motion.h2,
  span: motion.span,
  article: motion.article,
} as const;

type Props = {
  children: ReactNode;
  as?: keyof typeof TAGS;
  delay?: number;
  className?: string;
  id?: string;
};

export function Reveal({ children, as = "div", delay = 0, className, id }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className, id }, children);
  const Tag = TAGS[as];
  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
