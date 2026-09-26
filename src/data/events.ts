// Weekly events. They repeat every week, so dates are computed, not stored.
import { addDays, cafeDateKey, cafeInstant, cafeParts, hhmmToMinutes, isoDayOf } from "@/lib/time";

export type EventKind = "vinyl" | "wine" | "cupping" | "workshop";

type Recurring = {
  slug: string;
  kind: EventKind;
  title: string;
  /** Rotating titles, picked by ISO week number */
  themes?: string[];
  isoDay: number;
  start: string;
  end: string;
  blurb: string;
  price: number | null;
  seats: number | null;
  photo: string;
};

export const RECURRING_EVENTS: Recurring[] = [
  {
    slug: "vinyl",
    kind: "vinyl",
    title: "Винил по пятницам",
    isoDay: 5,
    start: "20:00",
    end: "23:30",
    blurb: "Играют пластинки из коллекции наших гостей: джаз, соул, босса-нова. Вход свободный, столик лучше забронировать.",
    price: null,
    seats: null,
    photo: "event-vinyl",
  },
  {
    slug: "wine-tasting",
    kind: "wine",
    title: "Дегустация",
    themes: ["Оранжевые вина", "Красные вина Дона", "Игристое без шампанского", "Вина вулканов"],
    isoDay: 3,
    start: "19:30",
    end: "21:30",
    blurb: "Шесть бокалов с сомелье и сырная тарелка. Рассказываем, чем пахнет вино и почему.",
    price: 2900,
    seats: 12,
    photo: "event-wine-tasting",
  },
  {
    slug: "cupping",
    kind: "cupping",
    title: "Каппинг зерна недели",
    isoDay: 6,
    start: "11:00",
    end: "12:00",
    blurb: "Пробуем три новых лота вслепую и вместе выбираем зерно на следующую неделю.",
    price: 700,
    seats: 10,
    photo: "event-cupping",
  },
  {
    slug: "latte-art",
    kind: "workshop",
    title: "Латте-арт для начинающих",
    isoDay: 7,
    start: "12:00",
    end: "14:00",
    blurb: "Два часа за стойкой с бариста: взбиваем молоко, рисуем сердце, тюльпан и розетту.",
    price: 2500,
    seats: 6,
    photo: "event-latte-class",
  },
];

export type UpcomingEvent = Omit<Recurring, "themes" | "isoDay"> & {
  date: string;
  startsAt: string;
  endsAt: string;
  theme: string | null;
};

function isoWeek(dateKey: string): number {
  const d = new Date(Date.parse(`${dateKey}T12:00:00Z`));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7);
}

/** Next occurrences of the weekly events, soonest first. Events that already started today are skipped. */
export function upcomingEvents(now: Date = new Date(), count = 4): UpcomingEvent[] {
  const today = cafeDateKey(now);
  const nowMinutes = cafeParts(now).minutes;
  const list: UpcomingEvent[] = [];
  for (let offset = 0; offset < 21 && list.length < count * 3; offset++) {
    const date = addDays(today, offset);
    const iso = isoDayOf(date);
    for (const ev of RECURRING_EVENTS) {
      if (ev.isoDay !== iso) continue;
      if (offset === 0 && hhmmToMinutes(ev.start) <= nowMinutes) continue;
      const { themes, isoDay: _isoDay, ...rest } = ev;
      list.push({
        ...rest,
        date,
        startsAt: cafeInstant(date, hhmmToMinutes(ev.start)).toISOString(),
        endsAt: cafeInstant(date, hhmmToMinutes(ev.end)).toISOString(),
        theme: themes ? themes[isoWeek(date) % themes.length] : null,
      });
    }
  }
  return list.sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, count);
}

export function findEvent(slug: string) {
  return RECURRING_EVENTS.find((e) => e.slug === slug) ?? null;
}
