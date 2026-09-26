# Svetoten — photo shot list

66 shots. Save every image with the exact file name below (any of jpg/png/webp) into `svetoten-cafe/photos-raw/`.

Priorities: **A** Каркас сайта · **B** Меню: хиты · **C** Расширение

## Workflow

1. Use one model and the same settings for the whole series.
2. Generate `hero-day` and `interior-day` first; use them as style references where the tool allows.
3. Night pairs (`editFrom`): generate by editing the day image with the Edit prompt, so the framing matches. Use the standalone prompt only if the tool cannot edit.
4. Reject images with text, logos or faces. Hands are fine.
5. Highest available resolution, at least 2048 px on the long side.

## hero

### hero-day.jpg — 16:9 · priority A · day

```text
A perfectly top-down (90° overhead) photograph of a café table. Exactly in the center of the frame stands a single wide round white porcelain cup with a thin charcoal rim on a matching saucer, filled to the brim with plain black coffee: a smooth, glossy, uniform dark surface with absolutely no milk, no foam and no latte art. The cup and saucer take up about one third of the frame height. A small brushed-brass teaspoon lies on the saucer. Only near the edges of the frame: a butter croissant on a small plate in the lower-left corner, a folded pale linen napkin in the upper-right corner, a few coffee beans. Plenty of empty tabletop around the cup. Pale grey terrazzo tabletop with small warm-toned stone chips. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 16:9.
```

### hero-night.jpg — 16:9 · priority A · night

Edit prompt (attach `hero-day`):

```text
Edit the attached image. Keep exactly the same camera angle, framing, tabletop and the positions of all objects. Change the scene to late evening: replace the coffee cup and saucer with a single stemmed wine glass seen from directly above, in exactly the same central position and at the same size, filled with deep ruby-red wine with a smooth uniform surface; replace the croissant with a small plate of green olives and a slice of sourdough bread; keep the napkin. Turn off the daylight: the only light is now a small candle in an amber glass holder near the upper-left edge. Warm amber light on the glass and the nearby table, everything else falls into deep cool graphite shadow (chiaroscuro). No people, no text, no logos, no watermark.
```

Standalone prompt:

```text
A perfectly top-down (90° overhead) photograph of a café table at night. Exactly in the center of the frame: a single stemmed wine glass seen from directly above, filled with deep ruby-red wine with a smooth uniform surface reflecting a small point of candlelight; the glass takes up about one third of the frame height. Only near the edges: a small candle in an amber glass holder near the upper-left edge, a small plate of green olives with a slice of sourdough bread in the lower-left corner, a folded linen napkin in the upper-right corner. Plenty of empty tabletop around the glass. The same pale grey terrazzo tabletop, mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 16:9.
```

### hero-day-mobile.jpg — 9:16 · priority C · day

Edit prompt (attach `hero-day`):

```text
Expand the attached image into a vertical 9:16 composition (outpaint). Keep the cup, saucer, spoon, tabletop, light and shadows exactly as they are; the cup stays at the horizontal center, slightly below the middle of the frame. Extend the same pale grey terrazzo tabletop above and below, continuing the window shadows naturally. No people, no text, no logos, no watermark.
```

Standalone prompt:

```text
A perfectly top-down (90° overhead) vertical photograph of a café table. At the horizontal center, slightly below the middle of the frame: a single wide round white porcelain cup with a thin charcoal rim on a matching saucer, filled to the brim with plain black coffee, a smooth glossy uniform dark surface with absolutely no milk, no foam and no latte art. A small brushed-brass teaspoon on the saucer. Near the edges only: a croissant on a small plate at the bottom left, a folded pale linen napkin at the top right. Plenty of empty tabletop. Pale grey terrazzo tabletop with small warm-toned stone chips. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 9:16.
```

### hero-night-mobile.jpg — 9:16 · priority C · night

Edit prompt (attach `hero-day-mobile`):

```text
Edit the attached image. Keep exactly the same camera angle, framing, tabletop and the positions of all objects. Change the scene to late evening: replace the coffee cup and saucer with a single stemmed wine glass seen from directly above, in exactly the same position and at the same size, filled with deep ruby-red wine with a smooth uniform surface; replace the croissant with a small plate of green olives and a slice of sourdough bread; keep the napkin. The only light is now a small candle in an amber glass holder near the top-left edge: warm amber light nearby, everything else in deep cool graphite shadow (chiaroscuro). No people, no text, no logos, no watermark.
```

Standalone prompt:

```text
A perfectly top-down (90° overhead) vertical photograph of a café table at night. At the horizontal center, slightly below the middle of the frame: a single stemmed wine glass seen from directly above, filled with deep ruby-red wine with a smooth uniform surface reflecting a point of candlelight. Near the edges only: a small candle in an amber glass holder at the top left, a small plate of green olives with a slice of sourdough bread at the bottom left, a folded linen napkin at the top right. The same pale grey terrazzo tabletop, mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 9:16.
```

## modes

### interior-day.jpg — 16:9 · priority A · day

```text
Wide interior photograph of a small, empty café-bistro in the morning, shot at eye level from the entrance toward the bar with a 24mm lens and straight verticals. Along the left wall, tall black steel-framed windows with thin grid mullions let in sunlight that draws long crisp grid-shaped shadows across a pale grey terrazzo floor and the tables. Small round tables with pale grey terrazzo tops and dark graphite-stained oak bentwood chairs; on the right, a long bar counter with a brushed zinc top, a polished steel espresso machine and a glass pastry case; warm limestone-plaster walls, a few large olive trees in clay pots, brass pendant lamps (switched off) above the tables. Calm, airy and minimal. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 16:9.
```

### interior-night.jpg — 16:9 · priority A · night

Edit prompt (attach `interior-day`):

```text
Edit the attached image. Keep exactly the same camera position, perspective, furniture and layout. Change the time to late evening: the windows now show deep blue dusk with softly blurred warm city lights; the brass pendant lamps glow warm amber; a small candle in an amber glass holder burns on every table; a few wine glasses and an open bottle stand on the tables; the shelves behind the bar are lit from below and hold rows of wine bottles with no readable labels. The room is lit only by the lamps and candles: warm pools of light and deep cool shadows (chiaroscuro). No people, no text, no logos, no watermark.
```

Standalone prompt:

```text
Wide interior photograph of a small, empty café-bistro late in the evening, shot at eye level from the entrance toward the bar with a 24mm lens and straight verticals. Along the left wall, tall black steel-framed windows show deep blue dusk with softly blurred warm city lights. Small round tables with pale grey terrazzo tops and dark graphite-stained oak bentwood chairs, a small candle in an amber glass holder and a few wine glasses on every table; on the right, a long bar counter with a brushed zinc top and shelves of wine bottles with no readable labels, lit from below; limestone-plaster walls, olive trees in clay pots, brass pendant lamps glowing warm amber above the tables. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 16:9.
```

### detail-window-light.jpg — 16:9 · priority A · day

```text
An almost empty limestone-plaster wall inside a café in the morning. Sunlight projects the crisp shadow of a black steel-framed window grid and a few olive leaves across the wall; a small floating shelf holds a single white porcelain cup with a thin charcoal rim. Lots of empty wall space, the play of light and shadow is the main subject. Minimal and calm. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 16:9.
```

## zones

### zone-window.jpg — 4:5 · priority A · day

```text
A table for two by a tall black steel-framed window in a café-bistro: a round pale grey terrazzo table, two dark oak bentwood chairs, two cappuccinos in white porcelain cups with a thin charcoal rim, a small vase with a sprig of olive. The morning sun casts a crisp grid of window shadows over the table and the floor; a quiet old-town street is softly out of focus outside. Eye level, 35mm lens. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### zone-sofa.jpg — 4:5 · priority A · night

```text
A cozy lounge corner of a café-bistro in the evening: a deep cognac-brown leather sofa against a limestone-plaster wall, a low round table with two glasses of red wine and a small candle in an amber glass holder, a brass floor lamp glowing warm, a smoky grey wool throw. Eye level, 35mm lens. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### zone-bar.jpg — 4:5 · priority A · day

```text
The bar counter of a café-bistro: a long counter with a brushed zinc top and a brass footrail, four dark oak high stools, a polished steel espresso machine and a coffee grinder at the left end, open shelves behind with white porcelain cups and rows of wine bottles with no readable labels. Warm afternoon sun through a steel-framed window crosses the counter in crisp grid-shaped stripes. Eye level, 35mm lens. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### zone-terrace.jpg — 4:5 · priority A · day

```text
A small summer terrace of a café-bistro on a quiet old-town street at golden hour: four small round tables with pale grey terrazzo tops, dark oak bentwood chairs, olive trees and lavender in clay pots, warm string lights just switched on, a black steel-framed glass facade behind. Eye level, 35mm lens. Light: low golden-hour sun from the left, long warm shadows on the stone pavement, cool soft shade under the trees (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### zone-communal.jpg — 4:5 · priority A · night

```text
A long communal table for eight in a café-bistro, set for a dinner party: a pale grey terrazzo top, a natural linen runner, candles in amber glass holders, white porcelain plates with a thin charcoal rim, wine glasses and small vases with dried grasses; brass pendant lamps glow above the table. Eye level, 35mm lens. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

## coffee

### process-espresso.jpg — 3:2 · priority A · night

```text
Macro photograph of a double espresso extraction: two thick streams of golden-brown espresso with tiger-striped crema flowing from a bottomless portafilter into a small clear glass cup, droplets and texture visible. 100mm macro lens. Light: a single narrow beam of warm light from the side makes the coffee glow like amber against a deep graphite-black background (chiaroscuro). Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### process-latte-art.jpg — 3:2 · priority A · day

```text
A top-down close-up of a barista's hands pouring silky steamed milk from a steel milk pitcher into a wide white porcelain cup with a thin charcoal rim, drawing a crisp rosetta latte-art pattern in the glossy crema, on a brushed zinc counter. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. Only hands are visible, no faces. No text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### process-pour-over.jpg — 3:2 · priority A · day

```text
Pour-over coffee being brewed: a slim matte black gooseneck kettle pours a thin spiral stream of hot water into a white porcelain V60 dripper on a clear glass server, backlit steam glowing in the sunlight, on a brushed zinc counter. 50mm lens. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### process-roast.jpg — 3:2 · priority A · night

```text
Freshly roasted coffee beans cascading from a small drum roaster into a round cooling tray with rotating steel arms, glossy medium-brown beans, thin wisps of smoke. Light: warm daylight from a single window at the side, deep cool shadows around the roaster (chiaroscuro). Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

## events

### event-vinyl.jpg — 3:2 · priority A · night

```text
A vintage turntable playing a black vinyl record on a dark oak sideboard in a café-bistro at night, a brass table lamp glowing beside it, a small stack of record sleeves with abstract color-block covers and no legible text, a glass of red wine. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### event-wine-tasting.jpg — 3:2 · priority A · night

```text
A wine tasting on a long table at night: a row of six wine glasses with wines ranging from pale gold through orange amber to deep ruby, three bottles with no labels, small blank tasting cards and a candle in an amber glass holder. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### event-cupping.jpg — 3:2 · priority A · day

```text
Top-down photograph of a coffee cupping session: rows of small white porcelain cupping bowls filled with ground coffee under an unbroken crust, silver cupping spoons, a few bowls with the crust broken showing dark coffee, small piles of green and roasted coffee beans, on a pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### event-latte-class.jpg — 3:2 · priority A · day

```text
Close-up of two pairs of hands at a café bar during a latte-art workshop: one person holds a white porcelain cup while the other guides the pour from a steel milk pitcher; a few finished cups with heart and tulip latte art stand on the brushed zinc counter. Shallow depth of field. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. Only hands are visible, no faces. No text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

## drinks

### menu-espresso.jpg — 4:5 · priority B · day

```text
An espresso in a small thick-walled white porcelain cup with a thin charcoal rim on a saucer, rich hazelnut-colored crema, a small glass of sparkling water beside it, on a pale grey terrazzo table against a limestone-plaster wall. Eye-level three-quarter view, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-cappuccino.jpg — 4:5 · priority B · day

```text
A cappuccino in a white porcelain cup with a thin charcoal rim on a saucer, glossy microfoam with a perfect heart latte art, a brushed-brass teaspoon, on a pale grey terrazzo table. 45-degree view, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-flat-white.jpg — 4:5 · priority B · day

```text
A flat white in a small white porcelain cup with a thin charcoal rim, thin velvety microfoam with a small tulip latte art, on a pale grey terrazzo table. 45-degree view, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-raf.jpg — 4:5 · priority B · day

```text
Raf coffee, a Russian specialty: a creamy, velvety pale caramel-colored coffee drink in a tall clear glass, topped with burnt caramel crumbs and a few flakes of sea salt, on a pale grey terrazzo table. Eye-level three-quarter view, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-v60.jpg — 4:5 · priority B · day

```text
Filter coffee: a clear glass carafe of bright amber filter coffee glowing in the sun next to a small white porcelain cup, a white porcelain V60 dripper resting beside them, on a pale grey terrazzo table. Eye-level view, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-espresso-tonic.jpg — 4:5 · priority B · day

```text
Espresso tonic in a tall clear highball glass with large clear ice cubes: sparkling tonic below and a dark layer of espresso on top slowly bleeding down in swirls, a twist of orange peel, condensation droplets on the glass, backlit by the sun, on a pale grey terrazzo table. Eye-level view, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-sea-buckthorn-tea.jpg — 4:5 · priority B · day

```text
Hot sea buckthorn tea in a clear glass teapot: bright orange tea with whole sea buckthorn berries, orange slices and a sprig of thyme, a small glass cup and a little dish of honey beside it, on a pale grey terrazzo table. 45-degree view, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-latte.jpg — 4:5 · priority C · day

```text
A caffè latte in a tall clear glass on a saucer, the layers of espresso and milk visible through the glass, a smooth foam top with a small heart latte art, a long brass spoon, on a pale grey terrazzo table. Eye-level view, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-cacao.jpg — 4:5 · priority C · day

```text
Hot cocoa made on oat milk in a white porcelain cup with a thin charcoal rim, a thick glossy chocolate surface with a dusting of cocoa powder, a piece of dark chocolate on the saucer, on a pale grey terrazzo table. 45-degree view, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-matcha.jpg — 4:5 · priority C · day

```text
An iced matcha latte in a clear glass: bright green matcha poured over milk and ice, forming a soft gradient, a small bamboo whisk beside the glass, on a pale grey terrazzo table. Eye-level view, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

## morning

### menu-syrniki.jpg — 4:5 · priority B · day

```text
Four golden-brown syrniki (thick Russian farmer's-cheese pancakes) on a white porcelain plate with a thin charcoal rim, with a dollop of sour cream, a spoonful of berry sauce, fresh raspberries and blueberries, a mint leaf and a dusting of powdered sugar. Shot from directly overhead (flat lay), plate centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-eggs-benedict.jpg — 4:5 · priority B · day

```text
Eggs Benedict on toasted brioche with smoked salmon: two poached eggs under glossy hollandaise sauce, chives and cracked black pepper, a few microgreens, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-shakshuka.jpg — 4:5 · priority B · day

```text
Shakshuka in a small black cast-iron pan: two baked eggs with runny yolks in a rich spiced tomato and pepper sauce, crumbled feta and fresh cilantro, two slices of toasted sourdough beside the pan. Shot from directly overhead (flat lay), pan centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-ricotta-toast.jpg — 4:5 · priority B · day

```text
A thick slice of toasted sourdough with whipped ricotta, fresh fig quarters, a drizzle of honey, crushed pistachios and thyme leaves, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-porridge.jpg — 4:5 · priority B · day

```text
Creamy oatmeal porridge cooked on coconut milk in a wide white porcelain bowl with a thin charcoal rim, topped with half a caramelized baked pear, cinnamon, toasted almond flakes and a drizzle of maple syrup. Shot from directly overhead (flat lay), bowl centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-croissant.jpg — 4:5 · priority B · day

```text
A single large, golden, flaky butter croissant with visible honeycomb layers and crisp shards, on a small white porcelain plate with a thin charcoal rim, on a pale grey terrazzo table. Low 30-degree angle, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-cardamom-bun.jpg — 4:5 · priority B · day

```text
Two Scandinavian cardamom knot buns with pearl sugar and a glossy golden crust on a sheet of baking paper, on a pale grey terrazzo table. Low 30-degree angle, 80mm lens, subject centered with generous space around. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-granola.jpg — 4:5 · priority C · day

```text
Homemade granola with thick Greek yogurt, sea buckthorn purée, fresh berries and a drizzle of honey in a wide white porcelain bowl with a thin charcoal rim. Shot from directly overhead (flat lay), bowl centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-canele.jpg — 4:5 · priority C · day

```text
Three canelés de Bordeaux with dark caramelized crusts, one cut in half to show the custardy inside, on a small white porcelain plate with a thin charcoal rim, on a pale grey terrazzo table. Low 30-degree angle, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

## lunch

### menu-pumpkin-soup.jpg — 4:5 · priority B · day

```text
Velvety bright orange pumpkin cream soup in a wide white porcelain bowl with a thin charcoal rim, a swirl of cream, a drizzle of smoked paprika oil and toasted pumpkin seeds, a slice of sourdough on the side. Shot from directly overhead (flat lay), bowl centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-borscht.jpg — 4:5 · priority B · day

```text
A bowl of deep ruby-red beetroot borscht with tender braised beef cheek, a spoonful of sour cream and fresh dill, in a white porcelain bowl with a thin charcoal rim, a slice of dark rye bread beside it. Shot from directly overhead (flat lay), bowl centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-beet-salad.jpg — 4:5 · priority B · day

```text
Roasted beetroot salad: wedges of ruby and golden beetroot, crumbled goat cheese, toasted hazelnuts, arugula, orange segments and a thin balsamic glaze, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-pasta.jpg — 4:5 · priority B · day

```text
A twirled nest of tagliatelle with ribbons of zucchini, lemon zest, grated parmesan, fresh basil and cracked black pepper in a glossy butter sauce, in a wide white porcelain bowl with a thin charcoal rim. Shot from directly overhead (flat lay), bowl centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-focaccia.jpg — 4:5 · priority C · day

```text
A focaccia sandwich with fresh mozzarella, ripe tomatoes and basil pesto, cut in half to show the layers, on baking paper on a pale grey terrazzo table. Low 30-degree angle, 80mm lens, subject centered. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-salmon-bowl.jpg — 4:5 · priority C · day

```text
A bowl with glazed teriyaki salmon, jasmine rice, edamame, cucumber, avocado, pickled ginger and sesame seeds in a wide white porcelain bowl with a thin charcoal rim. Shot from directly overhead (flat lay), bowl centered with generous empty tabletop around it, pale grey terrazzo table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

## evening

### menu-burrata.jpg — 4:5 · priority B · night

```text
A whole creamy burrata torn open, surrounded by heirloom cherry tomatoes in red, yellow and green, basil oil, flaky salt and a few basil leaves, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-tartare.jpg — 4:5 · priority B · night

```text
Beef tartare shaped into a neat round with a glossy raw egg yolk on top, capers, finely diced shallots and chives, thin crisp toasts on the side, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-cheese-board.jpg — 4:5 · priority B · night

```text
A dark oak board with three cheeses, a creamy blue, shards of an aged hard cheese and a soft washed-rind cheese, with honeycomb, walnuts, fresh figs, grapes and crackers. Shot from directly overhead (flat lay), board centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-duck.jpg — 4:5 · priority B · night

```text
Sliced pink duck breast with crispy skin, fanned out, with a glossy dark cherry sauce, a swoosh of pale celeriac purée, a few whole cherries and thyme, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-zander.jpg — 4:5 · priority B · night

```text
Pan-seared zander (pike-perch) fillet with crisp golden skin on a pool of silky beurre blanc, charred baked leek and dots of chive oil, on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-espresso-martini.jpg — 4:5 · priority B · night

```text
An espresso martini in a chilled coupe glass with a thick velvety tan foam and three coffee beans on top, on a brushed zinc bar counter. Eye-level view, 80mm lens, subject centered with generous space around. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-basque-cheesecake.jpg — 4:5 · priority B · night

```text
A slice of Basque burnt cheesecake with a deeply caramelized, almost black top and a creamy, slightly molten center, on a white porcelain plate with a thin charcoal rim, a brass dessert fork beside it. Low 30-degree angle, 80mm lens, subject centered. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-medovik.jpg — 4:5 · priority B · night

```text
A tall slice of Russian honey cake (medovik) with many thin golden layers and cream, drizzled with salted caramel and topped with crumbs, on a white porcelain plate with a thin charcoal rim. Low 30-degree angle, 80mm lens, subject centered. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-bruschetta.jpg — 4:5 · priority C · night

```text
Three bruschettas on a dark oak board: chicken liver pâté with cherry jam, tomatoes with basil, and ricotta with honey and walnuts. Shot from directly overhead (flat lay), board centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-scallop-crudo.jpg — 4:5 · priority C · night

```text
Scallop crudo: thin slices of raw scallop with citrus segments, fennel shavings, dill oil and pink peppercorns on a white porcelain plate with a thin charcoal rim. Shot from directly overhead (flat lay), plate centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-risotto.jpg — 4:5 · priority C · night

```text
Creamy porcini mushroom risotto with shaved parmesan and fresh thyme in a wide white porcelain bowl with a thin charcoal rim. Shot from directly overhead (flat lay), bowl centered, on a pale grey terrazzo table that is mostly in shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-negroni.jpg — 4:5 · priority C · night

```text
A negroni in a heavy crystal rocks glass with one large clear ice cube and a twist of orange peel, on a brushed zinc bar counter. Eye-level view, 80mm lens, subject centered. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-spritz.jpg — 4:5 · priority C · night

```text
A sea buckthorn spritz in a large wine glass with ice, a slice of orange and a sprig of rosemary, fine bubbles rising, on a brushed zinc bar counter. Eye-level view, 80mm lens, subject centered. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-tiramisu.jpg — 4:5 · priority C · night

```text
Tiramisu served in a small glass: layers of mascarpone cream and coffee-soaked savoiardi with a thick dusting of cocoa on top, a brass spoon beside it. Low 30-degree angle, 80mm lens, subject centered. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### menu-fondant.jpg — 4:5 · priority C · night

```text
A chocolate fondant with its molten center flowing out, a scoop of vanilla ice cream and a few raspberries, on a white porcelain plate with a thin charcoal rim. Low 30-degree angle, 80mm lens, subject centered. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

## atmosphere

### detail-candle.jpg — 4:5 · priority C · night

```text
Close-up of a small candle burning in an amber glass holder on a table at night, the stem of a wine glass and a folded linen napkin catching the warm light, everything else falling into deep shadow. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### detail-steam.jpg — 4:5 · priority C · night

```text
Backlit steam rising in soft curls from a white porcelain cup of black coffee against a deep graphite background, a thin rim of warm light along the cup. Minimal composition. Light: strong warm backlight from behind the cup makes the steam glow; the background stays deep graphite-black (chiaroscuro). Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### detail-hands-cup.jpg — 4:5 · priority C · day

```text
Close-up of hands in an oat-colored knit sweater holding a cappuccino with heart latte art in a white porcelain cup with a thin charcoal rim, at a pale grey terrazzo table by a window. Shallow depth of field. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. Only hands are visible, no faces. No text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### detail-bakery.jpg — 3:2 · priority C · day

```text
Freshly baked golden croissants and cardamom buns on a black baking tray just out of the oven, a little steam rising, flour dust on a steel work table. Light: warm golden morning sunlight streams in from the left through a tall black steel-framed window and casts crisp grid-shaped window shadows across the scene; the lit areas glow warm and golden while the shadows stay cool, soft and slightly bluish (warm light, cool shadows). Palette: porcelain white, pale grey terrazzo, graphite, zinc grey, with warm honey and amber highlights and touches of brushed brass. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 3:2.
```

### facade-evening.jpg — 4:5 · priority C · night

```text
Street view of a small corner café-bistro on the ground floor of an old European-style town building at blue hour: tall black steel-framed windows glowing with warm light, glimpses of brass pendant lamps and empty tables inside, two olive trees in clay pots and a small bench by the entrance, wet cobblestones reflecting the light, no readable signage. 35mm lens. Light: blue-hour dusk outside with deep cool blue shadows; the windows glow warm amber from the inside. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```

### wine-pour.jpg — 4:5 · priority C · night

```text
Deep ruby-red wine being poured from a bottle into a large wine glass, a dramatic swirl in the bowl, against a graphite-black background, a single warm side light making the wine glow. 100mm lens. Light: low-key chiaroscuro; the only light comes from a single candle in an amber glass holder and a dim brass pendant lamp at the upper left, creating warm amber pools of light, deep cool graphite-black shadows and glowing highlights on glass and brass, like a Dutch still-life painting. Palette: graphite black, smoky grey, warm amber, brass and deep wine red. Premium editorial photography for a modern café-bistro, shot on a medium-format camera, true-to-life colors, rich realistic textures, subtle fine film grain. No people, no text, no lettering, no logos, no watermark. Aspect ratio 4:5.
```
