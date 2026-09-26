# photos-raw

Drop the generated photos here, named exactly like the shots in `docs/shot-list.json`
(for example `hero-day.jpg`, `menu-syrniki.png`). Any of jpg, png, webp, avif.

Then run:

```
npm run photos
```

The script crops each photo to its shot's ratio, compresses it into `public/photos/`,
and updates `src/data/photo-manifest.json`. The site picks the photos up on the next page load.
The originals here are ignored by git.
