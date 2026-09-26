import { getBookingByCode } from "@/lib/booking";
import { CAFE } from "@/lib/cafe";
import { ZONES, type Zone } from "@/data/hall";
import { guestsLabel } from "@/lib/format";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** An .ics file so the guest can put the booking into any calendar. */
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const booking = await getBookingByCode(code.toUpperCase());
  if (!booking || booking.status === "cancelled") return new Response("Бронь не найдена", { status: 404 });

  const zone = ZONES[booking.table.zone as Zone]?.title ?? booking.table.zone;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Svetoten//Booking//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${booking.code}@svetoten`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(booking.startsAt)}`,
    `DTEND:${stamp(booking.endsAt)}`,
    `SUMMARY:${escape(`Столик в «Светотени» · ${guestsLabel(booking.guests)}`)}`,
    `LOCATION:${escape(`${CAFE.city}, ${CAFE.street}`)}`,
    `DESCRIPTION:${escape(`Бронь ${booking.code}. Стол ${booking.table.label}, ${zone.toLowerCase()}. Держим столик 15 минут. ${CAFE.phone}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Скоро ужин в «Светотени»",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="svetoten-${booking.code}.ics"`,
    },
  });
}
