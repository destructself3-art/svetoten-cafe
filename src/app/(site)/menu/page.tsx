import type { Metadata } from "next";
import { MenuDay } from "@/components/menu/MenuDay";
import type { MenuCategoryView } from "@/components/menu/types";
import type { Anatomy } from "@/data/menu";
import { prisma } from "@/lib/prisma";
import { cafeParts, daypartOf } from "@/lib/time";

export const metadata: Metadata = {
  title: "Меню",
  description: "Кофе своей обжарки, завтраки, обеды, вино и маленькие тарелки. Цены и граммовки.",
};

// The stop-list is edited from the admin panel: always read it fresh.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const rows = await prisma.category.findMany({
    orderBy: { sort: "asc" },
    include: { items: { orderBy: { sort: "asc" } } },
  });

  const categories: MenuCategoryView[] = rows.map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    daypart: c.daypart,
    serves: c.serves,
    items: c.items.map((i) => ({
      slug: i.slug,
      title: i.title,
      description: i.description,
      price: i.price,
      priceAlt: i.priceAlt,
      unit: i.unit,
      unitAlt: i.unitAlt,
      tags: i.tags ? i.tags.split(",").filter(Boolean) : [],
      photo: i.photo,
      anatomy: i.anatomy ? (JSON.parse(i.anatomy) as Anatomy) : null,
      inStock: i.inStock,
    })),
  }));

  return <MenuDay categories={categories} nowPart={daypartOf(cafeParts(new Date()).minutes)} />;
}
