"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useMode } from "@/components/mode/ModeProvider";
import { useLenis } from "@/components/layout/SmoothScroll";
import { DrinkAnatomy } from "@/components/coffee/DrinkAnatomy";
import { Reveal } from "@/components/ui/Reveal";
import { DAYPARTS, type Daypart } from "@/lib/cafe";
import { DuskInterlude } from "./DuskInterlude";
import { FloatingPreview } from "./FloatingPreview";
import { MenuRow } from "./MenuRow";
import type { MenuCategoryView, MenuItemView } from "./types";

const ACTS: { id: Daypart; title: string; time: string; categories: string[]; lead: string }[] = [
  {
    id: "morning",
    title: "Утро",
    time: "08:00",
    categories: ["coffee", "tea", "breakfast", "bakery"],
    lead: "Кофе своей обжарки, завтраки до 16:00 и выпечка из печи.",
  },
  {
    id: "day",
    title: "День",
    time: "12:00",
    categories: ["lunch", "desserts"],
    lead: "Суп дня, салаты и паста. Десерты подаём весь день.",
  },
  {
    id: "evening",
    title: "Вечер",
    time: "18:00",
    categories: ["plates", "mains", "wine", "cocktails"],
    lead: "Маленькие тарелки на компанию, горячее, вино и коктейли.",
  },
];

const HEADER = 72;
const NAV = 58;

export function MenuDay({ categories, nowPart }: { categories: MenuCategoryView[]; nowPart: Daypart }) {
  const { force, overrideToggle } = useMode();
  const lenis = useLenis();
  const [phase, setPhase] = useState<"day" | "night">("day");
  const [hovered, setHovered] = useState<MenuItemView | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const byslug = useMemo(() => new Map(categories.map((c) => [c.slug, c])), [categories]);
  const coffee = byslug.get("coffee");
  const drinks = useMemo(() => (coffee?.items ?? []).filter((i) => i.anatomy), [coffee]);
  const [drinkSlug, setDrinkSlug] = useState("cappuccino");
  const drink = drinks.find((d) => d.slug === drinkSlug) ?? drinks[0];

  // The light of the page follows the menu: day above the 18:00 band, night below it.
  useEffect(() => {
    force(phase);
  }, [phase, force]);
  useEffect(() => () => force(null), [force]);

  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -(HEADER + NAV + 12) });
      else el.scrollIntoView({ behavior: "smooth" });
    },
    [lenis],
  );

  // On this page the light switch walks you to the morning or to the evening instead.
  useEffect(() => {
    overrideToggle((current) => scrollToId(current === "night" ? "act-morning" : "act-evening"));
    return () => overrideToggle(null);
  }, [overrideToggle, scrollToId]);

  // Which category is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const c of categories) {
      const el = document.getElementById(c.slug);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [categories]);

  const onPhase = useCallback((p: "day" | "night") => setPhase((prev) => (prev === p ? prev : p)), []);

  const renderCategory = (cat: MenuCategoryView) => {
    const isCoffee = cat.slug === "coffee";
    return (
      <section key={cat.slug} id={cat.slug} className="scroll-mt-40 pt-16 first:pt-10 md:pt-24" aria-labelledby={`${cat.slug}-title`}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line/20 pb-5">
          <div>
            <h3 id={`${cat.slug}-title`} className="display-semi text-d-3 font-normal">
              {cat.title}
            </h3>
            {cat.subtitle && <p className="mt-2 max-w-xl text-[15.5px] text-ink-2">{cat.subtitle}</p>}
          </div>
          <p className="font-label text-[15px] font-semibold uppercase tracking-[0.16em] text-ink-2">{cat.serves}</p>
        </div>

        {isCoffee && drink ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <div>
              <div className="mt-8 rounded-[24px] border border-line/10 bg-surface p-5 lg:hidden">
                <p className="eyebrow mb-4">Анатомия: {drink.title}</p>
                <DrinkAnatomy drink={{ slug: drink.slug, title: drink.title, anatomy: drink.anatomy! }} className="mx-auto max-w-[240px]" />
              </div>
              <ul>
                {cat.items.map((item) => (
                  <MenuRow
                    key={item.slug}
                    item={item}
                    open={open === item.slug}
                    onToggle={() => {
                      if (item.anatomy) setDrinkSlug(item.slug);
                      setOpen((o) => (o === item.slug ? null : item.slug));
                    }}
                    onHover={(i) => {
                      if (i?.anatomy) setDrinkSlug(i.slug);
                    }}
                  />
                ))}
              </ul>
            </div>
            <aside className="hidden lg:block" aria-label="Анатомия напитка">
              <div className="sticky top-[160px] mt-8 rounded-[24px] border border-line/10 bg-surface p-6">
                <p className="eyebrow mb-5">Наведите на напиток</p>
                <DrinkAnatomy drink={{ slug: drink.slug, title: drink.title, anatomy: drink.anatomy! }} />
              </div>
            </aside>
          </div>
        ) : (
          <ul>
            {cat.items.map((item) => (
              <MenuRow
                key={item.slug}
                item={item}
                open={open === item.slug}
                onToggle={() => setOpen((o) => (o === item.slug ? null : item.slug))}
                onHover={setHovered}
              />
            ))}
          </ul>
        )}
      </section>
    );
  };

  const renderAct = (act: (typeof ACTS)[number]) => (
    <div key={act.id} id={`act-${act.id}`} className="container-page scroll-mt-32 pb-8 pt-20 md:pt-28">
      <Reveal className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-end md:gap-12">
        <p className="display tabular text-[clamp(4.5rem,12vw,10rem)] font-light leading-[0.8]">{act.time}</p>
        <div className="md:pb-2">
          <h2 className="display text-d-3 font-light">
            {act.title}
            {act.id === nowPart && <span className="ml-4 align-middle font-sans text-[14px] font-semibold text-honey-ink">сейчас подаём</span>}
          </h2>
          <p className="mt-2 max-w-md text-[16px] text-ink-2">{act.lead}</p>
        </div>
      </Reveal>
      {act.categories.map((slug) => byslug.get(slug)).filter((c): c is MenuCategoryView => Boolean(c)).map(renderCategory)}
    </div>
  );

  return (
    <>
      <header id="act-top" className="container-page pt-32 md:pt-40">
        <p className="eyebrow">Меню «Светотени»</p>
        <h1 className="display mt-5 text-d-1 font-light">
          Один день
          <br />
          <em className="font-normal">в меню</em>
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-[17.5px] leading-relaxed text-ink-2">
            Листайте от утреннего эспрессо до последнего бокала. Наведите на блюдо, чтобы увидеть фото, на телефоне нажмите на
            строку.
          </p>
          {nowPart !== "morning" && (
            <button type="button" onClick={() => scrollToId(`act-${nowPart}`)} className="btn-ghost self-start md:self-auto">
              Сейчас {DAYPARTS[nowPart].title.toLowerCase()}: к этому меню
            </button>
          )}
        </div>
      </header>

      <nav
        aria-label="Разделы меню"
        className="sticky z-30 mt-10 border-y border-line/10 bg-paper/85 backdrop-blur-xl"
        style={{ top: HEADER }}
      >
        <div className="container-page">
          <ul className="-mx-2 flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]" data-lenis-prevent>
            {categories.map((c) => (
              <li key={c.slug} className="shrink-0">
                <a
                  href={`#${c.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(c.slug);
                  }}
                  aria-current={active === c.slug ? "true" : undefined}
                  className={clsx(
                    "inline-flex min-h-[40px] items-center rounded-full px-3.5 text-[14.5px] font-medium transition-colors",
                    active === c.slug ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {renderAct(ACTS[0])}
      {renderAct(ACTS[1])}
      <DuskInterlude onPhase={onPhase} />
      {renderAct(ACTS[2])}

      <FloatingPreview item={hovered} />
    </>
  );
}
