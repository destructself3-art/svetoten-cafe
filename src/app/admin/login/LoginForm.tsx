"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 grid gap-3">
      <label htmlFor="admin-password" className="text-[14px] font-semibold">
        Пароль
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="h-12 rounded-xl border border-line/20 bg-surface px-4 text-[16px] outline-none focus:border-ink"
      />
      {state?.error && (
        <p className="text-[14px] text-wine" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary mt-2 disabled:opacity-60">
        {pending ? "Проверяем…" : "Войти"}
      </button>
    </form>
  );
}
