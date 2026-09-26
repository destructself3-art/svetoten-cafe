// Where the liquid sits in each hero photo: center (cx, cy) as fractions of the photo, radius r as a
// fraction of the photo height. Measured on the delivered photos (coffee by luminance, wine by eye on a grid).
// The live canvas is laid over this circle; r is a touch smaller than the surface so it never covers the rim.

export type HeroShot = { shot: string; cx: number; cy: number; r: number; ar: number };

export const HERO_CALIBRATION: Record<"day" | "night", { desktop: HeroShot; mobile: HeroShot }> = {
  day: {
    desktop: { shot: "hero-day", cx: 0.4955, cy: 0.4538, r: 0.17, ar: 16 / 9 },
    mobile: { shot: "hero-day-mobile", cx: 0.4935, cy: 0.475, r: 0.0635, ar: 9 / 16 },
  },
  night: {
    desktop: { shot: "hero-night", cx: 0.508, cy: 0.405, r: 0.166, ar: 16 / 9 },
    mobile: { shot: "hero-night-mobile", cx: 0.507, cy: 0.449, r: 0.082, ar: 9 / 16 },
  },
};

/** Used for the drawn cup and glass when a photo is missing. */
export const DRAWN: Omit<HeroShot, "shot"> = { cx: 0.5, cy: 0.5, r: 0.105, ar: 16 / 9 };
