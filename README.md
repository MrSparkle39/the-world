# The World

A browser-first magical universe for curiosity, adventure and kindness.

Volume One delivers the **first playable day**: homepage → explorer → companion → home → Backwards Town dailies → Rewind Runner → Moonfall prologue, with local persistence.

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Next.js app |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run art:generate` | Regenerate painted art plates |

## Environment

No backend credentials are required for Phase One. Progress stores in `localStorage` under `the-world.player-save.v1`.

Optional later: Supabase. Draft SQL: `docs/database/phase-one-schema.sql`.

## Design sources

- `docs/The_World_Master_Design_Bible.pdf`
- `docs/reference-homepage.png`
- `docs/phase-one/` documentation set

## How to extend

### Add a location

1. Add art under `public/art/...`
2. Define the location in `src/content/world.ts`
3. Add a route under `src/app/places/...`
4. Use `LayeredScene` + hotspots

### Add an item

1. Add icon under `public/art/items/`
2. Register in `src/content/items/index.ts`
3. Reference from shops, dailies, or quests

### Add a quest

1. Add stages in `src/content/world.ts` (`quests`)
2. Drive stage transitions via `useWorldStore().setQuestStage`
3. Unlock journal entries with `unlockJournal`

### Add a game

1. Create `src/app/games/<id>/page.tsx`
2. Award via `recordArcadeRun` (coin caps enforced in `src/lib/game/logic.ts`)

### Add an event

1. Extend `moonfallEvent` pattern in `src/content/world.ts`
2. Reflect flags in homepage / map / room overlays via `worldFlags`

## Accessibility

Settings support motion modes, text size, and high contrast. Arcade and adventure expose keyboard controls and an obvious Exit.

## License / credit

Original IP for The World. Homepage valley art retained from the project hero illustration.
