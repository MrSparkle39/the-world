# Phase One art manifest

Source visual direction: `docs/The_World_Master_Design_Bible.pdf` + `docs/reference-homepage.png`.

## Naming

Assets live under `public/art/<realm-or-system>/<name>.png`.

## Core assets

| Asset | Route / purpose | Size | Notes | Path |
| --- | --- | --- | --- | --- |
| Homepage valley | `/` base landscape | 1536×1024 | Reused from approved hero art | `public/art/homepage/homepage-valley-base.png` |
| Hot-air balloon | `/` floating prop | transparent PNG | Animated with Framer Motion | `public/art/homepage/homepage-balloon.png` |
| Spriggle / Glim / Pebbit | `/companion` | portrait | Original companions | `public/art/companions/*-idle.png` |
| Explorer styles | `/start` | portrait | Four starter looks | `public/art/explorers/*.png` |
| Tower room | `/home` | scene | Wayfinder circular room | `public/art/home/tower-room.png` |
| The Between | `/map` | scene | Cosmic map medium | `public/art/map/the-between.png` |
| Backwards Town square | `/places/backwards-town` | scene | Cosy hub | `public/art/backwards-town/town-square-base.png` |
| Bakery / wheel / store / arcade | place interiors | scene | Hand-painted style plates | `public/art/backwards-town/*.png` |
| Observatory + fragment path | adventure | scene | Moonfall prologue | `public/art/adventure/*.png` |
| Item icons | inventory/shop | 128×128 | Distinct painted icons | `public/art/items/*.png` |
| Cracked moon overlays | world flag | overlay | Shown after prologue | `**/sky-cracked-moon.png`, `window-cracked-moon.png` |
| PWA icons | install | 192 / 512 | Theme colours | `public/icons/icon-*.png` |

## Generation

```bash
npm run art:generate
```

Prompts and consistency notes: `docs/phase-one/image-prompts.md`.

Negative prompt baseline: text, watermarks, logos, copyrighted characters, photoreal faces, Neopets/Pokémon likeness, grey placeholder UI, gibberish signs.
