import { Hero } from "@/components/home/Hero";
import { TwoLights } from "@/components/home/TwoLights";
import { NowServing, type FeaturedItem } from "@/components/home/NowServing";
import { CoffeeSection } from "@/components/home/CoffeeSection";
import { EveningSection } from "@/components/home/EveningSection";
import { HallTeaser } from "@/components/home/HallTeaser";
import { FindUs } from "@/components/home/FindUs";
import type { PickerDrink } from "@/components/coffee/CoffeePicker";
import { FEATURED, type Anatomy } from "@/data/menu";
import { upcomingEvents } from "@/data/events";
import { prisma } from "@/lib/prisma";
import { terraceOpen } from "@/lib/booking-rules";
import { cafeDateKey, cafeParts, daypartOf } from "@/lib/time";
import type { Daypart } from "@/lib/cafe";

// Time of day, the stop-list and the event dates change constantly: render on every request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const featuredSlugs = [...FEATURED.morning, ...FEATURED.day, ...FEATURED.evening];

  const [featuredRows, coffeeRows, tables] = await Promise.all([
    prisma.menuItem.findMany({ where: { slug: { in: featuredSlugs } }, include: { category: true } }),
    prisma.menuItem.findMany({ where: { category: { slug: "coffee" }, anatomy: { not: null } }, orderBy: { sort: "asc" } }),
    prisma.diningTable.findMany({ where: { active: true }, orderBy: { sort: "asc" } }),
  ]);

  const toFeatured = (slug: string): FeaturedItem | null => {
    const row = featuredRows.find((r) => r.slug === slug);
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      price: row.price,
      unit: row.unit,
      photo: row.photo,
      category: row.category.title,
      inStock: row.inStock,
    };
  };
  const groups = Object.fromEntries(
    (Object.keys(FEATURED) as Daypart[]).map((part) => [part, FEATURED[part].map(toFeatured).filter((x): x is FeaturedItem => x !== null)]),
  ) as Record<Daypart, FeaturedItem[]>;

  const drinks: PickerDrink[] = coffeeRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    price: row.price,
    unit: row.unit,
    anatomy: JSON.parse(row.anatomy as string) as Anatomy,
  }));

  return (
    <>
      <Hero />
      <TwoLights />
      <NowServing groups={groups} initialPart={daypartOf(cafeParts(now).minutes)} />
      <CoffeeSection drinks={drinks} />
      <EveningSection events={upcomingEvents(now, 4)} />
      <HallTeaser
        tables={tables.map((t) => ({ ...t, state: "idle" as const }))}
        terraceOpen={terraceOpen(cafeDateKey(now))}
      />
      <FindUs />
    </>
  );
}
