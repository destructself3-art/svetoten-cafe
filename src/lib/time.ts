// Café-time helpers. The café lives in Moscow time (UTC+3, no DST), whatever the visitor's clock says.
import { CAFE, DAYPARTS, HOURS, type Daypart } from "./cafe";

const OFFSET_MS = CAFE.utcOffsetMinutes * 60_000;

export type CafeParts = {
  year: number;
  month: number; // 1-12
  day: number;
  /** ISO weekday: 1 = Monday ... 7 = Sunday */
  isoDay: number;
  minutes: number; // minutes since café midnight
};

export function cafeParts(date: Date = new Date()): CafeParts {
  const shifted = new Date(date.getTime() + OFFSET_MS);
  const weekday = shifted.getUTCDay();
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    isoDay: weekday === 0 ? 7 : weekday,
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" of the café calendar day. */
export function cafeDateKey(date: Date = new Date()): string {
  const p = cafeParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** The UTC instant of a café wall-clock time. `minutes` may reach 1440 (midnight of the next day). */
export function cafeInstant(dateKey: string, minutes: number): Date {
  const base = Date.parse(`${dateKey}T00:00:00${CAFE.utcOffset}`);
  return new Date(base + minutes * 60_000);
}

export function minutesToHHMM(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function addDays(dateKey: string, days: number): string {
  const d = new Date(Date.parse(`${dateKey}T12:00:00Z`) + days * 86_400_000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function isoDayOf(dateKey: string): number {
  const d = new Date(Date.parse(`${dateKey}T12:00:00Z`)).getUTCDay();
  return d === 0 ? 7 : d;
}

export function monthOf(dateKey: string): number {
  return Number(dateKey.slice(5, 7));
}

export function hoursFor(dateKey: string) {
  return HOURS[isoDayOf(dateKey)];
}

export function daypartOf(minutes: number): Daypart {
  if (minutes >= DAYPARTS.evening.from || minutes < 4 * 60) return "evening";
  if (minutes >= DAYPARTS.day.from) return "day";
  return "morning";
}

/** Day or night look of the site at a given moment of café time. */
export function modeAt(date: Date = new Date()): "day" | "night" {
  const { minutes } = cafeParts(date);
  return minutes >= CAFE.dayStartsAt && minutes < CAFE.eveningStartsAt ? "day" : "night";
}

export type OpenStatus = {
  open: boolean;
  /** Short line for the UI, e.g. "Открыто до 23:00" */
  label: string;
  /** Minutes until the next change (closing or opening) */
  minutesLeft: number;
};

export function openStatus(now: Date = new Date()): OpenStatus {
  const p = cafeParts(now);
  const today = cafeDateKey(now);
  const h = hoursFor(today);
  // After midnight, Friday and Saturday nights are still "yesterday" until close; hours never pass 24:00 here.
  if (p.minutes >= h.open && p.minutes < h.close) {
    const left = h.close - p.minutes;
    const closeLabel = minutesToHHMM(h.close);
    if (left <= 60) return { open: true, label: `Открыто, закроемся через ${left} мин`, minutesLeft: left };
    return { open: true, label: `Открыто до ${closeLabel}`, minutesLeft: left };
  }
  if (p.minutes < h.open) {
    return { open: false, label: `Закрыто, откроемся в ${minutesToHHMM(h.open)}`, minutesLeft: h.open - p.minutes };
  }
  const tomorrow = hoursFor(addDays(today, 1));
  return {
    open: false,
    label: `Закрыто, завтра с ${minutesToHHMM(tomorrow.open)}`,
    minutesLeft: 1440 - p.minutes + tomorrow.open,
  };
}

const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const WEEKDAYS = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
const WEEKDAYS_SHORT = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const WEEKDAYS_ACC = ["понедельник", "вторник", "среду", "четверг", "пятницу", "субботу", "воскресенье"];

export function formatDay(dateKey: string) {
  const [, m, d] = dateKey.split("-").map(Number);
  const iso = isoDayOf(dateKey);
  return {
    day: d,
    month: MONTHS_GEN[m - 1],
    weekday: WEEKDAYS[iso - 1],
    weekdayShort: WEEKDAYS_SHORT[iso - 1],
    weekdayAcc: WEEKDAYS_ACC[iso - 1],
    /** "26 сентября" */
    dayMonth: `${d} ${MONTHS_GEN[m - 1]}`,
    /** "пятница, 26 сентября" */
    long: `${WEEKDAYS[iso - 1]}, ${d} ${MONTHS_GEN[m - 1]}`,
  };
}

/** "сегодня", "завтра" or a weekday+date label relative to the café calendar. */
export function relativeDayLabel(dateKey: string, now: Date = new Date()): string {
  const today = cafeDateKey(now);
  if (dateKey === today) return "сегодня";
  if (dateKey === addDays(today, 1)) return "завтра";
  return formatDay(dateKey).long;
}
