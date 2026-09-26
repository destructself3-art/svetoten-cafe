"use client";

import { useId } from "react";
import clsx from "clsx";

/**
 * The mark is a cup seen from above and a moon at the same time:
 * by day the shadow is a thin crescent, by night it covers almost the whole circle.
 */
export function Mark({ className }: { className?: string }) {
  const clip = useId();
  return (
    <svg viewBox="0 0 40 40" className={clsx("brand-mark", className)} aria-hidden focusable="false">
      <defs>
        <clipPath id={clip}>
          <circle cx="20" cy="20" r="14" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="18.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="20" cy="20" r="14" fill="rgb(var(--honey))" />
      <g clipPath={`url(#${clip})`}>
        <circle className="brand-mark__shade" cx="20" cy="20" r="14" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={clsx("wordmark", className)}>
      <span className="sr-only">Светотень</span>
      <span className="wm-light" aria-hidden>
        Свето
      </span>
      <span className="wm-shade" aria-hidden>
        тень
      </span>
    </span>
  );
}
