import Link from "next/link";
import clsx from "clsx";
import { Mark } from "@/components/ui/Logo";
import { ModeToggle } from "@/components/mode/ModeToggle";
import { logout } from "@/app/admin/actions";

const TABS = [
  { href: "/admin", label: "Брони", key: "bookings" },
  { href: "/admin/menu", label: "Стоп-лист", key: "menu" },
] as const;

export function AdminHeader({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/10 bg-paper/90 backdrop-blur-xl">
      <div className="container-page flex min-h-[64px] flex-wrap items-center gap-x-6 gap-y-2 py-2">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Mark className="h-7 w-7" />
          <span className="text-[15px] font-semibold">
            Светотень <span className="font-normal text-ink-2">· панель владельца</span>
          </span>
        </Link>
        <nav aria-label="Разделы панели" className="flex gap-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              aria-current={t.key === active ? "page" : undefined}
              className={clsx(
                "inline-flex min-h-[40px] items-center rounded-full px-4 text-[14.5px] font-medium transition-colors",
                t.key === active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ModeToggle compact />
          <Link href="/" className="link-underline text-[14.5px] text-ink-2">
            Открыть сайт
          </Link>
          <form action={logout}>
            <button type="submit" className="btn-ghost !min-h-[40px] !px-4 !text-[14px]">
              Выйти
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
