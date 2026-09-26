import clsx from "clsx";
import { Reveal } from "@/components/ui/Reveal";
import { DayNightSlider } from "./DayNightSlider";

const TIMELINE = [
  { time: "08:00", title: "Первый эспрессо", text: "Открываемся, первые круассаны уже в печи.", phase: "morning" },
  { time: "12:00", title: "Обеды", text: "Суп дня и паста. По будням ланч за 690 ₽.", phase: "day" },
  { time: "18:00", title: "Свечи и вино", text: "Приглушаем свет, открываем винную карту.", phase: "dusk" },
  { time: "00:00", title: "Последний бокал", text: "В пятницу и субботу работаем до полуночи.", phase: "night" },
] as const;

export function TwoLights() {
  return (
    <section className="container-page pt-24 md:pt-36" aria-labelledby="two-lights-title">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <Reveal>
          <p className="eyebrow">Одно место, два света</p>
          <h2 id="two-lights-title" className="display mt-5 text-d-2 font-light">
            Столы те же.
            <br />
            <em className="font-normal">Меняется свет.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-xl text-[18px] leading-relaxed text-ink-2 lg:pb-3">
            Утром сюда заходят за спешелти и круассанами из печи. В шесть вечера мы приглушаем лампы, зажигаем свечи и открываем
            вино. Кто был у нас утром, вечером зал не узнаёт.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-10 md:mt-14">
        <DayNightSlider />
      </Reveal>

      <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4" aria-label="Один день в «Светотени»">
        <span className="absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-honey via-line/30 to-line/60 lg:block" aria-hidden />
        {TIMELINE.map((step, i) => (
          <Reveal as="li" key={step.time} delay={i * 0.08} className="relative">
            <span
              className={clsx(
                "relative block h-[15px] w-[15px] rounded-full border",
                step.phase === "morning" && "border-honey bg-honey shadow-[0_0_14px_rgb(var(--honey))]",
                step.phase === "day" && "border-honey bg-paper",
                step.phase === "dusk" && "border-ink bg-gradient-to-r from-honey from-50% to-ink to-50%",
                step.phase === "night" && "border-ink bg-ink",
              )}
              aria-hidden
            />
            <p className="display tabular mt-5 text-[44px] font-light leading-none">{step.time}</p>
            <p className="mt-3 text-[16px] font-semibold">{step.title}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{step.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
