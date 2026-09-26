import type { Metadata } from "next";
import { BookingFlow, type BookingEventHint } from "@/components/booking/BookingFlow";
import { findEvent, upcomingEvents } from "@/data/events";
import { bookableDates, getAllTables } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Бронь столика",
  description: "Выберите дату, время и столик на плане зала. Бронь бесплатная, подтверждение сразу.",
};

export const dynamic = "force-dynamic";

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ event?: string; date?: string }> }) {
  const params = await searchParams;
  const now = new Date();
  const dates = bookableDates(now);
  const event = params.event ? findEvent(params.event) : null;
  const date = params.date && dates.includes(params.date) ? params.date : dates[0];

  const events: BookingEventHint[] = upcomingEvents(now, 16)
    .filter((e) => dates.includes(e.date))
    .map((e) => ({ date: e.date, slug: e.slug, title: e.title, start: e.start }));

  const tables = await getAllTables();

  return (
    <div className="container-page pt-32 md:pt-40">
      <header className="mb-14 max-w-3xl md:mb-20">
        <p className="eyebrow">Бронь столика</p>
        <h1 className="display mt-5 text-d-1 font-light">
          Столик
          <br />
          <em className="font-normal">ждёт вас</em>
        </h1>
        <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-ink-2">
          Выберите день, время и место на плане зала. Подтверждение придёт сразу, а если планы поменяются, бронь легко отменить.
        </p>
      </header>
      <BookingFlow
        dates={dates}
        events={events}
        tables={tables.map((t) => ({ ...t, state: "idle" as const }))}
        initial={{ date, time: event && params.date === date ? event.start : null, guests: 2, eventSlug: event?.slug ?? null }}
      />
    </div>
  );
}
