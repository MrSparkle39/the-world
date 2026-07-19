# Content system

Locations, items, shops, quests, events and journal entries are defined as typed objects so future realms can land primarily as content + art.

Primary modules:

- `src/content/world.ts` — locations, map realms, wheel, bakery table, quests, event, journal
- `src/content/items/index.ts`
- `src/content/companions/index.ts`
- `src/content/explorers/index.ts`

Hotspots use percentage coordinates on `LayeredScene` for responsive click targets.
