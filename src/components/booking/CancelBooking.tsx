"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Cancel with the last four digits of the phone: enough to stop a stranger with the link. */
export function CancelBooking({ code }: { code: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [digits, setDigits] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-ghost">
        Отменить бронь
      </button>
    );
  }

  return (
    <form
      className="flex w-full flex-col gap-3 rounded-2xl border border-line/15 p-4 sm:flex-row sm:items-end"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          const res = await fetch(`/api/bookings/${code}/cancel`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ phoneLast4: digits }),
          });
          const data = await res.json();
          if (!res.ok) setError(data.error ?? "Не получилось отменить");
          else router.refresh();
        } catch {
          setError("Нет связи с сервером");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="grid flex-1 gap-2" htmlFor="cancel-digits">
        <span className="text-[14px] font-semibold">Последние 4 цифры телефона из брони</span>
        <input
          id="cancel-digits"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="tabular h-12 rounded-xl border border-line/20 bg-surface px-4 text-[18px] tracking-[0.3em] outline-none focus:border-ink"
        />
        {error && <span className="text-[13.5px] text-wine">{error}</span>}
      </label>
      <button type="submit" disabled={digits.length !== 4 || busy} className="btn-primary disabled:opacity-50">
        {busy ? "Отменяем…" : "Отменить"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
        Не отменять
      </button>
    </form>
  );
}
