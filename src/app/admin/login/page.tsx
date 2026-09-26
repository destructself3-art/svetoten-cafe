import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-[100svh] place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Светотень · для владельца</p>
        <h1 className="display mt-4 text-[56px] font-light leading-none">
          Панель
          <br />
          <em className="font-normal">управления</em>
        </h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">Брони на день, статусы гостей и стоп-лист меню.</p>
        <LoginForm />
        <p className="mt-6 rounded-2xl border border-line/15 px-4 py-3 text-[14px] text-ink-2">
          Это демо для портфолио. Пароль: <span className="font-mono font-semibold text-ink">svetoten</span>
        </p>
      </div>
    </main>
  );
}
