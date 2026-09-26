# Svetoten — café by day, bistro by night

Portfolio site for a fictional café-bistro in Nizhny Novgorod. The whole identity is built on light and shadow
("светотень"): the site follows the café's clock and switches from daylight to a candle-lit evening at 18:00.

- **Live latte hero**: a WebGL fluid simulation you can stir with the cursor or a finger; the barista pours a heart,
  tulip or rosetta. In the evening the cup becomes a glass of wine that swirls the same way.
- **Menu as one day**: scroll from the morning espresso to the last glass. At the 18:00 band the page darkens and a
  candle is lit. Dish photos follow the cursor; coffee drinks show a poured cross-section of their layers.
- **Table booking**: date, party size, free time slots and a live floor plan of 17 tables in six zones.
  Double booking is impossible at the database level (unique table + 30-minute slot). Ticket page, .ics file,
  cancellation by the last four phone digits, optional Telegram notification.
- **Owner panel** (`/admin`, demo password `svetoten`): day timeline by table, guest statuses, phone bookings,
  stop-list that strikes items out on the site immediately.

## Run

Double-click `start.bat`, or:

```
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma db seed
npm run dev -- --port 3100
```

Open http://localhost:3100.

## Photos

The site works without photos: every frame shows a drawn "light study" with the expected file name.
Prompts for all 66 shots are in `docs/PHOTO_PROMPTS.md` (per shot) and `docs/BATCH_PROMPTS.md` (three passes for a
chat-based image model). Put the generated files into `photos-raw/` named by shot id, then:

```
npm run photos
```

After the hero photos arrive, adjust the liquid position in `src/data/hero.ts` if the cup is not exactly centered.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 3 · framer-motion · Lenis ·
Prisma 7 + SQLite (better-sqlite3 adapter) · zod 4. Fonts: Noto Serif Display (condensed) and Sofia Sans.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run photos` | Process `photos-raw/` into `public/photos/` and the photo manifest |
| `npm run shotlist` | Rebuild the prompt documents from `docs/shot-list.json` |
| `npm run db:seed` | Upsert the menu and the floor plan |
| `npm run db:reset` | Recreate the database from scratch |

Concept project for a portfolio: the café, its address and phone number are fictional.
