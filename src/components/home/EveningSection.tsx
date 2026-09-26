import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import type { UpcomingEvent } from "@/data/events";
import { rub } from "@/lib/format";
import { formatDay, relativeDayLabel } from "@/lib/time";

function eventTime(ev: UpcomingEvent) {
  const start = new Date(ev.startsAt);
  const end = new Date(ev.endsAt);
  const fmt = (d: Date) => d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" });
  return `${fmt(start)}–${fmt(end)}`;
}

/** Always dark: this is the evening, whatever the time of day on the rest of the page. */
export function EveningSection({ events }: { events: UpcomingEvent[] }) {
  return (
    <section id="evenings" className="container-page scroll-mt-24 pt-28 md:pt-40" aria-labelledby="evenings-title">
      <div className="tone-night relative overflow-hidden rounded-[32px] px-5 py-12 sm:px-10 md:px-14 md:py-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgb(240_168_74/0.22),transparent_65%)]"
          aria-hidden
        />
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow">После шести</p>
              <h2 id="evenings-title" className="display mt-5 text-d-2 font-light">
                Вечера
                <br />
                <em className="font-normal">при свечах</em>
              </h2>
              <p className="mt-6 max-w-md text-[17.5px] leading-relaxed text-ink-2">
                Вечером здесь другое меню и другой свет: натуральные вина по бокалам, маленькие тарелки на компанию и винил по
                пятницам.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <MediaFrame shot="wine-pour" alt="Красное вино наливают в большой бокал" sizes="(max-width: 1100px) 100vw, 40vw" className="aspect-[4/5] max-h-[460px] rounded-[24px] sm:aspect-[16/11] lg:aspect-[4/5]" />
              <TransitionLink href="/menu#wine" className="link-underline mt-4 inline-block text-[15.5px]">
                Винная карта: семь вин по бокалам от 690 ₽
              </TransitionLink>
            </Reveal>
          </div>

          <div>
            <p className="eyebrow">Афиша на ближайшие дни</p>
            <ul className="mt-6 divide-y divide-line/10 border-y border-line/10">
              {events.map((ev, i) => {
                const day = formatDay(ev.date);
                return (
                  <Reveal as="li" key={`${ev.slug}-${ev.date}`} delay={i * 0.06} className="grid grid-cols-[76px_minmax(0,1fr)] gap-5 py-7 sm:grid-cols-[92px_minmax(0,1fr)_132px] sm:gap-6">
                    <div className="leading-none">
                      <p className="display tabular text-[52px] font-light">{day.day}</p>
                      <p className="mt-2 text-[13.5px] uppercase tracking-[0.12em] text-ink-2">
                        {day.month.slice(0, 3)} · {day.weekdayShort}
                      </p>
                    </div>
                    <div>
                      <p className="text-[13.5px] text-honey-ink">
                        {relativeDayLabel(ev.date)}, {eventTime(ev)}
                      </p>
                      <h3 className="mt-1.5 text-[19px] font-semibold leading-snug">
                        {ev.title}
                        {ev.theme && <span className="font-normal text-ink-2">: {ev.theme.toLowerCase()}</span>}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{ev.blurb}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14.5px]">
                        <span className="tabular">{ev.price ? rub(ev.price) : "Вход свободный"}</span>
                        {ev.seats && <span className="text-ink-2">{ev.seats} мест</span>}
                        <TransitionLink href={`/booking?event=${ev.slug}&date=${ev.date}`} className="link-underline font-semibold text-honey-ink">
                          Забронировать место
                        </TransitionLink>
                      </div>
                    </div>
                    <MediaFrame shot={ev.photo} alt={ev.title} sizes="132px" className="hidden aspect-square rounded-[18px] sm:block" quiet />
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
