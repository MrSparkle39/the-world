# Phase One completion report

## What was built

Volume One — **The First Playable Day** — as a Next.js App Router application with local persistence, content-driven locations, illustrated scenes, Rewind Runner (Phaser 3), and Moonfall Prologue adventure with a persistent cracked-moon world flag.

## Routes

| Route | Status |
| --- | --- |
| `/` | Animated homepage (image-fill + contain zoom-out, balloon) |
| `/start` | Explorer creation |
| `/companion` | Spriggle / Glim / Pebbit |
| `/home` | Wayfinder tower room |
| `/map` | The Between |
| `/places/backwards-town` | Cosy hub |
| `/places/backwards-town/bakery` | Mara + loaf quest + daily |
| `/places/backwards-town/wheel` | Wheel of Before |
| `/places/backwards-town/general-store` | Mr Before shop |
| `/places/backwards-town/arcade` | Arcade hall |
| `/games/rewind-runner` | Phaser endless runner |
| `/adventure` | Observatory + event shell |
| `/adventure/moonfall-prologue` | Full prologue stages |
| `/inventory` | Satchel |
| `/companion-profile` | Companion sheet |
| `/journal` | Travel journal |
| `/settings` | Accessibility + reset profile |
| 404 | Themed missing path |

## Assets

- Approved homepage valley + balloon reused under `public/art/homepage/`
- Painted plates for town, interiors, companions, explorers, map, adventure, items, PWA icons via `scripts/generate-art.py`
- Manifest: `docs/art/phase-one-art-manifest.md`

## Gameplay completed

Acceptance journey path is wired end-to-end:

homepage → create explorer → companion → home → map → Backwards Town → bakery quest + daily → wheel → shop → inventory → Rewind Runner rewards → Moonfall prologue (explore + creature choice) → cracked moon on homepage/home/map/town → reload keeps `localStorage` save.

## Tests run

```text
npm run typecheck   # pass
npm test            # 10/10 pass
npm run lint        # pass
npm run build       # pass (22 static routes)
```

## Known limitations

- Art plates are stylised generated paintings (not final bible-grade illustration pass)
- Arcade touch controls are basic; keyboard is primary
- Music/SFX toggles are persisted but audio beds not yet authored
- Event community progress is simulated content data
- Windmill/banner square overlays intentionally omitted (prior rejection)

## Run commands

```bash
cd C:\Users\mnbay\the-world
npm install
npm run dev
```

Open http://127.0.0.1:3000/

Production:

```bash
npm run build
npm start
```

## Recommended next phase

Phase Two from the design bible: richer realm art frames, deeper Backwards Town secrets, first family/account soft shell (still no open chat), and the next Moonfall chapter after the prologue.
