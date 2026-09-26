"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "@/components/layout/SmoothScroll";
import { SteamVeil, type VeilHandle } from "./SteamVeil";

type TransitionContextValue = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => {} });

const TITLES: Record<string, string> = {
  "/": "Светотень",
  "/menu": "Меню",
  "/booking": "Бронь",
};

const HEADER_OFFSET = -88;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const veil = useRef<VeilHandle>(null);
  const pending = useRef<{ hash: string } | null>(null);
  const busy = useRef(false);
  const safety = useRef<number | undefined>(undefined);

  const scrollTo = useCallback(
    (hash: string, immediate: boolean) => {
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      // Respect the target's own scroll-margin (the menu leaves room for its sticky nav).
      const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) || -HEADER_OFFSET : 0;
      if (lenis) {
        lenis.scrollTo(target ?? 0, { offset: -margin, immediate, force: true });
      } else if (target) {
        target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
      }
    },
    [lenis],
  );

  const lift = useCallback(() => {
    window.clearTimeout(safety.current);
    const done = () => {
      busy.current = false;
    };
    if (veil.current) veil.current.reveal().then(done, done);
    else done();
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.assign(href);
        return;
      }
      // Same page: only scroll (to the anchor or to the top) or update the query.
      if (url.pathname === window.location.pathname) {
        if (url.search !== window.location.search) {
          router.push(href, { scroll: false });
          return;
        }
        if (url.hash) window.history.pushState(null, "", url.hash);
        scrollTo(url.hash, false);
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !veil.current || busy.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = { hash: url.hash };
      router.prefetch(url.pathname + url.search);
      await veil.current.cover(TITLES[url.pathname] ?? "");
      router.push(href, { scroll: false });
      // If the page never arrives (network error), do not leave the visitor under the veil.
      safety.current = window.setTimeout(() => {
        pending.current = null;
        lift();
      }, 9000);
    },
    [router, scrollTo, lift],
  );

  useEffect(() => {
    if (!pending.current) return;
    const { hash } = pending.current;
    pending.current = null;
    lenis?.resize();
    scrollTo(hash, true);
    // A timer, not an animation frame: frames do not run in background tabs.
    // No cleanup on purpose: the pending navigation is already consumed, so the veil must lift regardless.
    window.setTimeout(lift, 30);
  }, [pathname, lenis, scrollTo, lift]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <SteamVeil ref={veil} />
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(TransitionContext);
}
