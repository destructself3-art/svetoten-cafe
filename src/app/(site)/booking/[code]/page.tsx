import type { Metadata } from "next";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { CancelBooking } from "@/components/booking/CancelBooking";
import { TicketReveal } from "@/components/booking/TicketReveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ZONES, type Zone } from "@/data/hall";
import { findEvent } from "@/data/events";
import { getBookingByCode } from "@/lib/booking";
import { CAFE } from "@/lib/cafe";
import { guestsLabel, maskPhone } from "@/lib/format";
import { cafeDateKey, cafeParts, formatDay, minutesToHHMM, relativeDayLabel } from "@/lib/time";

export const metadata: Metadata = { title: "Бронь подтверждена", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TicketPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const booking = await getBookingByCode(code.toUpperCase());
  if (!booking) notFound();

  const dateKey = cafeDateKey(booking.startsAt);
  const day = formatDay(dateKey);
  const start = minutesToHHMM(cafeParts(booking.startsAt).minutes);
  const end = minutesToHHMM(cafeParts(booking.endsAt).minutes);
  const zone = ZONES[booking.table.zone as Zone]?.title ?? booking.table.zone;
  const cancelled = booking.status === "cancelled";
  const past = booking.endsAt.getTime() < Date.now();
  const event = booking.eventSlug ? findEvent(booking.eventSlug) : null;
  const rel = relativeDayLabel(dateKey);

  return (
    <div className="container-page pt-32 md:pt-40">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">{cancelled ? "Бронь отменена" : past ? "Эта бронь уже прошла" : "Бронь подтверждена"}</p>
        <h1 className="display mt-5 text-d-2 font-light">
          {cancelled ? (
            <>
              Будем ждать
              <br />
              <em className="font-normal">в другой раз</em>
            </>
          ) : (
            <>
              {booking.name.split(" ")[0]}, столик
              <br />
              <em className="font-normal">ждёт вас</em>
            </>
          )}
        </h1>

        <TicketReveal className="ticket-wrap mt-12">
          <article className={clsx("ticket tone-day relative overflow-hidden rounded-[28px] text-[#1e1d1b] shadow-[0_40px_80px_-40px_rgb(40_52_68/0.55)]", cancelled && "opacity-60")}>
            <div className="grid gap-6 p-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-9">
              <div>
                <p className="font-label text-[14px] font-semibold uppercase tracking-[0.18em] text-[#5c5d59]">Светотень · {CAFE.street}</p>
                <p className="display mt-4 text-[44px] font-light leading-none sm:text-[56px]">
                  {rel === "сегодня" || rel === "завтра" ? rel : day.weekday}, {day.dayMonth}
                </p>
                <p className="display tabular mt-2 text-[36px] font-light leading-none text-[#9a580c]">
                  {start}–{end}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="font-label text-[13px] font-semibold uppercase tracking-[0.18em] text-[#5c5d59]">Код брони</p>
                <p className="mt-2 font-mono text-[26px] font-semibold tracking-wider">{booking.code}</p>
              </div>
            </div>
            <div className="ticket-perforation" aria-hidden />
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 p-7 text-[15.5px] sm:grid-cols-4 sm:p-9">
              <div>
                <dt className="text-[13px] text-[#5c5d59]">Гости</dt>
                <dd className="mt-1 font-semibold">{guestsLabel(booking.guests)}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#5c5d59]">Стол</dt>
                <dd className="mt-1 font-semibold">№ {booking.table.label}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#5c5d59]">Зона</dt>
                <dd className="mt-1 font-semibold">{zone}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-[#5c5d59]">Телефон</dt>
                <dd className="tabular mt-1 font-semibold">{maskPhone(booking.phone)}</dd>
              </div>
              {event && (
                <div className="col-span-2 sm:col-span-4">
                  <dt className="text-[13px] text-[#5c5d59]">Вечер</dt>
                  <dd className="mt-1 font-semibold">{event.title}</dd>
                </div>
              )}
              {booking.comment && (
                <div className="col-span-2 sm:col-span-4">
                  <dt className="text-[13px] text-[#5c5d59]">Комментарий</dt>
                  <dd className="mt-1">{booking.comment}</dd>
                </div>
              )}
            </dl>
          </article>
        </TicketReveal>

        {!cancelled && !past && (
          <p className="mt-8 text-[16px] leading-relaxed text-ink-2">
            Держим столик 15 минут. Если задерживаетесь, позвоните:{" "}
            <a href={CAFE.phoneHref} className="link-underline tabular text-ink">
              {CAFE.phone}
            </a>
            .
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {!cancelled && !past && (
            <a href={`/booking/${booking.code}/calendar`} className="btn-primary">
              Добавить в календарь
            </a>
          )}
          <TransitionLink href="/#contacts" className="btn-ghost">
            Как добраться
          </TransitionLink>
          <TransitionLink href="/menu" className="btn-ghost">
            Посмотреть меню
          </TransitionLink>
        </div>
        {!cancelled && !past && (
          <div className="mt-10 border-t border-line/10 pt-8">
            <CancelBooking code={booking.code} />
          </div>
        )}
        {cancelled && (
          <TransitionLink href="/booking" className="btn-primary mt-8">
            Выбрать другое время
          </TransitionLink>
        )}
      </div>
    </div>
  );
}
