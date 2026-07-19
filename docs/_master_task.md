# CURSOR MASTER TASK

## Volume One: The First Playable Day

You are building the first substantial playable vertical slice of an original browser-based fantasy universe currently titled **The World**.

Do not return only a plan, wireframe or list of suggestions.

Inspect the repository, read the supplied design bible, design the assets, generate the images, implement the application, run it, test it, correct errors and leave the repository in a working state.

Read these files before beginning:

```text
/docs/The_World_Master_Design_Bible.pdf
/docs/reference-homepage.png
```

The PDF is the source of truth for the wider product vision.

The homepage reference image is the main quality target for atmosphere, richness, warmth and visual presentation. Do not simply use it as a flat screenshot. Recreate the experience as an interactive layered webpage.

---

# 1. Objective

Build a polished first playable chapter that proves all major parts of The World can operate together.

The player must be able to:

1. Arrive at the animated homepage.
2. Create a basic explorer profile.
3. Choose a magical companion.
4. Arrive at their personal room.
5. Open the world map.
6. Visit Backwards Town.
7. Collect a daily free item.
8. Spin a daily prize wheel.
9. Visit a shop.
10. inspect and use their inventory.
11. Play one polished browser arcade game.
12. Begin one short Adventure Mode quest.
13. Make at least one meaningful choice.
14. Earn coins and items.
15. Return home and see evidence that their first day happened.

This is not a disposable mock-up.

Build it as the beginning of the real product, but avoid unnecessary production infrastructure that would prevent the playable experience from being completed.

---

# 2. Product identity

The World is not:

* a generic educational game
* a social network for children
* a Neopets clone
* a retro Pokémon clone
* a normal fantasy RPG
* a collection of unrelated arcade games
* a website covered in corporate cards
* a digital book requiring constant reading

It is:

> A vast magical universe that players can visit briefly or disappear into for hours.

The player can enjoy The World in two broad ways.

## Cosy World

The cosy layer contains:

* illustrated click-through locations
* shops
* daily activities
* collectibles
* companions
* homes
* games
* strange NPCs
* secrets
* seasonal changes
* short visits requiring only a few minutes

## Adventure World

The adventure layer contains:

* unfolding stories
* quests
* exploration
* mysteries
* puzzles
* battles
* changing realms
* disasters
* world events
* consequences that can permanently alter locations

The player must never be forced to enter Adventure Mode.

A player who only wants to collect items, visit shops and play arcade games must still have a satisfying experience.

---

# 3. Core design principles

Follow these principles throughout the build.

## Magic first

The experience must feel magical before it feels educational.

## Story through action

Avoid large blocks of text.

Most dialogue should be one to three short speech bubbles.

Tell the story through:

* environment changes
* character behaviour
* objects
* choices
* games
* item descriptions
* animation
* short conversations

## Respect short and long sessions

The player should find a satisfying stopping point after:

* three minutes
* fifteen minutes
* forty-five minutes
* several hours

## Curiosity is rewarded

Clickable objects, unusual signs and background details should sometimes provide:

* tiny reactions
* jokes
* coins
* lore
* items
* secret counters
* hidden interactions

## Kindness without lectures

Good values should emerge naturally from situations.

Never display language such as:

```text
Correct! You demonstrated empathy.
```

Instead, let characters remember helpful choices and let the world respond naturally.

## No open chat

Do not implement player-to-player communication.

Do not include:

* direct messages
* open chat
* public comments
* usernames displayed to other children
* player-created text visible to strangers

---

# 4. Recommended technical architecture

Use the repository’s existing stack where practical.

For a new or flexible repository, use:

* Next.js
* React
* TypeScript
* App Router
* Tailwind CSS
* Framer Motion
* Phaser 3 for the arcade game and explorable quest section
* Zustand or a small typed React state layer
* Zod for validation
* local persistence for this vertical slice
* service/repository interfaces that can later be replaced by Supabase
* PWA configuration
* responsive browser support for desktop, phone and iPad

Do not block completion waiting for a production backend.

Create clean interfaces such as:

```text
PlayerRepository
InventoryRepository
QuestRepository
EventRepository
GameRewardRepository
SettingsRepository
```

For this phase, implementations may use local storage.

If Supabase is already configured correctly in the repository, use it carefully. Do not break a working Supabase setup.

Create a draft SQL schema inside:

```text
/docs/database/phase-one-schema.sql
```

The application should still run locally without requiring unavailable credentials.

---

# 5. Required route structure

Create these routes or equivalent routes that preserve the same experience:

```text
/
 /start
 /companion
 /home
 /map
 /places/backwards-town
 /places/backwards-town/bakery
 /places/backwards-town/wheel
 /places/backwards-town/general-store
 /places/backwards-town/arcade
 /games/rewind-runner
 /adventure
 /adventure/moonfall-prologue
 /inventory
 /companion-profile
 /journal
 /settings
```

Avoid full-page reloads between normal routes.

Add gentle illustrated transitions.

---

# 6. Persistent player data

Create a typed player state resembling:

```typescript
type PlayerProfile = {
  id: string;
  explorerName: string;
  ageBracket: "6-8" | "9-12" | "13-16";
  explorerStyle: string;
  companionId: string | null;
  coins: number;
  starlight: number;
  createdAt: string;
  lastVisitedAt: string;
};

type InventoryEntry = {
  itemId: string;
  quantity: number;
  acquiredAt: string;
  source: string;
};

type PlayerProgress = {
  completedOnboarding: boolean;
  visitedLocations: string[];
  collectedDailies: Record<string, string>;
  wheelSpins: Record<string, string>;
  questStates: Record<string, QuestState>;
  arcadeHighScores: Record<string, number>;
  discoveredSecrets: string[];
  worldFlags: Record<string, boolean | string | number>;
};
```

Persist the player’s:

* explorer
* companion
* coins
* items
* daily claims
* wheel spin
* quest progress
* arcade score
* settings
* discoveries

Add a reset-development-profile option inside Settings.

Do not expose technical JSON to the player.

---

# 7. Reusable content architecture

Do not hard-code every location directly into page components.

Create data-driven definitions for:

* realms
* locations
* hotspots
* NPCs
* shops
* items
* dialogue
* daily activities
* games
* quests
* global events
* secrets

Suggested structure:

```text
content/
  realms/
  locations/
  npcs/
  items/
  shops/
  quests/
  events/
  games/
```

A location definition should support:

```typescript
type LocationDefinition = {
  id: string;
  name: string;
  realmId: string;
  backgroundAsset: string;
  mobileBackgroundAsset?: string;
  musicAsset?: string;
  description: string;
  hotspots: HotspotDefinition[];
  ambientAnimations: AmbientAnimationDefinition[];
  availableFrom?: string;
  availableUntil?: string;
  worldStateVariants?: Record<string, LocationVariant>;
};
```

The goal is to allow future Cursor prompts to add new worlds primarily through content, artwork and small specialised components rather than rewriting the whole platform.

---

# 8. Shared visual direction

The visual direction must combine:

* warm storybook fantasy
* cosmic mystery
* highly distinctive realms
* hand-painted environment art
* subtle animation
* bold silhouettes
* odd and memorable details
* safe but not overly sugary presentation

Use:

* gouache texture
* watercolour texture
* polished digital painting
* warm natural lighting
* detailed illustrated backgrounds
* slightly exaggerated architecture
* atmospheric depth
* readable real HTML interface text

Avoid:

* generic flat vector illustration
* stock fantasy imagery
* default Tailwind dashboard appearance
* excessive gradients
* corporate white cards
* meaningless glowing particles everywhere
* obvious image-generation inconsistencies
* text baked into generated images
* gibberish signs
* copyrighted characters
* artwork strongly resembling Neopets, Pokémon, Borderlands or Harry Potter

The Borderlands influence should be expressed through bold and bizarre realm identities, not through weapons, adult humour or copied cel shading.

---

# 9. Asset generation workflow

Create:

```text
/docs/art/phase-one-art-manifest.md
```

For every generated asset, record:

* asset name
* route
* purpose
* dimensions
* transparent or opaque
* generation prompt
* negative prompt
* visual consistency notes
* file path

Use consistent naming.

Example:

```text
public/art/homepage/homepage-valley-base.webp
public/art/homepage/homepage-balloon.webp
public/art/homepage/homepage-windmill-blades.webp
public/art/backwards-town/town-square-base.webp
public/art/backwards-town/town-clock-overlay.webp
public/art/companions/spriggle-idle.webp
```

Generate high-resolution backgrounds.

Use AVIF or WebP where suitable.

Use transparent WebP or PNG for separately animated foreground objects.

Do not leave placeholder rectangles or stock photos.

---

# 10. Homepage

Route:

```text
/
```

Rebuild the homepage experience based on:

```text
/docs/reference-homepage.png
```

It should show:

* explorer and companion on a hill
* enormous fantasy valley
* distant town
* mountains
* waterfall
* windmill
* hot-air balloon
* clouds
* foreground foliage
* storybook title
* Start Adventure
* Continue Adventure when a profile exists
* Create Explorer
* Log In placeholder modal
* Options
* What is The World?

Animate:

* windmill blades
* balloon drift
* cloud layers
* waterfall
* occasional birds
* foliage
* tiny idle breathing motion
* subtle parallax on desktop

Respect reduced-motion settings.

The homepage should change after the player begins the Moonfall quest.

After the quest begins:

* a cracked moon should become visible in the distant sky
* a subtle event banner should appear
* the atmosphere should remain safe but feel unusual
* this should demonstrate that Adventure Mode can alter the cosy world

---

# 11. Explorer creation

Route:

```text
/start
```

Collect:

* explorer nickname
* age bracket
* one of four starter explorer designs

Do not request:

* full legal name
* exact birthdate
* address
* school
* public profile details

Age brackets:

```text
6–8
9–12
13–16
```

Use the bracket later to select age-appropriate dialogue variants.

For this phase, create one full dialogue set and demonstrate at least one scene with three age-adjusted variants.

Create four original explorer designs with varied:

* skin tones
* hair textures
* hairstyles
* presentation
* coat colours

Avoid labelling characters as male or female.

---

# 12. Companion selection

Route:

```text
/companion
```

Create three original starter companions.

They must not resemble existing franchise creatures.

## Companion One: Spriggle

A small cream-coloured fluffy creature with:

* unusual soft ears
* tiny green backpack
* living sprout on its head
* curious personality
* tendency to collect buttons

## Companion Two: Glim

A round midnight-blue creature with:

* soft glowing markings
* short floating tail
* large expressive eyes
* calm personality
* attraction to starlight

## Companion Three: Pebbit

A squat mossy stone creature with:

* tiny legs
* lichen-like fur
* small flowers appearing when happy
* stubborn but loyal personality
* tendency to fall asleep in warm places

For each companion show:

* idle animation
* short personality description
* one harmless starter ability
* one funny habit

The choice should feel meaningful but not irreversible.

Allow later switching, but the selected companion becomes the player’s first-day companion.

---

# 13. Player home

Route:

```text
/home
```

This is the player’s safe personal space.

Create a small circular room inside an old Wayfinder tower.

Include:

* bed
* companion sleeping place
* shelf
* wardrobe
* window overlooking the valley
* journal
* map table
* locked mysterious door
* one empty display shelf
* one notice board
* travel chest
* clock

Clickable interactions:

## Bed

Short animation and message:

```text
Not tired yet. There are still paths you have not seen.
```

## Companion bed

Opens companion profile.

## Shelf

Opens the player’s collection display.

## Wardrobe

Shows the selected explorer and future customisation placeholder.

## Window

Shows the current world state, including the cracked moon after the event begins.

## Journal

Opens `/journal`.

## Map table

Opens `/map`.

## Locked door

Initially says:

```text
There is no handle on this side.
```

Create an internal secret-click counter.

After several clicks across visits, slightly change the sound or response, but do not open it.

## Travel chest

Opens inventory.

After the player completes the first quest, place a visible quest reward in the room.

This demonstrates persistent environmental progression.

---

# 14. World map

Route:

```text
/map
```

Create an illustrated cosmic map called **The Between**.

The map should show several realms, but only some are available.

Visible destinations:

## The Crossroads

Player home and central hub.

Available.

## Backwards Town

First playable cosy location.

Available.

## The Rusted Moon

Visible but initially locked.

## The Upside-Down Ocean

Visible but initially locked.

## The Library of Unwritten Things

Visible but initially locked.

## The Giant’s Garden

Visible but initially locked.

## The Quiet Planet

Visible but initially locked.

## The Black Sun Carnival

Visible but marked:

```text
Appears when it chooses.
```

The locations should float in a strange cosmic medium containing:

* star paths
* threads of light
* nebula-like clouds
* doorways
* constellations
* subtle shapes resembling neurons

Never explain whether the universe is:

* space
* a dream
* a mind
* an organism
* magic

Maintain the mystery.

Clicking locked realms should provide atmospheric messages rather than generic “Coming Soon” text.

Example:

```text
The path exists, but it has not noticed you yet.
```

---

# 15. Backwards Town

Route:

```text
/places/backwards-town
```

This is the main cosy location in Phase One.

The town should feel:

* warm
* strange
* funny
* dense
* alive
* memorable
* slightly impossible

Design rules:

* clocks run backwards
* shop exits are marked as entrances
* people say goodbye when greeting the player
* smoke occasionally returns into chimneys
* a fountain appears to splash upward
* one pedestrian walks backwards without acknowledging it
* a delivery cart unloads empty boxes and drives away full
* the town sign reads correctly in HTML but the arrow points away from town

Create clickable hotspots:

1. Yesterday’s Bakery
2. The Wheel of Before
3. The General Store of Things You Nearly Needed
4. Rewind Arcade
5. Town Clock
6. Crooked Mailbox
7. Fountain
8. Alleyway
9. Return to Map

Show hover labels, but allow decorative objects to react without labels.

---

# 16. Yesterday’s Bakery

Route:

```text
/places/backwards-town/bakery
```

NPC:

```text
Mara Crumb
```

Mara is a warm, exhausted baker who keeps receiving finished cakes before ordering their ingredients.

Create short dialogue.

Initial greeting:

```text
Goodbye! You must be the new Wayfinder.
```

The player may respond:

```text
Hello.
Why did you say goodbye?
I might be. What happened here?
```

Create a small first quest introduction involving an “unbaked loaf.”

This is not the main Adventure Mode quest.

It is a cosy side activity.

Player helps sort ingredients in a tiny interactive sequence.

Reward:

* 25 coins
* Yesterday’s Bun
* Mara added to journal
* bakery freebie unlocked

The bun’s item description:

```text
Baked tomorrow morning. Surprisingly fresh.
```

---

# 17. Daily freebie

Inside the bakery, create a daily claim interaction.

The player receives one item from a weighted table.

Possible items:

* Yesterday’s Bun
* Pocket Crumb
* Jam That Has Not Been Opened Yet
* Backwards Biscuit
* Rare: Recipe for an Empty Pie

Allow one claim per local calendar day.

Show:

* closed parcel
* opening animation
* revealed reward
* rarity
* inventory update

Do not allow repeated claims through route refreshing.

---

# 18. Wheel of Before

Route:

```text
/places/backwards-town/wheel
```

Create a polished daily prize wheel.

NPC:

```text
Tock
```

Tock is a tiny clockmaker who insists the wheel has already been spun.

Prizes:

* 10 coins
* 25 coins
* 50 coins
* Backwards Biscuit
* Clock Hand
* Nothing, but with a funny response
* rare Rewind Token
* extremely rare Tiny Tomorrow

The visual wheel must:

* animate convincingly
* slow naturally
* land deterministically on the awarded prize
* support touch
* prevent double spins
* update inventory or currency
* show next available spin time

Do not manipulate the result after visually landing.

Use a seeded result chosen before the animation begins.

---

# 19. General store

Route:

```text
/places/backwards-town/general-store
```

NPC:

```text
Mr Before
```

He is an elderly shopkeeper who answers questions moments before the player asks them.

Sell:

* Small Lantern
* Crooked Room Rug
* Button Jar
* Companion Snack
* Backwards Town Poster
* Clockwork Hat
* Empty Map Frame

The player starts with enough coins to purchase at least one cheap item after completing the bakery task.

Implement:

* item cards
* item detail modal
* price
* quantity
* buy button
* insufficient-funds response
* inventory update
* confirmation animation

The shop should feel illustrated and physical, not like an e-commerce dashboard.

---

# 20. Inventory

Route:

```text
/inventory
```

Categories:

* Food
* Clothing
* Home
* Quest
* Curiosities

Each item should have:

* icon
* name
* description
* rarity
* quantity
* source
* action where relevant

Allow:

* eating a companion snack
* placing one home decoration
* inspecting quest items
* favouriting an item

Do not allow item deletion in this phase.

Home decorations should visibly appear in the player room after being placed.

---

# 21. Rewind Arcade

Route:

```text
/places/backwards-town/arcade
```

Create an illustrated arcade inside a crooked old theatre.

Show several game cabinets.

Only one is playable:

```text
Rewind Runner
```

Other cabinets can be visible but asleep, covered or mysteriously unavailable.

Do not use generic “Coming Soon” labels.

Example messages:

```text
This machine is dreaming.
```

```text
Someone appears to have stolen Tuesday from this cabinet.
```

The arcade should make it easy for a player who only wants games to start playing immediately.

---

# 22. Arcade game: Rewind Runner

Route:

```text
/games/rewind-runner
```

Build a complete Phaser game.

Concept:

The player runs backwards through Backwards Town while obstacles repair themselves in reverse.

The player character is one of the town’s small courier creatures.

Core gameplay:

* side-scrolling endless runner
* character automatically moves
* jump
* duck or slide
* collect lost seconds
* avoid carts, signs, puddles and reversing doors
* occasional reversed controls warning section
* speed increases gradually
* short sessions of approximately two to five minutes
* keyboard controls
* touch controls
* pause
* mute
* restart
* game-over screen

Polish requirements:

* proper character sprite
* animated run cycle
* jump animation
* landing animation
* parallax scenery
* particles used sparingly
* satisfying collection effect
* sound-ready architecture
* responsive canvas
* fair obstacle spawning
* no impossible patterns
* clear tutorial
* score
* best score
* coin reward
* daily first-play bonus

Reward formula should have sensible limits.

Do not let score manipulation produce unlimited coins.

First score milestone reward:

```text
Courier’s Rewind Cap
```

The reward must appear in inventory and be wearable from the wardrobe.

---

# 23. Adventure Mode entry

Route:

```text
/adventure
```

Create a distinct but connected Adventure Mode entrance.

The player arrives at an ancient observatory near The Crossroads.

NPC:

```text
Orra Vale
```

Orra is an older Wayfinder who is brilliant, distracted and deeply worried by something she has seen in the sky.

This page should make the player feel that the scale of the game has changed.

Include:

* enormous telescope
* star charts
* cracked celestial instrument
* distant moon
* strange radio-like magical device
* sealed portal
* current Adventure chapter

The player can leave immediately and return to the cosy world.

Never shame them for declining.

Button choices:

```text
Begin the Moonfall Prologue
Maybe another time
Return Home
```

---

# 24. Moonfall Prologue

Route:

```text
/adventure/moonfall-prologue
```

Build a short playable quest lasting approximately fifteen to twenty-five minutes.

It must support saving and resuming at major steps.

## Premise

A small moon visible above The Crossroads has cracked.

Fragments are drifting away.

Something appears to have struck it from within.

The player is not being asked to defeat a giant boss yet.

This is the beginning of a future global event.

## Quest stages

### Stage One: Observatory

Speak with Orra.

Keep dialogue brief.

She shows the player the moon through the telescope.

The crack visibly grows.

The companion reacts.

### Stage Two: Follow the fallen light

A fragment lands near an old path.

Create a small explorable Phaser area.

Controls:

* keyboard
* touch joystick or tap movement
* simple interactions
* no difficult combat

Player searches:

* broken telescope marker
* glowing plants
* strange footprint
* moon fragment

### Stage Three: Frightened creature

A small cosmic creature is trapped near the fragment.

It initially appears hostile.

Provide three options:

* strike the creature
* offer food
* observe before acting

Do not make this a simplistic morality quiz.

Consequences:

#### Strike

The creature flees and drops the fragment.

The player progresses, but the journal notes that it left frightened.

#### Offer food

If the player has suitable food, it calms down and reveals where the fragment landed.

#### Observe

The player discovers the creature is protecting a smaller creature hidden nearby.

The player may move the fragment safely.

No option should completely block progress.

The kinder or more thoughtful path should provide deeper understanding, not an obnoxiously larger reward.

### Stage Four: Fragment response

When touched, the fragment shows a very short visual memory:

* an enormous shadow inside the moon
* an eye-like light opening
* the moon cracking outward
* signal lost

No final explanation.

### Stage Five: Return

Return to Orra.

The cracked moon becomes permanently visible from:

* homepage
* player room window
* world map
* Backwards Town sky

Unlock:

* Moonfall journal entry
* Moon Fragment quest item
* event banner
* global event preview

---

# 25. Global event framework

Implement the first data-driven event shell.

Event:

```text
Moonfall
```

Status:

```text
Prologue
```

Display:

* event name
* countdown placeholder driven by data
* event stage
* community progress bar
* cosy contribution category
* adventure contribution category
* recent world change

For this phase, use simulated global values stored in event content.

Do not pretend simulated values are truly live.

Label development data clearly only in development mode.

Design the event system so it can later support backend-driven totals.

Cosy contribution examples for later:

* donate supplies
* complete moon-themed mini-games
* collect fragments
* help displaced NPCs
* light lanterns

Adventure contributions for later:

* story missions
* exploration
* boss phases
* moon repairs
* realm defence

The event preview should demonstrate how both player styles eventually contribute to the same story.

---

# 26. Journal

Route:

```text
/journal
```

Sections:

* People
* Places
* Discoveries
* Quests
* Strange Things
* Events

Entries unlock as the player explores.

Create entries for:

* Mara Crumb
* Orra Vale
* Backwards Town
* The Crossroads
* Yesterday’s Bakery
* Moonfall
* Moon Fragment
* the chosen companion

The journal should feel like an illustrated travel book.

Do not use long encyclopaedia articles.

Use short observations written in the player’s voice.

Example:

```text
Mara said goodbye when I arrived. Nobody else seemed to think that was strange.
```

---

# 27. Settings and accessibility

Route:

```text
/settings
```

Include:

* music
* sound effects
* volume
* Full/Gentle/Reduced motion
* standard or large text
* high contrast
* keyboard-control guide
* touch-control guide
* reset local profile for development

Respect:

```css
prefers-reduced-motion
```

All major experiences must be keyboard accessible.

Use semantic HTML.

Use visible focus states.

Do not trap players inside canvas experiences without an obvious exit.

---

# 28. PWA and device requirements

The application must work as:

* desktop website
* mobile website
* tablet website
* installable PWA

Create:

* web app manifest
* icons
* theme colour
* install-ready structure
* responsive navigation

Do not force landscape orientation for general pages.

Arcade and adventure gameplay may recommend landscape on small phones, but must remain usable in portrait where practical.

Test at minimum:

```text
390 × 844
768 × 1024
1366 × 768
1920 × 1080
```

---

# 29. Navigation

Create an in-world navigation system.

Do not use a corporate top navbar.

Possible elements:

* compass
* satchel
* journal
* map
* companion portrait
* coin count
* home icon
* event indicator

Keep navigation readable and consistent.

On smaller devices, collapse it into an illustrated travel bar or satchel menu.

---

# 30. Loading and error states

Create themed loading states.

Examples:

```text
Finding the path…
```

```text
The map is remembering where it put that town…
```

```text
Waiting for tomorrow to move out of the way…
```

Do not show blank white screens.

Create a themed 404 page:

```text
This path does not appear to lead anywhere today.
```

Include a button returning to the map.

---

# 31. Testing requirements

Write automated tests for critical logic:

* daily claim can only occur once
* wheel can only spin once
* wheel result matches visual result
* purchases deduct coins correctly
* inventory quantities update
* quest stages persist
* arcade reward caps work
* age bracket chooses the correct dialogue variant
* placed room decoration persists
* event state alters relevant backgrounds
* profile survives reload

Run:

* type checking
* linting
* unit tests
* production build

Fix all errors.

Do not finish with failing tests or known runtime exceptions.

---

# 32. Quality rules

Do not leave:

* lorem ipsum
* grey image placeholders
* default browser buttons
* generic AI-generated icons
* broken asset paths
* dead navigation
* empty routes
* random inconsistent art
* giant text-heavy tutorial pages
* unexplained developer controls in the player interface
* console errors
* TypeScript errors

Do not claim features work without testing them.

Do not create fifty shallow pages.

Create a smaller number of convincing, connected, polished experiences.

---

# 33. Suggested implementation order

Follow this sequence unless the repository requires a justified variation.

## Workstream One: Foundation

* audit repository
* establish architecture
* define player state
* define content models
* configure persistence
* add PWA shell
* create shared navigation
* create settings

## Workstream Two: Art system

* read visual bible
* create art manifest
* generate core assets
* optimise assets
* build layered scene component
* establish reusable hotspot system
* establish illustrated modal system

## Workstream Three: Onboarding

* homepage
* explorer creation
* companion selection
* initial persistence

## Workstream Four: Cosy hub

* player room
* map
* Backwards Town
* bakery
* freebie
* wheel
* shop
* inventory

## Workstream Five: Arcade

* Rewind Arcade
* Rewind Runner
* scoring
* touch controls
* reward integration

## Workstream Six: Adventure

* observatory
* Moonfall quest
* small explorable area
* choice
* journal updates
* persistent cracked-moon world state

## Workstream Seven: Event shell

* Moonfall event definition
* countdown component
* global progress component
* homepage event banner
* map and world-state changes

## Workstream Eight: Final quality pass

* responsive review
* accessibility review
* visual consistency
* loading
* error handling
* tests
* production build
* README
* completion report

---

# 34. Required documentation

Create:

```text
/docs/phase-one/
```

Include:

```text
architecture.md
content-system.md
art-manifest.md
image-prompts.md
player-data.md
quest-system.md
event-system.md
testing.md
known-future-work.md
```

Update the root README with:

* installation
* environment variables
* local development
* testing
* build
* asset generation
* how to add a location
* how to add an item
* how to add a quest
* how to add a game
* how to add an event

---

# 35. Completion report

At the end of the task, produce:

```text
/docs/phase-one/completion-report.md
```

Include:

* what was built
* routes created
* assets generated
* gameplay completed
* tests run
* known limitations
* screenshots or screenshot paths
* exact commands to run the project
* recommended next phase

Do not mark the phase complete unless the full first-day journey can be played from beginning to end.

---

# 36. Final acceptance journey

Before finishing, manually verify this exact flow:

1. Open homepage.
2. Create explorer.
3. Choose companion.
4. Arrive in room.
5. Open map.
6. Enter Backwards Town.
7. Visit bakery.
8. Complete bakery interaction.
9. Claim daily item.
10. Spin Wheel of Before.
11. Buy one shop item.
12. Inspect inventory.
13. Enter Rewind Arcade.
14. Play Rewind Runner.
15. Receive game reward.
16. Return home.
17. Begin Moonfall Prologue.
18. Explore fallen-fragment area.
19. Make creature choice.
20. Return fragment to Orra.
21. See cracked moon reflected across the wider world.
22. Reload the application.
23. Confirm all meaningful progress remains.

The completed application should feel like the first genuine day inside a much larger universe.

It must prove this promise:

> Visit briefly, or stay for an adventure. The World will meet you wherever you are.
</user_query>