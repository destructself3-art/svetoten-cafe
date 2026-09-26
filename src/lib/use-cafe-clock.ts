"use client";

import { useEffect, useState } from "react";

/** Current time, updated every `intervalMs`. Null on the server and before mount, so SSR never shows a stale clock. */
export function useCafeClock(intervalMs = 20_000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
