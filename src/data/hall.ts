// Floor plan of the hall. Plan units: 1000 x 640. Interior 40..960 x 40..460, terrace below the facade.

export type Zone = "window" | "hall" | "sofa" | "communal" | "bar" | "terrace";

export const ZONES: Record<Zone, { title: string; blurb: string; photo: string; order: number }> = {
  window: { title: "У окна", blurb: "Солнце до обеда и вид на улицу. Столы на двоих.", photo: "zone-window", order: 1 },
  hall: { title: "Зал", blurb: "Центр зала, рядом с витриной. На 2–4 гостей.", photo: "interior-day", order: 2 },
  sofa: { title: "Диваны", blurb: "Мягкий угол под лампами. Вечером здесь уютнее всего.", photo: "zone-sofa", order: 3 },
  communal: { title: "Общий стол", blurb: "Длинный стол на 8 гостей: компании и дни рождения.", photo: "zone-communal", order: 4 },
  bar: { title: "Бар", blurb: "Места у стойки: видно, как варят кофе и открывают вино.", photo: "zone-bar", order: 5 },
  terrace: { title: "Терраса", blurb: "С мая по сентябрь. Пледы выдаём.", photo: "zone-terrace", order: 6 },
};

export type TableSeed = {
  code: string;
  label: string;
  zone: Zone;
  seatsMin: number;
  seatsMax: number;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "round" | "square" | "rect" | "sofa" | "bar";
  rotation?: number;
  note?: string;
};

export const TABLES: TableSeed[] = [
  { code: "W1", label: "1", zone: "window", seatsMin: 1, seatsMax: 2, x: 112, y: 104, w: 58, h: 58, shape: "round", note: "Первый от входа в зал, самое солнечное место" },
  { code: "W2", label: "2", zone: "window", seatsMin: 1, seatsMax: 2, x: 112, y: 200, w: 58, h: 58, shape: "round" },
  { code: "W3", label: "3", zone: "window", seatsMin: 1, seatsMax: 2, x: 112, y: 296, w: 58, h: 58, shape: "round" },
  { code: "W4", label: "4", zone: "window", seatsMin: 1, seatsMax: 2, x: 112, y: 392, w: 58, h: 58, shape: "round", note: "Ближе к выходу на террасу" },
  { code: "H1", label: "5", zone: "hall", seatsMin: 2, seatsMax: 4, x: 290, y: 150, w: 72, h: 72, shape: "square" },
  { code: "H2", label: "6", zone: "hall", seatsMin: 2, seatsMax: 4, x: 430, y: 150, w: 72, h: 72, shape: "square" },
  { code: "H3", label: "7", zone: "hall", seatsMin: 2, seatsMax: 4, x: 290, y: 312, w: 72, h: 72, shape: "square" },
  { code: "H4", label: "8", zone: "hall", seatsMin: 2, seatsMax: 4, x: 430, y: 312, w: 72, h: 72, shape: "square" },
  { code: "S1", label: "9", zone: "sofa", seatsMin: 2, seatsMax: 4, x: 575, y: 96, w: 124, h: 68, shape: "sofa", note: "Угловой диван под лампой" },
  { code: "S2", label: "10", zone: "sofa", seatsMin: 2, seatsMax: 4, x: 718, y: 96, w: 124, h: 68, shape: "sofa" },
  { code: "C1", label: "11", zone: "communal", seatsMin: 5, seatsMax: 8, x: 640, y: 316, w: 212, h: 64, shape: "rect", note: "Для компаний от 5 человек" },
  { code: "B1", label: "12", zone: "bar", seatsMin: 1, seatsMax: 2, x: 806, y: 176, w: 34, h: 78, shape: "bar", note: "Два места у стойки, рядом с кофемашиной" },
  { code: "B2", label: "13", zone: "bar", seatsMin: 1, seatsMax: 2, x: 806, y: 280, w: 34, h: 78, shape: "bar", note: "Два места у стойки, рядом с винным шкафом" },
  { code: "T1", label: "14", zone: "terrace", seatsMin: 1, seatsMax: 4, x: 200, y: 560, w: 64, h: 64, shape: "round" },
  { code: "T2", label: "15", zone: "terrace", seatsMin: 1, seatsMax: 4, x: 360, y: 560, w: 64, h: 64, shape: "round" },
  { code: "T3", label: "16", zone: "terrace", seatsMin: 1, seatsMax: 4, x: 650, y: 560, w: 64, h: 64, shape: "round" },
  { code: "T4", label: "17", zone: "terrace", seatsMin: 1, seatsMax: 4, x: 810, y: 560, w: 64, h: 64, shape: "round" },
];
