"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Reveal } from "@/components/ui/Reveal";
import { DAYPARTS, type Daypart } from "@/lib/cafe";
import { rub } from "@/lib/format";
import { cafeParts, daypartOf } from "@/lib/time";

export type FeaturedItem = {
  slug: string;
  title: string;
  description: string;
  price: number;
  unit: string | null;
  photo: string | null;
  category: string;
  inStock: boolean;
};

const ORDER: Daypart[] = ["morning", "day", "evening"];

const HEADLINES: Record<Daypart, string> = {
  morning: "Завтраки, выпечка и кофе",
  day: "Обеды: суп дня и паста",
  evening: "Вино и маленькие тарелки",
};

export function NowServing({ groups, initialPart }: { groups: Record<Daypart, FeaturedItem[]>; initialPart: Daypart }) {
  const [current, setCurrent] = useState<Daypart>(initialPart);
  const [part, setPart] = useState<Daypart>(initialPart);

  // Keep "now" honest if the page stays open across a daypart boundary.
  useEffect(() => {
    let last = initialPart;
    const id = window.setInterval(() => {
      const next = daypartOf(cafeParts(new Date()).minutes);
      if (next === last) return;
      last = next;
      setCurrent(next);
      setPart(next);
    }, 60_000);
    return () => window.clearInterval(id);
  }, [initialPart]);

  const items = groups[part];

  return (
    <section className="container-page pt-28 md:pt-40" aria-labelledby="now-title">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="eyebrow">Сейчас в меню</p>
          <h2 id="now-title" className="display mt-5 text-d-2 font-light">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={part}
                className="block"
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {HEADLINES[part]}
              </motion.span>
            </AnimatePresence>
          </h2>
        </Reveal>

        <div role="tablist" aria-label="Время суток" className="flex gap-1 self-start rounded-full border border-line/15 bg-surface p-1 md:self-auto">
          {ORDER.map((p) => (
            <button
              key={p}
              role="tab"
              type="button"
              aria-selected={p === part}
              onClick={() => setPart(p)}
              className={clsx(
                "relative flex min-h-[44px] flex-col items-center justify-center rounded-full px-4 text-[14.5px] font-semibold transition-colors sm:px-5",
                p === part ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
              )}
            >
              <span className="flex items-center gap-1.5">
                {DAYPARTS[p].title}
                {p === current && <span className={clsx("h-1.5 w-1.5 rounded-full", p === part ? "bg-honey" : "bg-honey-ink")} aria-label="сейчас" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 lg:grid-cols-4 lg:gap-x-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, i) => (
            <motion.article
              key={`${part}-${item.slug}`}
              className="group"
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="overflow-hidden rounded-[22px]">
                <MediaFrame
                  shot={item.photo ?? "menu-croissant"}
                  alt={item.title}
                  sizes="(max-width: 1100px) 50vw, 25vw"
                  className="aspect-[4/5] transition-transform duration-[1.2s] ease-silk group-hover:scale-[1.04]"
                  quiet
                />
              </div>
              <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-2">{item.category}</p>
              <h3 className="mt-1.5 text-[17px] font-semibold leading-snug">{item.title}</h3>
              <p className="mt-1.5 hidden text-[15px] leading-relaxed text-ink-2 sm:block">{item.description}</p>
              <p className="tabular mt-2 text-[16px]">
                {rub(item.price)}
                {item.unit && <span className="text-ink-2"> · {item.unit}</span>}
                {!item.inStock && <span className="ml-2 text-[13px] text-wine">закончилось</span>}
              </p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-12">
        <TransitionLink href="/menu" className="btn-ghost">
          Всё меню: {DAYPARTS[part].title.toLowerCase()}, день и вечер
        </TransitionLink>
      </div>
    </section>
  );
}
