"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { HallPlan, type PlanTable } from "@/components/hall/HallPlan";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { usePageTransition } from "@/components/transition/TransitionProvider";
import { ZONES, type Zone } from "@/data/hall";
import { CAFE, DAYPARTS, OCCASIONS, type Daypart } from "@/lib/cafe";
import { MAX_GUESTS, terraceOpen, windowFor } from "@/lib/booking-rules";
import { formatPhone, guestsLabel, normalizePhone } from "@/lib/format";
import { formatDay, hhmmToMinutes, minutesToHHMM, relativeDayLabel } from "@/lib/time";

type Slot = { time: string; minutes: number; daypart: Daypart; free: number; past: boolean };
type TableState = PlanTable & { fits: boolean; free: boolean };
export type BookingEventHint = { date: string; slug: string; title: string; start: string };

type Props = {
  dates: string[];
  events: BookingEventHint[];
  tables: PlanTable[];
  initial: { date: string; time: string | null; guests: number; eventSlug: string | null };
};

const PARTS: Daypart[] = ["morning", "day", "evening"];

function Step({ n, title, hint, children, id }: { n: number; title: string; hint?: string; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="scroll-mt-28" aria-labelledby={`${id}-title`}>
      <div className="flex items-baseline gap-4 border-b border-line/15 pb-4">
        <span className="display tabular text-[28px] font-light leading-none text-honey-ink">{n}</span>
        <h2 id={`${id}-title`} className="text-[21px] font-semibold">
          {title}
        </h2>
        {hint && <p className="ml-auto hidden text-[14px] text-ink-2 sm:block">{hint}</p>}
      </div>
      <div className="pt-6">{children}</div>
    </section>
  );
}

export function BookingFlow({ dates, events, tables: geometry, initial }: Props) {
  const { navigate } = usePageTransition();
  const [date, setDate] = useState(initial.date);
  const [guests, setGuests] = useState(initial.guests);
  const [time, setTime] = useState<string | null>(initial.time);
  const [tableId, setTableId] = useState<string | null>(null);
  const [eventSlug, setEventSlug] = useState<string | null>(initial.eventSlug);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [tables, setTables] = useState<TableState[] | null>(null);
  const [focusTable, setFocusTable] = useState<PlanTable | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number] | null>(null);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [reload, setReload] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  // Free times for the date and party
  useEffect(() => {
    const ctrl = new AbortController();
    setSlots(null);
    fetch(`/api/availability?date=${date}&guests=${guests}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch(() => {});
    return () => ctrl.abort();
  }, [date, guests, reload]);

  // Drop a time that is no longer available
  useEffect(() => {
    if (!slots || !time) return;
    const slot = slots.find((s) => s.time === time);
    if (!slot || slot.free === 0) setTime(null);
  }, [slots, time]);

  // Tables for the chosen time
  useEffect(() => {
    if (!time) {
      setTables(null);
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/tables?date=${date}&time=${time}&guests=${guests}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: { tables: TableState[] }) => setTables(data.tables))
      .catch(() => {});
    return () => ctrl.abort();
  }, [date, time, guests, reload]);

  // A table that stopped fitting (more guests, other time) is released
  useEffect(() => {
    if (!tableId || !tables) return;
    const t = tables.find((x) => x.id === tableId);
    if (!t || !t.fits || !t.free) setTableId(null);
  }, [tables, tableId]);

  const planTables: PlanTable[] = useMemo(() => {
    if (!tables) return geometry.map((t) => ({ ...t, state: "idle" as const }));
    return tables.map((t) => ({ ...t, state: !t.fits ? ("unfit" as const) : t.free ? ("free" as const) : ("taken" as const) }));
  }, [tables, geometry]);

  const freeTables = planTables.filter((t) => t.state === "free");
  const selected = planTables.find((t) => t.id === tableId) ?? null;
  const shownTable = focusTable ?? selected;
  const shownZone = (shownTable?.zone ?? "hall") as Zone;
  const dayInfo = formatDay(date);
  const windowEnd = time ? minutesToHHMM(windowFor(date, hhmmToMinutes(time), guests).end) : null;
  const eventsOnDate = events.filter((e) => e.date === date);
  const chosenEvent = events.find((e) => e.slug === eventSlug && e.date === date) ?? null;
  const ready = Boolean(date && time && guests);

  const scrollStrip = (dir: 1 | -1) => stripRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  const submit = useCallback(async () => {
    setNotice(null);
    const local: Record<string, string> = {};
    if (!time) local.time = "Выберите время";
    if (name.trim().length < 2) local.name = "Напишите, как к вам обращаться";
    if (!/^7\d{10}$/.test(normalizePhone(phone))) local.phone = "Нужен российский номер: +7 и 10 цифр";
    if (!consent) local.consent = "Нужно согласие на обработку персональных данных";
    setErrors(local);
    if (Object.keys(local).length) {
      document.getElementById(local.time ? "step-time" : "step-contacts")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          guests,
          tableId: tableId ?? undefined,
          name,
          phone,
          comment: comment || undefined,
          occasion: occasion ?? undefined,
          eventSlug: chosenEvent?.slug,
          consent,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        navigate(`/booking/${data.code}`);
        return;
      }
      if (res.status === 422 && data.fields) setErrors(data.fields);
      setNotice(data.error ?? "Не получилось. Попробуйте ещё раз.");
      if (res.status === 409) {
        setTableId(null);
        setReload((n) => n + 1);
        document.getElementById("step-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch {
      setNotice("Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  }, [time, name, phone, consent, date, guests, tableId, comment, occasion, chosenEvent, navigate]);

  return (
    <div className="grid gap-14 pb-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:pb-0">
      <div className="flex min-w-0 flex-col gap-14">
        {/* 1. Date */}
        <Step n={1} id="step-date" title="Когда" hint="Бронь открыта на 30 дней вперёд">
          <div className="relative">
            <div ref={stripRef} className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]" data-lenis-prevent>
              {dates.map((d) => {
                const f = formatDay(d);
                const rel = relativeDayLabel(d);
                const ev = events.find((e) => e.date === d);
                const isSel = d === date;
                const weekend = f.weekdayShort === "сб" || f.weekdayShort === "вс";
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDate(d);
                      setTime(null);
                      setTableId(null);
                    }}
                    aria-pressed={isSel}
                    aria-label={`${f.long}${ev ? `, ${ev.title}` : ""}`}
                    className={clsx(
                      "relative flex min-h-[92px] w-[74px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border transition-colors",
                      isSel ? "border-ink bg-ink text-paper" : "border-line/15 hover:border-ink/50",
                    )}
                  >
                    <span className={clsx("text-[12.5px] uppercase tracking-[0.1em]", isSel ? "text-paper/70" : weekend ? "text-honey-ink" : "text-ink-2")}>
                      {rel === "сегодня" || rel === "завтра" ? rel : f.weekdayShort}
                    </span>
                    <span className="display tabular mt-1 text-[30px] font-light leading-none">{f.day}</span>
                    <span className={clsx("mt-1 text-[12px]", isSel ? "text-paper/70" : "text-ink-3")}>{f.month.slice(0, 3)}</span>
                    {ev && <span className={clsx("absolute right-2 top-2 h-1.5 w-1.5 rounded-full", isSel ? "bg-honey" : "bg-honey-ink")} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 hidden gap-2 md:flex">
              <button type="button" onClick={() => scrollStrip(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-line/20 hover:border-ink/60" aria-label="Раньше">
                ←
              </button>
              <button type="button" onClick={() => scrollStrip(1)} className="grid h-10 w-10 place-items-center rounded-full border border-line/20 hover:border-ink/60" aria-label="Позже">
                →
              </button>
            </div>
          </div>
          {eventsOnDate.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {eventsOnDate.map((ev) => {
                const on = eventSlug === ev.slug;
                return (
                  <button
                    key={ev.slug}
                    type="button"
                    onClick={() => {
                      setEventSlug(on ? null : ev.slug);
                      if (!on) setTime(ev.start);
                    }}
                    aria-pressed={on}
                    className={clsx(
                      "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-[14px] transition-colors",
                      on ? "border-honey-ink bg-honey/20 text-ink" : "border-line/20 text-ink-2 hover:border-ink/50",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-honey-ink" />
                    {ev.title}, {ev.start}
                    {on ? " · выбрано" : ""}
                  </button>
                );
              })}
            </div>
          )}
        </Step>

        {/* 2. Guests */}
        <Step n={2} id="step-guests" title="Сколько гостей">
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Число гостей">
            {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={n === guests}
                onClick={() => setGuests(n)}
                className={clsx(
                  "tabular grid h-12 w-12 place-items-center rounded-full border text-[17px] font-semibold transition-colors",
                  n === guests ? "border-ink bg-ink text-paper" : "border-line/20 hover:border-ink/60",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[14.5px] text-ink-2">
            Больше восьми человек? Позвоните{" "}
            <a href={CAFE.phoneHref} className="link-underline tabular text-ink">
              {CAFE.phone}
            </a>
            , накроем общий стол или весь зал.
          </p>
        </Step>

        {/* 3. Time */}
        <Step n={3} id="step-time" title="Во сколько" hint={`${dayInfo.weekday}, ${dayInfo.dayMonth}`}>
          {errors.time && <p className="mb-4 text-[14.5px] text-wine">{errors.time}</p>}
          <div className="grid gap-8 md:grid-cols-3">
            {PARTS.map((part) => {
              const list = (slots ?? []).filter((s) => s.daypart === part);
              return (
                <div key={part}>
                  <p className="eyebrow mb-3">
                    {DAYPARTS[part].title} <span className="normal-case tracking-normal text-ink-3">· {DAYPARTS[part].range}</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3">
                    {!slots &&
                      Array.from({ length: 6 }, (_, i) => <span key={i} className="h-[52px] animate-pulse rounded-xl bg-sunk" />)}
                    {slots && list.length === 0 && <p className="col-span-3 text-[14px] text-ink-3">Нет времени для брони</p>}
                    {list.map((s) => {
                      const disabled = s.past || s.free === 0;
                      const isSel = s.time === time;
                      const eventHere = eventsOnDate.find((e) => e.start === s.time);
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            setTime(s.time);
                            setTableId(null);
                            setErrors((e) => ({ ...e, time: "" }));
                          }}
                          aria-pressed={isSel}
                          className={clsx(
                            "flex min-h-[52px] flex-col items-center justify-center rounded-xl border text-[15px] font-semibold transition-colors",
                            isSel && "border-ink bg-ink text-paper",
                            !isSel && !disabled && "border-line/20 hover:border-ink/60",
                            disabled && "cursor-not-allowed border-transparent bg-sunk/60 text-ink-3 line-through decoration-ink-3/40",
                          )}
                        >
                          <span className="tabular">{s.time}</span>
                          <span className={clsx("text-[11.5px] font-medium", isSel ? "text-paper/70" : eventHere ? "text-honey-ink" : "text-ink-3")}>
                            {s.past ? "прошло" : s.free === 0 ? "занято" : eventHere ? "афиша" : `${s.free} ${s.free === 1 ? "стол" : s.free < 5 ? "стола" : "столов"}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Step>

        {/* 4. Table */}
        <Step n={4} id="step-table" title="Где сесть" hint={time ? `${freeTables.length} свободно на ${time}` : "Сначала выберите время"}>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTableId(null)}
              aria-pressed={tableId === null}
              className={clsx(
                "min-h-[44px] rounded-full border px-4 text-[14.5px] font-medium transition-colors",
                tableId === null ? "border-ink bg-ink text-paper" : "border-line/20 hover:border-ink/60",
              )}
            >
              Любой свободный стол
            </button>
            {time && freeTables.length > 0 && (
              <p className="self-center text-[14px] text-ink-2">или выберите на плане: свободные подсвечены</p>
            )}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px]">
            <div className="overflow-x-auto rounded-[24px] border border-line/10 bg-surface p-3" data-lenis-prevent>
              <div className="min-w-[620px]">
                <HallPlan
                  tables={planTables}
                  selectedId={tableId}
                  onSelect={(t) => setTableId(t.id)}
                  onFocusTable={setFocusTable}
                  terraceOpen={terraceOpen(date)}
                  title="План зала: выберите свободный стол"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-[20px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div key={shownZone} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <MediaFrame shot={ZONES[shownZone].photo} alt={`Зона «${ZONES[shownZone].title}»`} sizes="240px" className="aspect-[4/3] xl:aspect-[4/5]" quiet />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div aria-live="polite">
                {shownTable ? (
                  <>
                    <p className="text-[16px] font-semibold">
                      Стол {shownTable.label} · {ZONES[shownTable.zone as Zone]?.title}
                    </p>
                    <p className="text-[14px] text-ink-2">
                      На {shownTable.seatsMin === shownTable.seatsMax ? shownTable.seatsMax : `${shownTable.seatsMin}–${shownTable.seatsMax}`} гостей
                      {shownTable.state === "taken" && " · занят"}
                      {shownTable.state === "unfit" && " · не подходит по числу гостей"}
                    </p>
                    {shownTable.note && <p className="mt-1 text-[14px] text-ink-2">{shownTable.note}</p>}
                  </>
                ) : (
                  <p className="text-[14px] text-ink-2">{ZONES[shownZone].blurb}</p>
                )}
              </div>
            </div>
          </div>

          {time && freeTables.length > 0 && (
            <div className="mt-5 md:hidden">
              <p className="eyebrow mb-3">Свободные столы</p>
              <div className="flex flex-wrap gap-2">
                {freeTables.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTableId(t.id)}
                    aria-pressed={t.id === tableId}
                    className={clsx(
                      "min-h-[40px] rounded-full border px-3.5 text-[14px] transition-colors",
                      t.id === tableId ? "border-ink bg-ink text-paper" : "border-line/20",
                    )}
                  >
                    {t.label} · {ZONES[t.zone as Zone]?.title.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Step>

        {/* 5. Contacts */}
        <Step n={5} id="step-contacts" title="Контакты">
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            noValidate
          >
            <label className="grid gap-2" htmlFor="booking-name">
              <span className="text-[14px] font-semibold">Имя</span>
              <input
                id="booking-name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "booking-name-error" : undefined}
                className="h-12 rounded-xl border border-line/20 bg-surface px-4 text-[16px] outline-none transition-colors focus:border-ink"
                placeholder="Как к вам обращаться"
              />
              {errors.name && (
                <span id="booking-name-error" className="text-[13.5px] text-wine">
                  {errors.name}
                </span>
              )}
            </label>
            <label className="grid gap-2" htmlFor="booking-phone">
              <span className="text-[14px] font-semibold">Телефон</span>
              <input
                id="booking-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  const digits = normalizePhone(e.target.value).slice(0, 11);
                  setPhone(digits.length === 11 ? formatPhone(digits) : e.target.value);
                }}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "booking-phone-error" : undefined}
                className="tabular h-12 rounded-xl border border-line/20 bg-surface px-4 text-[16px] outline-none transition-colors focus:border-ink"
                placeholder="+7 900 000-00-00"
              />
              {errors.phone && (
                <span id="booking-phone-error" className="text-[13.5px] text-wine">
                  {errors.phone}
                </span>
              )}
            </label>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-[14px] font-semibold">Повод, если есть</legend>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOccasion((cur) => (cur === o ? null : o))}
                    aria-pressed={occasion === o}
                    className={clsx(
                      "min-h-[40px] rounded-full border px-3.5 text-[14px] transition-colors",
                      occasion === o ? "border-ink bg-ink text-paper" : "border-line/20 text-ink-2 hover:border-ink/60 hover:text-ink",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="grid gap-2 sm:col-span-2" htmlFor="booking-comment">
              <span className="text-[14px] font-semibold">Комментарий</span>
              <textarea
                id="booking-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 300))}
                rows={3}
                className="rounded-xl border border-line/20 bg-surface px-4 py-3 text-[16px] outline-none transition-colors focus:border-ink"
                placeholder="Детский стул, аллергия, опоздаем на 15 минут"
              />
            </label>

            <label className="flex items-start gap-3 sm:col-span-2" htmlFor="booking-consent">
              <input
                id="booking-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--honey-ink))]"
              />
              <span className="text-[14px] leading-relaxed text-ink-2">
                Согласен на обработку имени и телефона для брони. Позвоним, только если что-то изменится.
                {errors.consent && <span className="mt-1 block text-wine">{errors.consent}</span>}
              </span>
            </label>
            <button type="submit" className="sr-only">
              Забронировать
            </button>
          </form>
        </Step>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Ваша бронь">
        <div className="rounded-[28px] border border-line/10 bg-surface p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Ваш столик</p>
            <Candle lit={Boolean(time)} />
          </div>
          <dl className="mt-5 space-y-3 text-[15.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Дата</dt>
              <dd className="text-right">
                {relativeDayLabel(date) === "сегодня" || relativeDayLabel(date) === "завтра" ? `${relativeDayLabel(date)}, ` : ""}
                {dayInfo.dayMonth}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Время</dt>
              <dd className="tabular text-right">{time ? `${time}–${windowEnd}` : "не выбрано"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Гости</dt>
              <dd className="text-right">{guestsLabel(guests)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Стол</dt>
              <dd className="text-right">{selected ? `${selected.label}, ${ZONES[selected.zone as Zone]?.title.toLowerCase()}` : "любой свободный"}</dd>
            </div>
            {chosenEvent && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Вечер</dt>
                <dd className="text-right text-honey-ink">{chosenEvent.title}</dd>
              </div>
            )}
          </dl>

          {notice && (
            <p className="mt-5 rounded-2xl bg-wine/10 px-4 py-3 text-[14.5px] text-wine" role="alert">
              {notice}
            </p>
          )}

          <button type="button" onClick={submit} disabled={!ready || sending} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "Бронируем…" : ready ? "Забронировать" : "Выберите время"}
          </button>
          <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">
            Бронь бесплатная, держим столик 15 минут. Отменить можно по ссылке из подтверждения.
          </p>
        </div>
      </aside>

      {/* Phones: the summary rides along at the bottom once a time is picked */}
      <AnimatePresence>
        {time && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-paper/90 px-4 pt-3 backdrop-blur-xl lg:hidden"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 text-[14px] leading-tight">
                <p className="tabular truncate font-semibold">
                  {time}–{windowEnd} · {guestsLabel(guests)}
                </p>
                <p className="truncate text-ink-2">
                  {dayInfo.dayMonth} · {selected ? `стол ${selected.label}` : "любой стол"}
                </p>
              </div>
              <button type="button" onClick={submit} disabled={sending} className="btn-primary shrink-0 !px-5 disabled:opacity-60">
                {sending ? "Бронируем…" : "Забронировать"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Candle({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 24 36" className="h-9 w-6" aria-hidden>
      <rect x="6" y="18" width="12" height="16" rx="2" fill="rgb(var(--brass))" />
      <line x1="12" y1="18" x2="12" y2="14" stroke="rgb(var(--ink))" strokeWidth="1.2" />
      <g className="transition-all duration-700" style={{ opacity: lit ? 1 : 0, transform: `scale(${lit ? 1 : 0.2})`, transformOrigin: "12px 14px" }}>
        <ellipse cx="12" cy="9" rx="7" ry="9" fill="rgb(var(--honey))" opacity="0.3" />
        <path d="M12 2 C 16 7 16 11 12 14 C 8 11 8 7 12 2 Z" fill="rgb(var(--honey))" />
      </g>
    </svg>
  );
}
