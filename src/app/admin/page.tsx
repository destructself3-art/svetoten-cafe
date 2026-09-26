import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBoard, type AdminBooking } from "@/components/admin/AdminBoard";
import { PhoneBookingForm } from "@/components/admin/PhoneBookingForm";
import { findEvent } from "@/data/events";
import { requireAdmin } from "@/lib/auth";
import { getAllTables, getDayBookings } from "@/lib/booking";
import { SLOT_MINUTES, type BookingStatus } from "@/lib/booking-rules";
import { formatPhone } from "@/lib/format";
import { addDays, cafeDateKey, cafeParts, formatDay, hoursFor, relativeDayLabel } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await requireAdmin();
  const { date: requested } = await searchParams;
  const now = new Date();
  const today = cafeDateKey(now);
  const date = requested && /^\d{4}-\d{2}-\d{2}$/.test(requested) ? requested : today;
  const [rows, tables] = await Promise.all([getDayBookings(date, now), getAllTables()]);
  const { open, close } = hoursFor(date);

  const bookings: AdminBooking[] = rows.map((b) => ({
    id: b.id,
    code: b.code,
    tableId: b.tableId,
    tableLabel: b.table.label,
    zone: b.table.zone,
    start: cafeParts(b.startsAt).minutes,
    end: cafeParts(b.endsAt).minutes || 1440,
    guests: b.guests,
    name: b.name,
    phone: formatPhone(b.phone),
    phoneHref: `tel:+${b.phone}`,
    comment: b.comment,
    occasion: b.occasion,
    event: b.eventSlug ? findEvent(b.eventSlug)?.title ?? null : null,
    status: b.status as BookingStatus,
    source: b.source,
  }));

  const active = bookings.filter((b) => b.status !== "cancelled" && b.status !== "no_show");
  const guests = active.reduce((sum, b) => sum + b.guests, 0);
  const eveningFrom = 18 * 60;
  const eveningSlots = Math.max(1, ((close - eveningFrom) / SLOT_MINUTES) * tables.length);
  const eveningBooked = active.reduce((sum, b) => sum + Math.max(0, (b.end - Math.max(b.start, eveningFrom)) / SLOT_MINUTES), 0);
  const inHall = date === today ? bookings.filter((b) => b.status === "seated").length : null;
  const fromSite = bookings.filter((b) => b.source === "site").length;
  const day = formatDay(date);

  const stats = [
    { label: "Броней", value: String(active.length), note: fromSite ? `${fromSite} с сайта` : "за день" },
    { label: "Гостей", value: String(guests), note: "ждём и уже в зале" },
    { label: "Загрузка вечера", value: `${Math.round((eveningBooked / eveningSlots) * 100)}%`, note: "18:00 до закрытия" },
    { label: "Сейчас в зале", value: inHall === null ? "—" : String(inHall), note: inHall === null ? "только для сегодня" : "столов занято" },
  ];

  return (
    <>
      <AdminHeader active="bookings" />
      <main className="container-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Брони</p>
            <h1 className="display mt-3 text-[48px] font-light leading-none">
              {relativeDayLabel(date, now) === "сегодня" ? "Сегодня" : relativeDayLabel(date, now) === "завтра" ? "Завтра" : day.weekday},{" "}
              <em className="font-normal">{day.dayMonth}</em>
            </h1>
          </div>
          <nav aria-label="Выбор дня" className="flex flex-wrap items-center gap-2">
            <Link href={`/admin?date=${addDays(date, -1)}`} className="btn-ghost !min-h-[40px] !px-4" aria-label="Предыдущий день">
              ←
            </Link>
            {date !== today && (
              <Link href="/admin" className="btn-ghost !min-h-[40px] !px-4">
                Сегодня
              </Link>
            )}
            <Link href={`/admin?date=${addDays(date, 1)}`} className="btn-ghost !min-h-[40px] !px-4" aria-label="Следующий день">
              →
            </Link>
          </nav>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[20px] border border-line/10 bg-surface p-5">
              <dt className="text-[13.5px] text-ink-2">{s.label}</dt>
              <dd className="display tabular mt-2 text-[40px] font-light leading-none">{s.value}</dd>
              <dd className="mt-2 text-[13px] text-ink-3">{s.note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <PhoneBookingForm date={date} tables={tables.map((t) => ({ id: t.id, label: t.label, zone: t.zone, seatsMin: t.seatsMin, seatsMax: t.seatsMax }))} />
        </div>

        <div className="mt-8">
          <AdminBoard
            bookings={bookings}
            tables={tables.map((t) => ({ id: t.id, label: t.label, zone: t.zone, seatsMin: t.seatsMin, seatsMax: t.seatsMax }))}
            open={open}
            close={close}
            nowMinutes={date === today ? cafeParts(now).minutes : null}
          />
        </div>
      </main>
    </>
  );
}
