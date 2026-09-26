// Static facts about the café. Everything the site says about hours and contacts comes from here.

export const CAFE = {
  name: "Светотень",
  tagline: "Кофейня днём, бистро вечером",
  city: "Нижний Новгород",
  cityIn: "в Нижнем Новгороде",
  street: "ул. Светлая, 12",
  streetShort: "Светлая, 12",
  landmark: "5 минут пешком от Большой Покровской",
  phone: "+7 831 000-18-00",
  phoneHref: "tel:+78310001800",
  /** Moscow time, no DST: the fixed offset keeps date math deterministic. */
  timeZone: "Europe/Moscow",
  utcOffset: "+03:00",
  utcOffsetMinutes: 180,
  /** Minute of the day when the site and the menu switch to the evening. */
  eveningStartsAt: 18 * 60,
  /** Minute of the day when the site switches back to daylight. */
  dayStartsAt: 7 * 60,
} as const;

/** Opening hours by ISO weekday (1 = Monday ... 7 = Sunday). Minutes from midnight; 1440 = midnight. */
export const HOURS: Record<number, { open: number; close: number }> = {
  1: { open: 8 * 60, close: 23 * 60 },
  2: { open: 8 * 60, close: 23 * 60 },
  3: { open: 8 * 60, close: 23 * 60 },
  4: { open: 8 * 60, close: 23 * 60 },
  5: { open: 8 * 60, close: 24 * 60 },
  6: { open: 9 * 60, close: 24 * 60 },
  7: { open: 9 * 60, close: 23 * 60 },
};

export const HOURS_TABLE = [
  { days: "Пн–Чт", hours: "08:00–23:00", isoDays: [1, 2, 3, 4] },
  { days: "Пт", hours: "08:00–00:00", isoDays: [5] },
  { days: "Сб", hours: "09:00–00:00", isoDays: [6] },
  { days: "Вс", hours: "09:00–23:00", isoDays: [7] },
] as const;

export type Daypart = "morning" | "day" | "evening";

export const DAYPARTS: Record<Daypart, { title: string; range: string; from: number; to: number }> = {
  morning: { title: "Утро", range: "08:00–12:00", from: 0, to: 12 * 60 },
  day: { title: "День", range: "12:00–18:00", from: 12 * 60, to: 18 * 60 },
  evening: { title: "Вечер", range: "18:00–00:00", from: 18 * 60, to: 24 * 60 },
};

export const OCCASIONS = ["Просто так", "Свидание", "День рождения", "Деловая встреча", "С детьми"] as const;

/** The terrace is seasonal: May to September. */
export const TERRACE_MONTHS = [5, 6, 7, 8, 9];
