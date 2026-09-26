import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { SLOT_MINUTES, slotStarts, tableFits } from "./booking-rules";
import { addDays, cafeDateKey, cafeInstant, daypartOf, isoDayOf } from "./time";

// Demo occupancy: in DEMO_BOOKINGS mode every day in the next two weeks gets a believable set of bookings,
// generated once per date and stored like real ones, so the floor plan and the admin panel never look empty.

const NAMES = [
  "Анна К.", "Михаил С.", "Ольга Р.", "Дмитрий", "Ксения В.", "Артём", "Мария Л.", "Иван П.", "Софья", "Никита Б.",
  "Екатерина", "Павел Д.", "Алина", "Сергей М.", "Вера Н.", "Глеб", "Полина Ш.", "Тимур", "Дарья Ф.", "Илья Г.",
];
const COMMENTS = [
  "У окна, если можно",
  "Будем с собакой, она спокойная",
  "День рождения, принесём свечу",
  "Нужен детский стул",
  "Опоздаем минут на 15",
  null, null, null, null, null, null,
];

const done = new Set<string>();

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export async function ensureDemoBookings(dateKey: string, now: Date = new Date()) {
  if (process.env.DEMO_BOOKINGS !== "true" || done.has(dateKey)) return;
  const today = cafeDateKey(now);
  if (dateKey < addDays(today, -1) || dateKey > addDays(today, 13)) return;

  const existing = await prisma.booking.count({
    where: { source: "demo", startsAt: { gte: cafeInstant(dateKey, 0), lt: cafeInstant(dateKey, 24 * 60) } },
  });
  done.add(dateKey);
  if (existing > 0) return;

  const random = rng(hash(`svetoten:${dateKey}`));
  const weekend = [5, 6].includes(isoDayOf(dateKey));
  const load = { morning: 0.1, day: 0.09, evening: weekend ? 0.2 : 0.14 };
  const tables = await prisma.diningTable.findMany({ where: { active: true } });
  const nowInstant = now.getTime();

  for (const table of tables) {
    let busyUntil = -1;
    for (const start of slotStarts(dateKey)) {
      if (start < busyUntil) continue;
      const part = daypartOf(start);
      if (random() > load[part]) continue;
      const guests = Math.max(table.seatsMin, Math.min(table.seatsMax, 1 + Math.floor(random() * table.seatsMax)));
      if (!tableFits(table, guests, dateKey)) continue;
      const length = part === "evening" ? 120 + (random() > 0.5 ? 30 : 0) : 60 + Math.floor(random() * 3) * 30;
      const end = start + length;
      busyUntil = end + 30;
      const startsAt = cafeInstant(dateKey, start);
      const endsAt = cafeInstant(dateKey, end);
      const past = endsAt.getTime() < nowInstant;
      const running = startsAt.getTime() <= nowInstant && !past;
      const roll = random();
      const status = past ? (roll < 0.08 ? "no_show" : "completed") : running ? "seated" : roll < 0.05 ? "cancelled" : "confirmed";
      const releases = status === "cancelled" || status === "no_show";
      const slots: Date[] = [];
      for (let m = start; m < end; m += SLOT_MINUTES) slots.push(cafeInstant(dateKey, m));
      try {
        await prisma.booking.create({
          data: {
            code: `DM-${hash(`${dateKey}${table.code}${start}`).toString(36).toUpperCase().slice(0, 6)}`,
            tableId: table.id,
            startsAt,
            endsAt,
            guests,
            name: NAMES[Math.floor(random() * NAMES.length)],
            phone: `7000000${String(Math.floor(random() * 10000)).padStart(4, "0")}`,
            comment: COMMENTS[Math.floor(random() * COMMENTS.length)],
            status,
            source: "demo",
            slots: releases ? undefined : { create: slots.map((slot) => ({ tableId: table.id, slot })) },
          },
        });
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;
      }
    }
  }
}
