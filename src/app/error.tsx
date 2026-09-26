"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container-page grid min-h-[100svh] place-items-center py-16">
      <div className="max-w-lg text-center">
        <p className="eyebrow">Что-то пошло не так</p>
        <h1 className="display mt-5 text-d-2 font-light">
          Кофемашина
          <br />
          <em className="font-normal">задумалась</em>
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-ink-2">
          Страница не загрузилась. Попробуйте ещё раз, а если не выйдет, позвоните нам: забронируем по телефону.
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-8">
          Попробовать ещё раз
        </button>
      </div>
    </main>
  );
}
