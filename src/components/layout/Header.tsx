"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ModeToggle } from "@/components/mode/ModeToggle";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Mark, Wordmark } from "@/components/ui/Logo";
import { CAFE, HOURS_TABLE } from "@/lib/cafe";

const NAV = [
  { href: "/menu", label: "Меню" },
  { href: "/booking", label: "Бронь" },
  { href: "/#evenings", label: "Вечера" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Перейти к содержанию
      </a>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open ? "border-b border-line/10 bg-paper/80 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-[72px] items-center gap-6">
          <TransitionLink href="/" className="flex items-center gap-2.5 text-ink" aria-label="Светотень, на главную">
            <Mark className="h-8 w-8" />
            <Wordmark className="text-[30px] leading-none" />
          </TransitionLink>

          <nav aria-label="Основные разделы" className="ml-auto hidden md:block">
            <ul className="flex items-center gap-7 text-[15.5px] font-medium">
              {NAV.map((item) => {
                const active = item.href === pathname;
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx("link-underline py-2 transition-colors", active ? "text-ink" : "text-ink-2 hover:text-ink")}
                    >
                      {item.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <ModeToggle className="hidden sm:inline-flex" />
            <ModeToggle compact className="sm:hidden" />
            <MagneticButton href="/booking" className="hidden !min-h-[44px] lg:inline-flex">
              Забронировать
            </MagneticButton>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line/20 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
              <span className="relative block h-3 w-5">
                <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-[72px] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Меню сайта" className="container-page flex-1 overflow-y-auto py-8">
              <ul className="flex flex-col gap-1">
                {[{ href: "/", label: "Главная" }, ...NAV].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <TransitionLink href={item.href} className="display block py-1.5 text-[52px] font-light leading-none">
                      {item.label}
                    </TransitionLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 grid gap-6 border-t border-line/10 pt-8 text-[15px] text-ink-2">
                <div>
                  <p className="eyebrow mb-2">Адрес</p>
                  <p className="text-ink">
                    {CAFE.city}, {CAFE.street}
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-2">Часы</p>
                  <ul className="tabular">
                    {HOURS_TABLE.map((row) => (
                      <li key={row.days} className="flex justify-between gap-4">
                        <span>{row.days}</span>
                        <span className="text-ink">{row.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <MagneticButton href="/booking" className="w-full">
                  Забронировать столик
                </MagneticButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
