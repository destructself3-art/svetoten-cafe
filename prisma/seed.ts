// Seeds the menu and the floor plan. Safe to run again: everything is upserted by slug/code.
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { MENU } from "../src/data/menu";
import { TABLES } from "../src/data/hall";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" }),
});

async function main() {
  let items = 0;
  for (const [ci, cat] of MENU.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { title: cat.title, subtitle: cat.subtitle, daypart: cat.daypart, serves: cat.serves, sort: ci },
      create: { slug: cat.slug, title: cat.title, subtitle: cat.subtitle, daypart: cat.daypart, serves: cat.serves, sort: ci },
    });
    for (const [ii, item] of cat.items.entries()) {
      const data = {
        categoryId: category.id,
        title: item.title,
        description: item.description,
        price: item.price,
        priceAlt: item.priceAlt ?? null,
        unit: item.unit ?? null,
        unitAlt: item.unitAlt ?? null,
        tags: (item.tags ?? []).join(","),
        photo: item.photo ?? null,
        anatomy: item.anatomy ? JSON.stringify(item.anatomy) : null,
        sort: ii,
      };
      await prisma.menuItem.upsert({ where: { slug: item.slug }, update: data, create: { slug: item.slug, ...data } });
      items++;
    }
  }

  for (const [i, t] of TABLES.entries()) {
    const data = {
      label: t.label,
      zone: t.zone,
      seatsMin: t.seatsMin,
      seatsMax: t.seatsMax,
      x: t.x,
      y: t.y,
      w: t.w,
      h: t.h,
      shape: t.shape,
      rotation: t.rotation ?? 0,
      note: t.note ?? null,
      sort: i,
    };
    await prisma.diningTable.upsert({ where: { code: t.code }, update: data, create: { code: t.code, ...data } });
  }

  console.log(`Seeded ${MENU.length} categories, ${items} menu items, ${TABLES.length} tables.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
