"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { TAG_LABELS } from "@/data/menu";
import { rub } from "@/lib/format";
import type { MenuItemView } from "./types";

type Props = {
  item: MenuItemView;
  open: boolean;
  onToggle: () => void;
  onHover: (item: MenuItemView | null) => void;
};

function Price({ item }: { item: MenuItemView }) {
  if (!item.inStock) return <span className="text-[14px] text-wine">Закончилось сегодня</span>;
  if (item.priceAlt && item.unitAlt) {
    return (
      <span className="tabular flex flex-col items-end gap-0.5 text-[16px] sm:flex-row sm:gap-4">
        <span>
          <span className="mr-1.5 text-[13.5px] text-ink-2">{item.unit}</span>
          {rub(item.price)}
        </span>
        <span>
          <span className="mr-1.5 text-[13.5px] text-ink-2">{item.unitAlt}</span>
          {rub(item.priceAlt)}
        </span>
      </span>
    );
  }
  return (
    <span className="tabular text-[16px]">
      {item.unit && <span className="mr-2 text-[13.5px] text-ink-2">{item.unit}</span>}
      {rub(item.price)}
    </span>
  );
}

/** One line of the menu. Hover shows the photo (desktop); tap opens it inline (touch). */
export function MenuRow({ item, open, onToggle, onHover }: Props) {
  const signature = item.tags.includes("signature");
  const otherTags = item.tags.filter((t) => t !== "signature" && TAG_LABELS[t]);
  const hasPhoto = Boolean(item.photo);

  return (
    <li
      className={clsx("group border-b border-line/10", !item.inStock && "opacity-70")}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <button
        type="button"
        onClick={onToggle}
        onFocus={() => onHover(item)}
        onBlur={() => onHover(null)}
        aria-expanded={hasPhoto ? open : undefined}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-5 text-left"
      >
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {signature && (
            <span className="relative top-[1px] inline-block h-3 w-3 shrink-0 overflow-hidden rounded-full bg-honey" title="Фирменное">
              <span className="absolute inset-y-0 right-0 w-1/2 bg-ink" />
              <span className="sr-only">Фирменное: </span>
            </span>
          )}
          <span
            className={clsx(
              "text-[18px] font-semibold leading-snug transition-colors sm:text-[19px]",
              !item.inStock && "line-through decoration-wine/70",
              item.inStock && "group-hover:text-honey-ink",
            )}
          >
            {item.title}
          </span>
          {otherTags.map((t) => (
            <span key={t} className="font-label text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-3">
              {TAG_LABELS[t]}
            </span>
          ))}
        </span>
        <span className="justify-self-end text-right">
          <Price item={item} />
        </span>
        <span className="col-span-2 max-w-[42rem] text-[15.5px] leading-relaxed text-ink-2 sm:col-span-1">{item.description}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && hasPhoto && (
          <motion.div
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <MediaFrame shot={item.photo!} alt={item.title} sizes="100vw" className="mb-5 aspect-[4/5] max-h-[420px] rounded-[20px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
