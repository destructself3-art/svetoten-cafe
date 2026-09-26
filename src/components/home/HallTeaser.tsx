"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { HallPlan, type PlanTable } from "@/components/hall/HallPlan";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ZONES, type Zone } from "@/data/hall";

export function HallTeaser({ tables, terraceOpen }: { tables: PlanTable[]; terraceOpen: boolean }) {
  const [zone, setZone] = useState<Zone>("window");
  const [hover, setHover] = useState<Zone | null>(null);
  const shown = hover ?? zone;
  const info = ZONES[shown];
  const count = tables.filter((t) => t.zone === shown).length;
  const zones = (Object.keys(ZONES) as Zone[]).sort((a, b) => ZONES[a].order - ZONES[b].order);

  return (
    <section className="container-page pt-28 md:pt-40" aria-labelledby="hall-title">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="eyebrow">Зал</p>
          <h2 id="hall-title" className="display mt-5 text-d-2 font-light">
            Выберите столик
            <br />
            <em className="font-normal">заранее</em>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-xl text-[17.5px] leading-relaxed text-ink-2 lg:pb-3">
            {tables.length} столов в шести зонах. У окна солнечно до обеда, на диванах уютнее всего вечером, за общим столом
            помещаются восемь человек.{" "}
            {terraceOpen ? "Терраса открыта до 30 сентября." : "Терраса откроется в мае."}
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <Reveal className="rounded-[28px] border border-line/10 bg-surface p-3 sm:p-5">
          <HallPlan
            tables={tables}
            activeZone={shown}
            onZone={setHover}
            terraceOpen={terraceOpen}
            title="План зала «Светотени»: наведите на зону, чтобы увидеть её"
          />
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Зоны зала">
            {zones.map((z) => (
              <button
                key={z}
                type="button"
                role="tab"
                aria-selected={z === shown}
                onClick={() => setZone(z)}
                className={clsx(
                  "min-h-[40px] rounded-full border px-3.5 text-[14px] font-medium transition-colors",
                  z === shown ? "border-ink bg-ink text-paper" : "border-line/20 text-ink-2 hover:border-ink/60 hover:text-ink",
                )}
              >
                {ZONES[z].title}
              </button>
            ))}
          </div>
          <div className="relative mt-5 flex-1 overflow-hidden rounded-[24px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={shown}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <MediaFrame shot={info.photo} alt={`Зона «${info.title}»`} sizes="(max-width: 1100px) 100vw, 38vw" className="aspect-[4/3] h-full min-h-[240px] lg:aspect-auto" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-5">
            <p className="text-[19px] font-semibold">
              {info.title} <span className="font-normal text-ink-2">· {count} {count === 1 ? "стол" : count < 5 ? "стола" : "столов"}</span>
            </p>
            <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-2">{info.blurb}</p>
            <TransitionLink href="/booking" className="btn-primary mt-5">
              Выбрать столик
            </TransitionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
