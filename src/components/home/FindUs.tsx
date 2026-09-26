import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { CAFE } from "@/lib/cafe";
import { LiveHours } from "./LiveHours";

export function FindUs() {
  return (
    <section id="contacts" className="container-page scroll-mt-24 pt-28 md:pt-40" aria-labelledby="contacts-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">Как нас найти</p>
            <h2 id="contacts-title" className="display mt-5 text-d-2 font-light">
              {CAFE.streetShort}
            </h2>
            <p className="mt-6 max-w-md text-[17.5px] leading-relaxed text-ink-2">
              {CAFE.city}, {CAFE.street}. {CAFE.landmark}. Вход с улицы, на первом этаже старого дома с высокими окнами.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-10 grid gap-8 sm:grid-cols-2">
            <LiveHours />
            <div>
              <p className="eyebrow mb-3">Позвонить</p>
              <a href={CAFE.phoneHref} className="display tabular text-[30px] font-light leading-none">
                {CAFE.phone}
              </a>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                Компании больше восьми человек и банкеты бронируем по телефону.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-[28px] border border-line/10 bg-surface">
            <CafeMap />
          </div>
          <MediaFrame shot="facade-evening" alt="Фасад кофейни в сумерках: высокие окна светятся тёплым светом" sizes="(max-width: 1100px) 100vw, 24vw" className="aspect-[4/5] rounded-[28px] sm:aspect-auto" />
        </Reveal>
      </div>
    </section>
  );
}

/** A drawn scheme of the neighbourhood, not a real map. */
function CafeMap() {
  return (
    <svg viewBox="0 0 400 460" className="h-full w-full" role="img" aria-label="Схема: кофейня на улице Светлой, в пяти минутах от Большой Покровской">
      <rect width="400" height="460" fill="rgb(var(--sunk))" />
      <path d="M-20 70 C 80 40 160 90 260 60 S 400 40 430 50 L430 -20 L-20 -20 Z" fill="rgb(var(--zinc) / 0.35)" />
      <text x="330" y="36" className="fill-ink-2 font-label text-[15px] uppercase tracking-[0.2em]">
        Волга
      </text>
      <g stroke="rgb(var(--paper))" strokeLinecap="round" fill="none">
        <path d="M60 110 L140 460" strokeWidth="26" />
        <path d="M-10 250 L410 205" strokeWidth="18" />
        <path d="M-10 360 L410 330" strokeWidth="14" />
        <path d="M250 110 L300 460" strokeWidth="12" />
        <path d="M-10 150 L410 120" strokeWidth="10" />
      </g>
      <g className="fill-ink-2 font-label text-[13px] uppercase tracking-[0.14em]">
        <text x="84" y="330" transform="rotate(77 84 330)">Большая Покровская</text>
        <text x="36" y="246" transform="rotate(-6 36 246)">ул. Светлая</text>
      </g>
      <g transform="translate(212 218)">
        <circle r="30" fill="rgb(var(--honey) / 0.25)" className="map-pulse" />
        <circle r="11" fill="rgb(var(--ink))" />
        <circle r="5" fill="rgb(var(--honey))" />
      </g>
      <g className="fill-ink font-sans text-[14px] font-semibold">
        <text x="232" y="262">Светотень</text>
      </g>
      <path d="M112 262 C 150 250 175 236 200 224" stroke="rgb(var(--ink) / 0.5)" strokeWidth="1.6" strokeDasharray="3 6" fill="none" />
      <text x="96" y="290" className="fill-ink-2 font-sans text-[12.5px]">
        5 минут пешком
      </text>
    </svg>
  );
}
