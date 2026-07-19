# Architecture (Phase One)

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS + Framer Motion
- Zustand player store + Zod schemas
- Phaser 3 Rewind Runner
- localStorage repositories (swap-ready interfaces)
- PWA manifest via `src/app/manifest.ts`

## Layers

1. **Content** (`src/content/*`) — data-driven locations, items, NPCs, quests, events
2. **Domain logic** (`src/lib/game/logic.ts`) — pure functions for dailies, wheel, shop, arcade caps
3. **Persistence** (`src/lib/repos`) — repository interfaces; Local* implementations
4. **State** (`src/lib/store/world-store.ts`) — hydrated Zustand store
5. **UI** — illustrated scenes, travel bar, modals, routes under `src/app`

## Persistence key

`the-world.player-save.v1`

## World mutation example

Moonfall completion sets `worldFlags.crackedMoonVisible`, which alters homepage, room window, map, and town sky overlays.
