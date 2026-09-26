import "server-only";
import { randomInt } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import {
  DAYS_AHEAD,
  LEAD_MINUTES,
  SLOT_MINUTES,
  rankTables,
  slotStarts,
  tableFits,
  windowFor,
} from "./booking-rules";
import { ensureDemoBookings } from "./demo";
import { addDays, cafeDateKey, cafeInstant, cafeParts, daypartOf, hhmmToMinutes, minutesToHHMM } from "./time";
import type { BookingInput } from "./validation";
import type { BookingStatus } from "./booking-rules";
import type { Daypart } from "./cafe";

export type SlotAvailability = {
  time: string;
  minutes: number;
  daypart: Daypart;
  /** Tables that fit the party and are free for the whole booking window */
  free: number;
  past: boolean;
};

export type TableState = {
  id: string;
  code: string;
  label: string;
  zone: string;
  seatsMin: number;
  seatsMax: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: string;
  rotation: number;
  note: string | null;
  fits: boolean;
  free: boolean;
};

function loadTables() {
  return prisma.diningTable.findMany({ where: { active: true }, orderBy: { sort: "asc" } });
}

async function occupiedSlots(dateKey: string): Promise<Set<string>> {
  const rows = await prisma.bookingSlot.findMany({
    where: { slot: { gte: cafeInstant(dateKey, 0), lt: cafeInstant(dateKey, 25 * 60) } },
    select: { tableId: true, slot: true },
  });
  return new Set(rows.map((r) => `${r.tableId}|${r.slot.getTime()}`));
}

function isFree(occupied: Set<string>, tableId: string, dateKey: string, start: number, end: number) {
  for (let m = start; m < end; m += SLOT_MINUTES) {
    if (occupied.has(`${tableId}|${cafeInstant(dateKey, m).getTime()}`)) return false;
  }
  return true;
}

function isPast(dateKey: string, start: number, now: Date) {
  const today = cafeDateKey(now);
  if (dateKey < today) return true;
  return dateKey === today && start < cafeParts(now).minutes + LEAD_MINUTES;
}

export function bookableDates(now: Date = new Date()): string[] {
  const today = cafeDateKey(now);
  return Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i));
}

export async function getAvailability(dateKey: string, guests: number, now: Date = new Date()): Promise<SlotAvailability[]> {
  await ensureDemoBookings(dateKey, now);
  const [tables, occupied] = await Promise.all([loadTables(), occupiedSlots(dateKey)]);
  const fitting = tables.filter((t) => tableFits(t, guests, dateKey));
  return slotStarts(dateKey).map((start) => {
    const { end } = windowFor(dateKey, start, guests);
    const past = isPast(dateKey, start, now);
    const free = past ? 0 : fitting.filter((t) => isFree(occupied, t.id, dateKey, start, end)).length;
    return { time: minutesToHHMM(start), minutes: start, daypart: daypartOf(start), free, past };
  });
}

export async function getTableStates(dateKey: string, time: string | null, guests: number, now: Date = new Date()): Promise<TableState[]> {
  await ensureDemoBookings(dateKey, now);
  const [tables, occupied] = await Promise.all([loadTables(), occupiedSlots(dateKey)]);
  const start = time ? hhmmToMinutes(time) : null;
  const end = start === null ? null : windowFor(dateKey, start, guests).end;
  return tables.map((t) => ({
    id: t.id,
    code: t.code,
    label: t.label,
    zone: t.zone,
    seatsMin: t.seatsMin,
    seatsMax: t.seatsMax,
    x: t.x,
    y: t.y,
    w: t.w,
    h: t.h,
    shape: t.shape,
    rotation: t.rotation,
    note: t.note,
    fits: tableFits(t, guests, dateKey),
    free: start === null || end === null ? true : isFree(occupied, t.id, dateKey, start, end),
  }));
}

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function makeCode() {
  let s = "SV-";
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return s;
}

export type CreateResult =
  | { ok: true; code: string; bookingId: string }
  | { ok: false; reason: "conflict" | "full" | "unavailable"; message: string };

export async function createBooking(input: BookingInput, source: "site" | "admin" = "site", now: Date = new Date()): Promise<CreateResult> {
  const dateKey = input.date;
  const today = cafeDateKey(now);
  if (dateKey < today || dateKey > addDays(today, DAYS_AHEAD - 1)) {
    return { ok: false, reason: "unavailable", message: `Онлайн-бронь открыта на ${DAYS_AHEAD} дней вперёд. Выберите другую дату.` };
  }
  const start = hhmmToMinutes(input.time);
  if (!slotStarts(dateKey).includes(start)) {
    return { ok: false, reason: "unavailable", message: "В это время мы не принимаем гостей. Выберите время из списка." };
  }
  if (source === "site" && isPast(dateKey, start, now)) {
    return { ok: false, reason: "unavailable", message: "До этого времени меньше 30 минут. Позвоните нам, и мы посадим вас без брони." };
  }

  const { end } = windowFor(dateKey, start, input.guests);
  const [tables, occupied] = await Promise.all([loadTables(), occupiedSlots(dateKey)]);
  let candidates = tables.filter((t) => tableFits(t, input.guests, dateKey));
  if (input.tableId) candidates = candidates.filter((t) => t.id === input.tableId);
  const free = rankTables(candidates.filter((t) => isFree(occupied, t.id, dateKey, start, end)));

  const conflict: CreateResult = input.tableId
    ? { ok: false, reason: "conflict", message: "Этот столик только что заняли. Выберите другой: план уже обновлён." }
    : { ok: false, reason: "full", message: "На это время свободных столов нет. Посмотрите соседнее время." };
  if (!free.length) return conflict;

  const slots: number[] = [];
  for (let m = start; m < end; m += SLOT_MINUTES) slots.push(m);

  // If two guests grab the same table at once, the unique (tableId, slot) index rejects the second write.
  // For "any table" we then try the next free one.
  for (const table of free.slice(0, 3)) {
    try {
      const booking = await prisma.booking.create({
        data: {
          code: makeCode(),
          tableId: table.id,
          startsAt: cafeInstant(dateKey, start),
          endsAt: cafeInstant(dateKey, end),
          guests: input.guests,
          name: input.name,
          phone: input.phone,
          comment: input.comment ? input.comment : null,
          occasion: input.occasion ?? null,
          eventSlug: input.eventSlug ?? null,
          source,
          slots: { create: slots.map((m) => ({ tableId: table.id, slot: cafeInstant(dateKey, m) })) },
        },
      });
      return { ok: true, code: booking.code, bookingId: booking.id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        if (input.tableId) return conflict;
        continue;
      }
      throw error;
    }
  }
  return conflict;
}

export async function getBookingByCode(code: string) {
  return prisma.booking.findUnique({ where: { code }, include: { table: true } });
}

export type CancelResult = { ok: true } | { ok: false; message: string };

export async function cancelByGuest(code: string, phoneLast4: string, now: Date = new Date()): Promise<CancelResult> {
  const booking = await prisma.booking.findUnique({ where: { code } });
  if (!booking) return { ok: false, message: "Бронь не найдена. Проверьте код." };
  if (booking.status === "cancelled") return { ok: true };
  if (!booking.phone.endsWith(phoneLast4)) return { ok: false, message: "Цифры не совпадают с номером в брони." };
  if (booking.startsAt.getTime() <= now.getTime()) return { ok: false, message: "Бронь уже началась. Позвоните нам, пожалуйста." };
  await prisma.$transaction([
    prisma.bookingSlot.deleteMany({ where: { bookingId: booking.id } }),
    prisma.booking.update({ where: { id: booking.id }, data: { status: "cancelled" } }),
  ]);
  return { ok: true };
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  const releases = status === "cancelled" || status === "no_show";
  await prisma.$transaction([
    ...(releases ? [prisma.bookingSlot.deleteMany({ where: { bookingId: id } })] : []),
    prisma.booking.update({ where: { id }, data: { status } }),
  ]);
}

export async function getDayBookings(dateKey: string, now: Date = new Date()) {
  await ensureDemoBookings(dateKey, now);
  return prisma.booking.findMany({
    where: { startsAt: { gte: cafeInstant(dateKey, 0), lt: cafeInstant(dateKey, 24 * 60) } },
    include: { table: true },
    orderBy: [{ startsAt: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllTables() {
  return prisma.diningTable.findMany({ orderBy: { sort: "asc" } });
}
