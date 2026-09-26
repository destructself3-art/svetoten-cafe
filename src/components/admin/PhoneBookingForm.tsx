"use client";

import { useActionState, useState } from "react";
import { createPhoneBooking, type FormState } from "@/app/admin/actions";
import { ZONES, type Zone } from "@/data/hall";
import { MAX_GUESTS, slotStarts } from "@/lib/booking-rules";
import { minutesToHHMM } from "@/lib/time";
import type { AdminTable } from "./AdminBoard";

const field = "h-11 w-full rounded-xl border border-line/20 bg-surface px-3 text-[15px] outline-none focus:border-ink";

/** A booking taken by phone, with the same double-booking protection as the site. */
export function PhoneBookingForm({ date, tables }: { date: string; tables: AdminTable[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createPhoneBooking, null);
  const [day, setDay] = useState(date);
  const times = slotStarts(day).map(minutesToHHMM);

  return (
    <details className="group rounded-[24px] border border-line/10 bg-surface">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between px-6 text-[16px] font-semibold">
        Бронь по телефону
        <span className="text-[14px] font-normal text-ink-2 group-open:hidden">открыть форму</span>
      </summary>
      <form action={action} className="grid gap-4 border-t border-line/10 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1.5 text-[13.5px] font-semibold" htmlFor="pb-date">
          Дата
          <input id="pb-date" name="date" type="date" value={day} onChange={(e) => setDay(e.target.value)} className={field} required />
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold" htmlFor="pb-time">
          Время
          <select id="pb-time" name="time" className={field} required defaultValue={times.find((t) => t >= "19:00") ?? times[0]}>
            {times.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold" htmlFor="pb-guests">
          Гости
          <select id="pb-guests" name="guests" className={field} defaultValue="2">
            {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold" htmlFor="pb-table">
          Стол
          <select id="pb-table" name="tableId" className={field} defaultValue="">
            <option value="">Любой свободный</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} · {ZONES[t.zone as Zone]?.title.toLowerCase()} · до {t.seatsMax}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold sm:col-span-1" htmlFor="pb-name">
          Имя
          <input id="pb-name" name="name" className={field} required />
          {state?.fields?.name && <span className="font-normal text-wine">{state.fields.name}</span>}
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold" htmlFor="pb-phone">
          Телефон
          <input id="pb-phone" name="phone" type="tel" className={field} placeholder="+7 900 000-00-00" required />
          {state?.fields?.phone && <span className="font-normal text-wine">{state.fields.phone}</span>}
        </label>
        <label className="grid gap-1.5 text-[13.5px] font-semibold sm:col-span-2" htmlFor="pb-comment">
          Комментарий
          <input id="pb-comment" name="comment" className={field} />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-4">
          <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
            {pending ? "Создаём…" : "Создать бронь"}
          </button>
          {state?.error && (
            <p className="text-[14.5px] text-wine" role="alert">
              {state.error}
            </p>
          )}
          {state?.ok && (
            <p className="text-[14.5px] text-honey-ink" role="status">
              {state.ok}
            </p>
          )}
        </div>
      </form>
    </details>
  );
}
