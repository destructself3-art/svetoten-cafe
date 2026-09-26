import { CoffeePicker, type PickerDrink } from "@/components/coffee/CoffeePicker";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { addDays, cafeDateKey, formatDay, isoDayOf } from "@/lib/time";

/** We roast on Tuesdays: the last Tuesday on or before today. */
function lastRoastDay(now = new Date()) {
  const today = cafeDateKey(now);
  const back = (isoDayOf(today) - 2 + 7) % 7;
  return formatDay(addDays(today, -back));
}

const FACTS = [
  { label: "Страна", value: "Эфиопия, регион Иргачеффе" },
  { label: "Обработка", value: "Мытая" },
  { label: "Высота", value: "1 900–2 200 м" },
  { label: "В чашке", value: "Бергамот, персик, жасмин" },
];

export function CoffeeSection({ drinks }: { drinks: PickerDrink[] }) {
  const roast = lastRoastDay();
  return (
    <section className="container-page pt-28 md:pt-40" aria-labelledby="coffee-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">Кофе</p>
            <h2 id="coffee-title" className="display mt-5 text-d-2 font-light">
              Обжариваем сами,
              <br />
              <em className="font-normal">по вторникам</em>
            </h2>
            <p className="mt-6 max-w-md text-[17.5px] leading-relaxed text-ink-2">
              Небольшой ростер стоит за баром. Каждую неделю выбираем новое зерно на субботнем каппинге, и к вторнику оно
              уже в кофемолке.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <div className="rounded-[24px] border border-line/10 p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">Зерно недели</p>
                <p className="text-[14px] text-ink-2">
                  обжарка: {roast.weekdayShort}, {roast.dayMonth}
                </p>
              </div>
              <dl className="mt-5 divide-y divide-line/10">
                {FACTS.map((f) => (
                  <div key={f.label} className="flex justify-between gap-6 py-2.5 text-[15.5px]">
                    <dt className="text-ink-2">{f.label}</dt>
                    <dd className="text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <CoffeePicker drinks={drinks} />
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-12 md:gap-6">
        <Reveal className="col-span-2 md:col-span-7">
          <MediaFrame shot="process-espresso" alt="Двойной эспрессо течёт из бездонного холдера в стеклянную чашку" sizes="(max-width: 820px) 100vw, 58vw" className="aspect-[3/2] rounded-[24px]" />
          <p className="mt-3 text-[14px] text-ink-2">Эспрессо: 18 граммов зерна, 28 секунд, 40 мл в чашке.</p>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-5 md:mt-24">
          <MediaFrame shot="process-pour-over" alt="Воронка V60: тонкая струя воды из чайника с гусиным носиком" sizes="(max-width: 820px) 50vw, 40vw" className="aspect-[3/2] rounded-[24px]" />
          <p className="mt-3 text-[14px] text-ink-2">Фильтр вручную, 3 минуты 30 секунд.</p>
        </Reveal>
        <Reveal delay={0.12} className="md:col-span-5 md:col-start-2">
          <MediaFrame shot="process-roast" alt="Свежеобжаренное зерно ссыпается в охлаждающий лоток ростера" sizes="(max-width: 820px) 50vw, 40vw" className="aspect-[3/2] rounded-[24px]" />
          <p className="mt-3 text-[14px] text-ink-2">Ростер на 2 кг, обжариваем по вторникам с 7 утра.</p>
        </Reveal>
        <Reveal delay={0.16} className="col-span-2 md:col-span-5 md:col-start-8 md:-mt-10">
          <MediaFrame shot="process-latte-art" alt="Руки бариста рисуют розетту молочной пеной" sizes="(max-width: 820px) 100vw, 40vw" className="aspect-[3/2] rounded-[24px]" />
          <p className="mt-3 text-[14px] text-ink-2">Латте-арт учим рисовать по воскресеньям.</p>
        </Reveal>
      </div>
    </section>
  );
}
