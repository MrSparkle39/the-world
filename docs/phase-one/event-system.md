# Event system

`moonfallEvent` in `src/content/world.ts` is the first data-driven event shell.

Fields: name, status, stage, countdown label, community progress, cosy/adventure contribution blurbs, recent change.

Community progress is simulated content (labelled in development UI). Player completion flips `crackedMoonVisible` for world presentation.
