// Booking rules shared by the server and the booking page. No database access here.
import { TERRACE_MONTHS } from "./cafe";
import { hoursFor, monthOf } from "./time";

export const SLOT_MINUTES = 30;
export const MAX_GUESTS = 8;
export const DAYS_AHEAD = 30;
/** Last seating: an hour before closing. */
export const LAST_SEATING_BEFORE_CLOSE = 60;
/** Online booking closes 30 minutes before the slot. */
export const LEAD_MINUTES = 30;

export function durationFor(guests: number): number {
  return guests >= 5 ? 150 : 120;
}

/** Start times offered for a day, as minutes from café midnight. */
export function slotStarts(dateKey: string): number[] {
  const { open, close } = hoursFor(dateKey);
  const out: number[] = [];
  for (let m = open; m <= close - LAST_SEATING_BEFORE_CLOSE; m += SLOT_MINUTES) out.push(m);
  return out;
}

/** Booking window in café minutes, capped at closing time. */
export function windowFor(dateKey: string, start: number, guests: number) {
  const { close } = hoursFor(dateKey);
  return { start, end: Math.min(start + durationFor(guests), close) };
}

export function terraceOpen(dateKey: string): boolean {
  return TERRACE_MONTHS.includes(monthOf(dateKey));
}

export type TableShape = {
  id: string;
  zone: string;
  seatsMin: number;
  seatsMax: number;
  active: boolean;
};

export function tableFits(table: TableShape, guests: number, dateKey: string): boolean {
  if (!table.active) return false;
  if (table.zone === "terrace" && !terraceOpen(dateKey)) return false;
  return guests >= table.seatsMin && guests <= table.seatsMax;
}

const ZONE_PREFERENCE = ["window", "hall", "sofa", "bar", "communal", "terrace"];

/** Best table for "any table": the smallest one that fits, then by zone preference. */
export function rankTables<T extends TableShape>(tables: T[]): T[] {
  return [...tables].sort(
    (a, b) => a.seatsMax - b.seatsMax || ZONE_PREFERENCE.indexOf(a.zone) - ZONE_PREFERENCE.indexOf(b.zone),
  );
}

export const BOOKING_STATUSES = ["confirmed", "seated", "completed", "cancelled", "no_show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: "Ждём",
  seated: "В зале",
  completed: "Ушли",
  cancelled: "Отменена",
  no_show: "Не пришли",
};
