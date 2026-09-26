"use client";

import { useState } from "react";
import clsx from "clsx";
import { DrinkAnatomy, type AnatomyDrink } from "./DrinkAnatomy";
import { rub } from "@/lib/format";

export type PickerDrink = AnatomyDrink & { price: number; unit: string | null };

/** Chips to pick a drink; the cup in the cross-section pours it. */
export function CoffeePicker({ drinks, initial = "cappuccino" }: { drinks: PickerDrink[]; initial?: string }) {
  const [slug, setSlug] = useState(drinks.some((d) => d.slug === initial) ? initial : drinks[0]?.slug);
  const drink = drinks.find((d) => d.slug === slug) ?? drinks[0];
  if (!drink) return null;

  return (
    <div className="grid gap-8 rounded-[28px] border border-line/10 bg-surface p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-10">
      <div>
        <p className="eyebrow">Анатомия напитка</p>
        <p className="display mt-4 text-[34px] font-light leading-none">{drink.title}</p>
        <p className="tabular mt-2 text-[15px] text-ink-2">
          {rub(drink.price)}
          {drink.unit && ` · ${drink.unit}`}
        </p>
        <div role="radiogroup" aria-label="Выберите напиток" className="mt-6 flex flex-wrap gap-2">
          {drinks.map((d) => (
            <button
              key={d.slug}
              type="button"
              role="radio"
              aria-checked={d.slug === drink.slug}
              onClick={() => setSlug(d.slug)}
              className={clsx(
                "min-h-[40px] rounded-full border px-3.5 text-[14px] font-medium transition-colors",
                d.slug === drink.slug ? "border-ink bg-ink text-paper" : "border-line/20 text-ink-2 hover:border-ink/60 hover:text-ink",
              )}
            >
              {d.title.replace(/ «.+»$/, "")}
            </button>
          ))}
        </div>
      </div>
      <DrinkAnatomy drink={drink} className="mx-auto w-full max-w-[300px]" />
    </div>
  );
}
