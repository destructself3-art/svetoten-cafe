"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { updateStatus } from "@/app/admin/actions";
import { ZONES, type Zone } from "@/data/hall";
import { guestsLabel } from "@/lib/format";
import { minutesToHHMM } from "@/lib/time";
import { STATUS_LABELS, type BookingStatus } from "@/lib/booking-rules";

export type AdminBooking = {
  id: string;
  code: string;
  tableId: string;
  tableLabel: string;
  zone: string;
  start: number;
  end: number;
  guests: number;
  name: string;
  phone: string;
  phoneHref: string;
  comment: string | null;
  occasion: string | null;
  event: string | null;
  status: BookingStatus;
  source: string;
};

export type AdminTable = { id: string; label: string; zone: string; seatsMin: number; seatsMax: number };

const STATUS_STYLE: Record<BookingStatus, string> = {
  confirmed: "border-honey-ink/70 bg-honey/20 text-ink",
  seated: "border-ink bg-honey text-[#1e1d1b]",
  completed: "border-line/15 bg-sunk text-ink-2",
  no_show: "border-wine/40 bg-wine/10 text-wine",
  cancelled: "border-dashed border-wine/40 bg-transparent text-wine",
};

const ACTIONS: { status: BookingStatus; label: string }[] = [
  { status: "seated", label: "Пришли" },
  { status: "completed", label: "Ушли" },
  { status: "no_show", label: "Не пришли" },
  { status: "cancelled", label: "Отменить" },
  { status: "confirmed", label: "Вернуть в ожидание" },
];

const SOURCE_LABEL: Record<string, string> = { site: "с сайта", admin: "по телефону", demo: "демо" };

export function AdminBoard({
  bookings,
  tables,
  open,
  close,
  nowMinutes,
}: {
  bookings: AdminBooking[];
  tables: AdminTable[];
  open: number;
  close: number;
  nowMinutes: number | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = bookings.find((b) => b.id === selectedId) ?? null;
  const span = close - open;
  const hours = useMemo(() => {
    const list: number[] = [];
    for (let m = Math.ceil(open / 60) * 60; m <= close; m += 60) list.push(m);
    return list;
  }, [open, close]);
  const zones = useMemo(() => {
    const order = Object.keys(ZONES) as Zone[];
    return order
      .map((z) => ({ zone: z, tables: tables.filter((t) => t.zone === z) }))
      .filter((g) => g.tables.length > 0);
  }, [tables]);
  const pct = (m: number) => `${((m - open) / span) * 100}%`;
  const visible = bookings.filter((b) => b.status !== "cancelled");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        {/* Timeline: tables down, hours across */}
        <div className="overflow-x-auto rounded-[24px] border border-line/10 bg-surface" data-lenis-prevent>
          <div className="min-w-[960px] p-4">
            <div className="relative ml-[92px] h-7 border-b border-line/10">
              {hours.map((h) => (
                <span key={h} className="tabular absolute -translate-x-1/2 text-[12.5px] text-ink-3" style={{ left: pct(h) }}>
                  {minutesToHHMM(h)}
                </span>
              ))}
            </div>
            <div className="relative">
            {nowMinutes !== null && nowMinutes >= open && nowMinutes <= close && (
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-wine"
                style={{ left: `calc(92px + (100% - 92px) * ${(nowMinutes - open) / span})` }}
                aria-hidden
              >
                <span className="tabular absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-wine px-2 py-0.5 text-[11.5px] font-semibold text-paper">
                  {minutesToHHMM(nowMinutes)}
                </span>
              </div>
            )}
            {zones.map((g) => (
              <div key={g.zone} className="mt-3">
                <p className="font-label text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-3">{ZONES[g.zone].title}</p>
                {g.tables.map((t) => (
                  <div key={t.id} className="flex h-11 items-center border-b border-line/5">
                    <div className="w-[92px] shrink-0 pr-3 text-[13.5px]">
                      <span className="font-semibold">Стол {t.label}</span>
                      <span className="ml-1.5 text-ink-3">
                        {t.seatsMin === t.seatsMax ? t.seatsMax : `${t.seatsMin}–${t.seatsMax}`}
                      </span>
                    </div>
                    <div className="relative h-full flex-1">
                      {hours.map((h) => (
                        <span key={h} className="absolute inset-y-0 w-px bg-line/5" style={{ left: pct(h) }} aria-hidden />
                      ))}
                      {visible
                        .filter((b) => b.tableId === t.id)
                        .map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedId(b.id)}
                            className={clsx(
                              "absolute inset-y-1.5 overflow-hidden rounded-lg border px-2 text-left text-[12.5px] leading-tight transition-shadow hover:shadow-md",
                              STATUS_STYLE[b.status],
                              selectedId === b.id && "ring-2 ring-ink",
                            )}
                            style={{ left: pct(b.start), width: `calc(${pct(b.end)} - ${pct(b.start)} - 2px)` }}
                            title={`${minutesToHHMM(b.start)}–${minutesToHHMM(b.end)} · ${b.name} · ${guestsLabel(b.guests)}`}
                          >
                            <span className="block truncate font-semibold">{b.name}</span>
                            <span className="tabular block truncate opacity-80">
                              {minutesToHHMM(b.start)} · {b.guests} чел.
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-8 overflow-x-auto" data-lenis-prevent>
          <table className="w-full min-w-[720px] text-left text-[14.5px]">
            <thead className="text-[12.5px] uppercase tracking-[0.1em] text-ink-3">
              <tr className="border-b border-line/15">
                <th className="py-3 pr-4 font-semibold">Время</th>
                <th className="py-3 pr-4 font-semibold">Стол</th>
                <th className="py-3 pr-4 font-semibold">Гость</th>
                <th className="py-3 pr-4 font-semibold">Телефон</th>
                <th className="py-3 pr-4 font-semibold">Статус</th>
                <th className="py-3 font-semibold">Откуда</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-ink-2">
                    На этот день броней нет.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={clsx("cursor-pointer border-b border-line/5 hover:bg-sunk/50", b.status === "cancelled" && "text-ink-3")}
                >
                  <td className="tabular py-3 pr-4">
                    {minutesToHHMM(b.start)}–{minutesToHHMM(b.end)}
                  </td>
                  <td className="py-3 pr-4">
                    {b.tableLabel} · {ZONES[b.zone as Zone]?.title.toLowerCase()}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-semibold">{b.name}</span> <span className="text-ink-2">· {b.guests}</span>
                  </td>
                  <td className="tabular py-3 pr-4">{b.phone}</td>
                  <td className="py-3 pr-4">
                    <span className={clsx("inline-flex rounded-full border px-2.5 py-0.5 text-[12.5px] font-semibold", STATUS_STYLE[b.status])}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                  <td className="py-3 text-ink-2">{SOURCE_LABEL[b.source] ?? b.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details */}
      <aside className="xl:sticky xl:top-24 xl:self-start" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-[24px] border border-line/10 bg-surface p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[13px] text-ink-2">{selected.code}</p>
                  <p className="mt-1 text-[22px] font-semibold leading-tight">{selected.name}</p>
                </div>
                <button type="button" onClick={() => setSelectedId(null)} className="text-[14px] text-ink-2 hover:text-ink">
                  Закрыть
                </button>
              </div>
              <dl className="mt-5 space-y-2 text-[15px]">
                <Row label="Время" value={`${minutesToHHMM(selected.start)}–${minutesToHHMM(selected.end)}`} />
                <Row label="Стол" value={`${selected.tableLabel} · ${ZONES[selected.zone as Zone]?.title.toLowerCase()}`} />
                <Row label="Гости" value={guestsLabel(selected.guests)} />
                <Row
                  label="Телефон"
                  value={
                    <a href={selected.phoneHref} className="link-underline tabular">
                      {selected.phone}
                    </a>
                  }
                />
                {selected.occasion && <Row label="Повод" value={selected.occasion} />}
                {selected.event && <Row label="Вечер" value={selected.event} />}
                {selected.comment && <Row label="Комментарий" value={selected.comment} />}
                <Row label="Статус" value={STATUS_LABELS[selected.status]} />
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {ACTIONS.filter((a) => a.status !== selected.status).map((a) => (
                  <form key={a.status} action={updateStatus}>
                    <input type="hidden" name="id" value={selected.id} />
                    <input type="hidden" name="status" value={a.status} />
                    <button
                      type="submit"
                      className={clsx(
                        "min-h-[40px] rounded-full border px-4 text-[14px] font-semibold transition-colors",
                        a.status === "cancelled" || a.status === "no_show"
                          ? "border-wine/40 text-wine hover:bg-wine/10"
                          : "border-line/20 hover:border-ink",
                      )}
                    >
                      {a.label}
                    </button>
                  </form>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[24px] border border-dashed border-line/20 p-6 text-[15px] text-ink-2">
              Нажмите на бронь в таймлайне или в списке, чтобы отметить гостей или отменить её.
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-2">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
