import { TransitionLink } from "@/components/transition/TransitionLink";
import { Mark, Wordmark } from "@/components/ui/Logo";
import { CAFE, HOURS_TABLE } from "@/lib/cafe";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line/10 pt-16">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Mark className="h-11 w-11 text-ink" />
            <p className="mt-5 text-[15.5px] text-ink-2">
              Кофейня днём, бистро вечером. Столы те же, меняется только свет.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Адрес</p>
            <p className="text-[15.5px]">
              {CAFE.city}
              <br />
              {CAFE.street}
            </p>
            <p className="mt-2 text-[14px] text-ink-2">{CAFE.landmark}</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Часы</p>
            <ul className="tabular space-y-1 text-[15.5px]">
              {HOURS_TABLE.map((row) => (
                <li key={row.days} className="flex justify-between gap-4">
                  <span className="text-ink-2">{row.days}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Связь</p>
            <a href={CAFE.phoneHref} className="link-underline tabular text-[15.5px]">
              {CAFE.phone}
            </a>
            <ul className="mt-4 space-y-1.5 text-[15.5px]">
              <li>
                <TransitionLink href="/menu" className="link-underline">
                  Меню
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/booking" className="link-underline">
                  Бронь столика
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/admin" className="link-underline text-ink-2">
                  Для владельца
                </TransitionLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page mt-16" aria-hidden>
        <Wordmark className="block text-[clamp(88px,23vw,340px)] leading-[0.8] text-ink" />
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-line/10 py-6 text-[13.5px] text-ink-2 sm:flex-row sm:justify-between">
        <p>© 2026 Светотень</p>
        <p>Концепт-проект для портфолио. Заведение, адрес и телефон вымышлены.</p>
      </div>
    </footer>
  );
}
