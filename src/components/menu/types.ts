import type { Anatomy } from "@/data/menu";

export type MenuItemView = {
  slug: string;
  title: string;
  description: string;
  price: number;
  priceAlt: number | null;
  unit: string | null;
  unitAlt: string | null;
  tags: string[];
  photo: string | null;
  anatomy: Anatomy | null;
  inStock: boolean;
};

export type MenuCategoryView = {
  slug: string;
  title: string;
  subtitle: string | null;
  daypart: string;
  serves: string;
  items: MenuItemView[];
};
