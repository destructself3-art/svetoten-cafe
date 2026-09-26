import "server-only";
import { ZONES, type Zone } from "@/data/hall";
import { formatPhone, guestsLabel } from "./format";
import { cafeDateKey, cafeParts, formatDay, minutesToHHMM } from "./time";

type BookingForMessage = {
  code: string;
  startsAt: Date;
  guests: number;
  name: string;
  phone: string;
  comment: string | null;
  occasion: string | null;
  table: { label: string; zone: string };
};

/** Sends a new booking to the owner's Telegram chat when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set. */
export async function notifyNewBooking(booking: BookingForMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const day = formatDay(cafeDateKey(booking.startsAt));
  const time = minutesToHHMM(cafeParts(booking.startsAt).minutes);
  const zone = ZONES[booking.table.zone as Zone]?.title ?? booking.table.zone;
  const lines = [
    `Новая бронь ${booking.code}`,
    `${day.long}, ${time} · ${guestsLabel(booking.guests)}`,
    `Стол ${booking.table.label} · ${zone}`,
    `${booking.name}, ${formatPhone(booking.phone)}`,
    booking.occasion ? `Повод: ${booking.occasion}` : null,
    booking.comment ? `Комментарий: ${booking.comment}` : null,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // A failed notification must never break the booking itself.
  }
}
