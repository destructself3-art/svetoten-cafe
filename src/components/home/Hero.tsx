"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";
import { useMode } from "@/components/mode/ModeProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { CupArt, GlassArt, StaticLatte } from "./latte/CupArt";
import { LatteEngine, PATTERNS } from "./latte/engine";
import { DRAWN, HERO_CALIBRATION, type HeroShot } from "@/data/hero";
import { getPhoto } from "@/lib/photos";
import { useCafeClock } from "@/lib/use-cafe-clock";
import { cafeParts, daypartOf, minutesToHHMM, openStatus } from "@/lib/time";
import { CAFE } from "@/lib/cafe";

const SERVING = {
  morning: "завтраки, выпечку из печи и кофе",
  day: "обеды, десерты и кофе",
  evening: "вино, маленькие тарелки и горячее",
} as const;

type Mode = "day" | "night";

/** The calibrated shot for a mode and breakpoint; a missing mobile photo falls back to the desktop one. */
function shotFor(mode: Mode, bp: "desktop" | "mobile"): HeroShot & { exists: boolean } {
  const cal = HERO_CALIBRATION[mode];
  const own = cal[bp];
  if (getPhoto(own.shot)) return { ...own, exists: true };
  if (bp === "mobile" && getPhoto(cal.desktop.shot)) return { ...cal.desktop, exists: true };
  return { ...DRAWN, shot: own.shot, exists: false };
}

/** Calibration as CSS variables: --{d|m}{cx|cy|r|ar}-{day|night}. The stylesheet does the geometry. */
function stageVars(): CSSProperties {
  const vars: Record<string, number> = {};
  for (const mode of ["day", "night"] as const) {
    for (const [bp, p] of [
      ["desktop", "d"],
      ["mobile", "m"],
    ] as const) {
      const s = shotFor(mode, bp);
      vars[`--${p}cx-${mode}`] = s.cx;
      vars[`--${p}cy-${mode}`] = s.cy;
      vars[`--${p}r-${mode}`] = s.r;
      vars[`--${p}ar-${mode}`] = s.ar;
    }
  }
  return vars as CSSProperties;
}

/** Art direction: a vertical photo on phones, a wide one from 1100px. */
function HeroPicture({ mode, eager }: { mode: Mode; eager: boolean }) {
  const desktop = getPhoto(shotFor(mode, "desktop").shot);
  const mobile = getPhoto(shotFor(mode, "mobile").shot);
  if (!desktop || !mobile) return null;
  const d = getImageProps({ alt: "", quality: 85, src: desktop.src, width: desktop.width, height: desktop.height, sizes: "130vw" }).props;
  const m = getImageProps({ alt: "", quality: 85, src: mobile.src, width: mobile.width, height: mobile.height, sizes: "150vw" }).props;
  return (
    <picture>
      <source media="(min-width: 1100px)" srcSet={d.srcSet} sizes={d.sizes} />
      <source media="(max-width: 1099.98px)" srcSet={m.srcSet} sizes={m.sizes} />
      <img
        src={m.src}
        alt=""
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

export function Hero() {
  const hasDay = shotFor("day", "desktop").exists;
  const hasNight = shotFor("night", "desktop").exists;
  const { mode, ready } = useMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<LatteEngine | null>(null);
  const [pattern, setPattern] = useState(0);
  const [webgl, setWebgl] = useState(true);
  const [coarse, setCoarse] = useState(false);
  const now = useCafeClock();

  // Start the fluid once and pour the first heart.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 820px)").matches;
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    const engine = LatteEngine.create(canvas, { simRes: small ? 96 : 128, dyeRes: small ? 384 : 640, reducedMotion });
    if (!engine) {
      setWebgl(false);
      return;
    }
    engineRef.current = engine;
    engine.onPattern(setPattern);
    // In the photo the candle stands at the upper left; in the drawn scene at the upper right.
    engine.setLightSide(hasNight ? -1 : 1);
    engine.setNight(document.documentElement.dataset.mode === "night", true);
    const pourTimer = window.setTimeout(() => engine.pour(0, false), reducedMotion ? 0 : 450);

    const resize = new ResizeObserver(() => engine.resize());
    resize.observe(canvas);
    const visible = new IntersectionObserver(([entry]) => engine.setVisible(entry.isIntersecting), { threshold: 0.05 });
    visible.observe(canvas);
    const onVisibility = () => engine.setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(pourTimer);
      resize.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
    // Created once: the set of photos does not change while the page is open.
  }, []);

  useEffect(() => {
    if (ready) engineRef.current?.setNight(mode === "night");
  }, [mode, ready]);

  const status = now ? openStatus(now) : null;
  const minutes = now ? cafeParts(now).minutes : null;
  const part = minutes === null ? null : daypartOf(minutes);
  const next = (pattern + 1) % PATTERNS.length;

  return (
    <section className="hero relative lg:h-[100svh] lg:min-h-[680px]" aria-labelledby="hero-title">
      {/* ---------- The table: photo, or drawn terrazzo and cup when a photo is missing ---------- */}
      <div className="hero-stage relative h-[66svh] min-h-[400px] select-none overflow-hidden lg:absolute lg:inset-0 lg:h-auto" style={stageVars()}>
        <div className="hero-layer hero-layer--day absolute inset-0">
          {hasDay ? (
            <div className="hero-photo hero-photo--day">
              <HeroPicture mode="day" eager />
            </div>
          ) : (
            <>
              <div className="hero-table absolute inset-0" />
              <div className="hero-art hero-art--day">
                <CupArt />
              </div>
              <div className="hero-window absolute inset-0" aria-hidden />
            </>
          )}
        </div>

        <div className="hero-layer hero-layer--night absolute inset-0">
          {hasNight ? (
            <div className="hero-photo hero-photo--night">
              <HeroPicture mode="night" eager={mode === "night"} />
            </div>
          ) : (
            <>
              <div className="hero-table hero-table--night absolute inset-0" />
              <div className="hero-candle absolute" aria-hidden>
                <span className="hero-candle__flame" />
              </div>
              <div className="hero-art hero-art--night">
                <GlassArt />
              </div>
            </>
          )}
        </div>

        {/* ---------- The live liquid, laid exactly over the coffee or the wine ---------- */}
        <div className="hero-liquid">
          <canvas
            ref={canvasRef}
            className={clsx("latte-canvas h-full w-full rounded-full", !webgl && "hidden")}
            aria-label="Латте в чашке. Проведите по нему, чтобы размешать."
            role="img"
          />
          {!webgl && <StaticLatte night={mode === "night"} />}
        </div>

        <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden />
      </div>

      {/* ---------- Words ---------- */}
      <div className="container-page relative flex flex-col gap-8 pb-14 pt-8 lg:pointer-events-none lg:absolute lg:inset-0 lg:justify-center lg:pb-24 lg:pt-[110px]">
        <div className="lg:pointer-events-auto lg:max-w-[31rem]">
          <p className="eyebrow">
            {CAFE.city} · {CAFE.street}
          </p>
          <h1 id="hero-title" className="display mt-5 text-[clamp(3.2rem,6.6vw,7rem)] font-light leading-[0.9]">
            <span className="only-day">
              Днём здесь
              <br />
              варят <em className="font-normal">кофе</em>
            </span>
            <span className="only-night">
              Вечером здесь
              <br />
              наливают <em className="font-normal">вино</em>
            </span>
          </h1>
          <p className="mt-6 max-w-[27rem] text-[17.5px] leading-relaxed text-ink-2">
            <span className="only-day">Спешелти своей обжарки, завтраки до 16:00 и круассаны из печи каждые сорок минут.</span>
            <span className="only-night">Натуральные вина, маленькие тарелки и винил по пятницам. После шести мы приглушаем свет.</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton href="/booking">Забронировать столик</MagneticButton>
            <TransitionLink href="/menu" className="btn-ghost bg-paper/40 backdrop-blur-sm">
              Смотреть меню
            </TransitionLink>
          </div>
          <div className="mt-8 flex flex-col gap-1 text-[15px]" aria-label="Сейчас в кофейне">
            <p className="flex flex-wrap items-center gap-x-2.5 font-semibold">
              <span className={clsx("h-2 w-2 rounded-full", status?.open ? "bg-honey shadow-[0_0_10px_rgb(var(--honey))]" : "bg-ink-3")} />
              <span suppressHydrationWarning>{status ? status.label : "Открыто с 08:00"}</span>
              <span className="tabular font-normal text-ink-2" suppressHydrationWarning>
                {minutes !== null ? `· ${minutesToHHMM(minutes)} ${CAFE.cityIn}` : ""}
              </span>
            </p>
            <p className="text-ink-2" suppressHydrationWarning>
              {part && status?.open ? <>Сейчас подаём {SERVING[part]}.</> : <>Утром начинаем с эспрессо и круассанов.</>}
            </p>
          </div>
        </div>
      </div>

      {/* Latte controls: under the cup on wide screens, after the text on phones */}
      <div className="container-page -mt-6 flex flex-col gap-3 pb-14 lg:absolute lg:bottom-7 lg:left-[64%] lg:mt-0 lg:w-auto lg:-translate-x-1/2 lg:flex-row lg:items-center lg:gap-4 lg:px-0 lg:pb-0">
        <button
          type="button"
          onClick={() => engineRef.current?.pour(next)}
          disabled={!webgl}
          className="group inline-flex h-12 shrink-0 items-center gap-3 self-start rounded-full border border-line/20 bg-paper/75 pl-2 pr-5 text-[15px] font-semibold backdrop-blur-md transition-colors hover:border-ink/60 disabled:opacity-50 lg:self-auto"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-silk group-hover:rotate-[-40deg]">
            <PitcherIcon />
          </span>
          <span className="only-day">Налить ещё: {PATTERNS[next].toLowerCase()}</span>
          <span className="only-night">Налить ещё бокал</span>
        </button>
        <p className="text-[14px] leading-snug text-ink-2 lg:w-[16rem] lg:rounded-xl lg:bg-paper/70 lg:px-3 lg:py-2 lg:backdrop-blur-md">
          {coarse ? "Проведите пальцем по чашке: " : "Проведите курсором по чашке: "}
          <span className="only-day">латте настоящий, его можно размешать.</span>
          <span className="only-night">вино закручивается, как в бокале.</span>
        </p>
      </div>
    </section>
  );
}

function PitcherIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h9l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" />
      <path d="M15 9h2a2 2 0 0 1 0 4h-2.4" />
      <path d="M6 7 4 4.5" />
    </svg>
  );
}
