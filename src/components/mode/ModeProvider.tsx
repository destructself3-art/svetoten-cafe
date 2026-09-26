"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MODE_STORAGE_KEY } from "./mode-script";

export type Mode = "day" | "night";

type ModeContextValue = {
  /** The light the page shows right now */
  mode: Mode;
  /** True once the real mode has been read from the document */
  ready: boolean;
  /** Switch the light. `origin` is where the circle of light starts (viewport px). */
  toggle: (origin?: { x: number; y: number }) => void;
  /** Temporarily force a mode (the menu page does this while you scroll into the evening). */
  force: (mode: Mode | null) => void;
  /** Let a page decide what the toggle does (the menu scrolls to the morning or the evening instead). */
  overrideToggle: (handler: ((mode: Mode) => void) | null) => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

const OFFSET_MINUTES = 180;
const DAY_FROM = 7 * 60;
const NIGHT_FROM = 18 * 60;

function cafeMinutes(now = new Date()) {
  return (now.getUTCHours() * 60 + now.getUTCMinutes() + OFFSET_MINUTES) % 1440;
}

function autoMode(now = new Date()): Mode {
  const m = cafeMinutes(now);
  return m >= DAY_FROM && m < NIGHT_FROM ? "day" : "night";
}

/** Timestamp of the next 07:00 or 18:00 café time: a manual choice lasts until then. */
function nextSwitch(now = new Date()) {
  const m = cafeMinutes(now);
  const target = m < DAY_FROM ? DAY_FROM : m < NIGHT_FROM ? NIGHT_FROM : DAY_FROM + 1440;
  return now.getTime() + (target - m) * 60_000;
}

function applyMode(mode: Mode, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  if (root.dataset.mode === mode) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || reduce) {
    root.dataset.mode = mode;
    return;
  }
  const transition = doc.startViewTransition(() => {
    root.dataset.mode = mode;
  });
  transition.ready
    .then(() => {
      if (!origin) {
        // Changes the page makes by itself (the clock, scrolling the menu) simply dissolve.
        root.animate({ opacity: [0, 1] }, { duration: 900, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" });
        return;
      }
      const { x, y } = origin;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 1100, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [base, setBase] = useState<Mode>("day");
  const [forced, setForced] = useState<Mode | null>(null);
  const [ready, setReady] = useState(false);
  const manualRef = useRef(false);
  const originRef = useRef<{ x: number; y: number } | undefined>(undefined);
  const overrideRef = useRef<((mode: Mode) => void) | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setBase(root.dataset.mode === "night" ? "night" : "day");
    manualRef.current = root.dataset.modeSource === "manual";
    setReady(true);

    // Follow the café clock unless the visitor picked a light themselves.
    const id = window.setInterval(() => {
      if (manualRef.current) {
        try {
          const saved = JSON.parse(localStorage.getItem(MODE_STORAGE_KEY) || "null");
          if (!saved || saved.until <= Date.now()) manualRef.current = false;
        } catch {
          manualRef.current = false;
        }
      }
      if (!manualRef.current) setBase(autoMode());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const mode = forced ?? base;

  useEffect(() => {
    if (!ready) return;
    applyMode(mode, originRef.current);
    originRef.current = undefined;
  }, [mode, ready]);

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    if (overrideRef.current) {
      overrideRef.current(forced ?? base);
      return;
    }
    originRef.current = origin;
    setForced(null);
    setBase((current) => {
      const next: Mode = (forced ?? current) === "day" ? "night" : "day";
      manualRef.current = true;
      try {
        localStorage.setItem(MODE_STORAGE_KEY, JSON.stringify({ mode: next, until: nextSwitch() }));
      } catch {
        // Private mode: the choice lasts until reload.
      }
      return next;
    });
  }, [forced, base]);

  const force = useCallback((next: Mode | null) => setForced(next), []);
  const overrideToggle = useCallback((handler: ((mode: Mode) => void) | null) => {
    overrideRef.current = handler;
  }, []);

  const value = useMemo(() => ({ mode, ready, toggle, force, overrideToggle }), [mode, ready, toggle, force, overrideToggle]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside ModeProvider");
  return ctx;
}
