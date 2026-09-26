import clsx from "clsx";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { toggleStock } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rub } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Стоп-лист" };

export default async function StopListPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sort: "asc" },
    include: { items: { orderBy: { sort: "asc" } } },
  });
  const stopped = categories.flatMap((c) => c.items).filter((i) => !i.inStock);

  return (
    <>
      <AdminHeader active="menu" />
      <main className="container-page py-8">
        <p className="eyebrow">Стоп-лист</p>
        <h1 className="display mt-3 text-[48px] font-light leading-none">
          Что закончилось <em className="font-normal">сегодня</em>
        </h1>
        <p className="mt-4 max-w-xl text-[15.5px] text-ink-2">
          Позиция в стоп-листе сразу зачёркивается в меню на сайте и в блоке «Сейчас в меню». Верните её, когда снова будет на
          кухне.
        </p>
        <p className="mt-6 text-[15px]">
          {stopped.length === 0 ? "Всё в наличии." : `В стоп-листе: ${stopped.map((i) => i.title).join(", ")}.`}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {categories.map((c) => (
            <section key={c.id} aria-labelledby={`stop-${c.slug}`}>
              <h2 id={`stop-${c.slug}`} className="border-b border-line/15 pb-3 text-[19px] font-semibold">
                {c.title}
              </h2>
              <ul>
                {c.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-4 border-b border-line/5 py-3">
                    <span className={clsx("flex-1 text-[15.5px]", !i.inStock && "text-ink-3 line-through decoration-wine/60")}>{i.title}</span>
                    <span className="tabular text-[14px] text-ink-2">{rub(i.price)}</span>
                    <form action={toggleStock}>
                      <input type="hidden" name="id" value={i.id} />
                      <button
                        type="submit"
                        role="switch"
                        aria-checked={i.inStock}
                        aria-label={`${i.title}: ${i.inStock ? "в наличии, поставить на стоп" : "на стопе, вернуть в меню"}`}
                        className={clsx(
                          "relative h-7 w-12 rounded-full border transition-colors",
                          i.inStock ? "border-honey-ink bg-honey/40" : "border-line/25 bg-sunk",
                        )}
                      >
                        <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full transition-all", i.inStock ? "left-[22px] bg-ink" : "left-0.5 bg-ink-3")} />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
