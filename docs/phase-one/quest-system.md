# Quest system

Quests store `{ questId, stage, status, flags, updatedAt }` in `progress.questStates`.

Phase One quests:

1. **bakery-loaf** (cosy) — sort ingredients; rewards coins + bun + journal
2. **moonfall-prologue** (adventure) — observatory → explore → creature choice → fragment memory → return; sets cracked moon world flag

Resume is supported by reading the stored stage on `/adventure/moonfall-prologue`.
