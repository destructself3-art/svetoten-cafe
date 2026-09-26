import Link from "next/link";
import { Mark, Wordmark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-[100svh] flex-col py-8">
      <Link href="/" className="flex items-center gap-2.5 self-start" aria-label="Светотень, на главную">
        <Mark className="h-8 w-8" />
        <Wordmark className="text-[30px] leading-none" />
      </Link>
      <div className="grid flex-1 items-center gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div>
          <p className="eyebrow">Ошибка 404</p>
          <h1 className="display mt-5 text-d-1 font-light">
            Этого столика
            <br />
            <em className="font-normal">у нас нет</em>
          </h1>
          <p className="mt-6 max-w-md text-[17.5px] leading-relaxed text-ink-2">
            Страница переехала или никогда не существовала. Зато кофе на месте, и свободные столы тоже есть.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              На главную
            </Link>
            <Link href="/menu" className="btn-ghost">
              Меню
            </Link>
            <Link href="/booking" className="btn-ghost">
              Забронировать столик
            </Link>
          </div>
        </div>
        <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[380px]" aria-hidden>
          {/* A cup knocked over: the coffee has run out into a stain */}
          <path
            d="M140 250 C 90 240 70 290 110 318 C 150 346 250 352 300 322 C 346 294 330 250 290 252 C 262 254 250 280 220 276 C 190 272 186 258 140 250 Z"
            fill="rgb(var(--honey) / 0.25)"
          />
          <path d="M170 270 C 150 268 140 290 160 302 C 188 318 240 316 262 300 C 280 286 270 268 250 270 Z" fill="rgb(var(--honey-ink) / 0.35)" />
          <g transform="rotate(-24 200 200)">
            <ellipse cx="200" cy="180" rx="86" ry="40" fill="rgb(var(--surface))" stroke="rgb(var(--ink))" strokeWidth="3" />
            <path d="M114 180 L 128 248 Q 200 290 272 248 L 286 180" fill="rgb(var(--surface))" stroke="rgb(var(--ink))" strokeWidth="3" />
            <ellipse cx="200" cy="180" rx="72" ry="31" fill="rgb(var(--sunk))" />
            <path d="M284 196 C 322 196 322 236 280 236" fill="none" stroke="rgb(var(--ink))" strokeWidth="3" />
          </g>
          <circle cx="330" cy="120" r="5" fill="rgb(var(--honey))" />
          <circle cx="352" cy="148" r="3" fill="rgb(var(--honey))" />
        </svg>
      </div>
    </main>
  );
}
