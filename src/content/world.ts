import type {
  DailyTableEntry,
  EventDefinition,
  JournalEntry,
  LocationDefinition,
  NpcDefinition,
  QuestDefinition,
  ShopDefinition,
  WheelPrize,
} from "@/lib/types/content";

export const npcs: Record<string, NpcDefinition> = {
  "mara-crumb": {
    id: "mara-crumb",
    name: "Mara Crumb",
    locationId: "bakery",
    portrait: "/art/backwards-town/mara-crumb.png",
    blurb: "Warm, exhausted baker of finished cakes that arrive early.",
  },
  tock: {
    id: "tock",
    name: "Tock",
    locationId: "wheel",
    portrait: "/art/backwards-town/tock.png",
    blurb: "Tiny clockmaker who insists the wheel already spun.",
  },
  "mr-before": {
    id: "mr-before",
    name: "Mr Before",
    locationId: "general-store",
    portrait: "/art/backwards-town/mr-before.png",
    blurb: "Answers questions moments before you ask them.",
  },
  "orra-vale": {
    id: "orra-vale",
    name: "Orra Vale",
    locationId: "observatory",
    portrait: "/art/adventure/orra-vale.png",
    blurb: "Brilliant, distracted Wayfinder watching the cracked moon.",
  },
};

export const locations: Record<string, LocationDefinition> = {
  home: {
    id: "home",
    name: "Wayfinder Tower Room",
    realmId: "crossroads",
    backgroundAsset: "/art/home/tower-room.png",
    description: "A small circular room inside an old Wayfinder tower.",
    hotspots: [
      { id: "bed", label: "Bed", x: 18, y: 62, action: "bed" },
      { id: "companion-bed", label: "Companion nest", x: 32, y: 70, href: "/companion-profile" },
      { id: "shelf", label: "Shelf", x: 72, y: 40, href: "/inventory" },
      { id: "wardrobe", label: "Wardrobe", x: 82, y: 55, action: "wardrobe" },
      { id: "window", label: "Window", x: 55, y: 28, action: "window" },
      { id: "journal", label: "Journal", x: 40, y: 48, href: "/journal" },
      { id: "map-table", label: "Map table", x: 58, y: 58, href: "/map" },
      { id: "locked-door", label: "Locked door", x: 10, y: 45, action: "locked-door" },
      { id: "chest", label: "Travel chest", x: 78, y: 72, href: "/inventory" },
      { id: "notice", label: "Notice board", x: 28, y: 36, action: "notice" },
    ],
    ambientAnimations: [{ id: "lamp", kind: "pulse", x: 48, y: 22 }],
    worldStateVariants: {
      crackedMoon: {
        overlays: ["/art/home/window-cracked-moon.png"],
        note: "The valley moon shows a faint crack.",
      },
    },
  },
  "backwards-town": {
    id: "backwards-town",
    name: "Backwards Town",
    realmId: "backwards",
    backgroundAsset: "/art/backwards-town/town-square-base.png",
    description: "Warm, strange, funny, slightly impossible.",
    hotspots: [
      { id: "bakery", label: "Yesterday's Bakery", x: 22, y: 48, href: "/places/backwards-town/bakery" },
      { id: "wheel", label: "Wheel of Before", x: 48, y: 55, href: "/places/backwards-town/wheel" },
      { id: "store", label: "General Store", x: 70, y: 46, href: "/places/backwards-town/general-store" },
      { id: "arcade", label: "Rewind Arcade", x: 82, y: 62, href: "/places/backwards-town/arcade" },
      { id: "clock", label: "Town Clock", x: 50, y: 28, action: "clock" },
      { id: "mailbox", label: "Crooked Mailbox", x: 35, y: 68, action: "mailbox" },
      { id: "fountain", label: "Fountain", x: 55, y: 70, action: "fountain" },
      { id: "alley", label: "Alleyway", x: 12, y: 60, action: "alley" },
      { id: "map", label: "Return to Map", x: 8, y: 88, href: "/map", showLabel: true },
    ],
    ambientAnimations: [
      { id: "smoke", kind: "drift", x: 30, y: 20 },
      { id: "fountain", kind: "pulse", x: 55, y: 70 },
    ],
    worldStateVariants: {
      crackedMoon: {
        overlays: ["/art/backwards-town/sky-cracked-moon.png"],
      },
    },
  },
  bakery: {
    id: "bakery",
    name: "Yesterday's Bakery",
    realmId: "backwards",
    backgroundAsset: "/art/backwards-town/bakery-interior.png",
    description: "Cakes arrive finished before their ingredients are ordered.",
    hotspots: [
      { id: "mara", label: "Mara Crumb", x: 45, y: 50, action: "talk-mara" },
      { id: "daily", label: "Daily parcel", x: 70, y: 60, action: "daily" },
      { id: "back", label: "Back to town", x: 10, y: 88, href: "/places/backwards-town" },
    ],
    ambientAnimations: [{ id: "steam", kind: "drift", x: 60, y: 30 }],
  },
  wheel: {
    id: "wheel",
    name: "Wheel of Before",
    realmId: "backwards",
    backgroundAsset: "/art/backwards-town/wheel-room.png",
    description: "A polished prize wheel that may have already been spun.",
    hotspots: [
      { id: "tock", label: "Tock", x: 25, y: 55, action: "talk-tock" },
      { id: "spin", label: "The Wheel", x: 55, y: 50, action: "spin" },
      { id: "back", label: "Back to town", x: 10, y: 88, href: "/places/backwards-town" },
    ],
    ambientAnimations: [{ id: "tick", kind: "pulse", x: 55, y: 50 }],
  },
  "general-store": {
    id: "general-store",
    name: "General Store of Things You Nearly Needed",
    realmId: "backwards",
    backgroundAsset: "/art/backwards-town/general-store.png",
    description: "Shelves lean toward answers you have not asked.",
    hotspots: [
      { id: "shopkeeper", label: "Mr Before", x: 40, y: 45, action: "talk-before" },
      { id: "back", label: "Back to town", x: 10, y: 88, href: "/places/backwards-town" },
    ],
    ambientAnimations: [],
  },
  arcade: {
    id: "arcade",
    name: "Rewind Arcade",
    realmId: "backwards",
    backgroundAsset: "/art/backwards-town/arcade-hall.png",
    description: "A crooked old theatre full of dreaming cabinets.",
    hotspots: [
      { id: "rewind-runner", label: "Rewind Runner", x: 50, y: 55, href: "/games/rewind-runner" },
      { id: "dreaming", label: "Dreaming cabinet", x: 25, y: 50, action: "dreaming" },
      { id: "tuesday", label: "Cabinet without Tuesday", x: 75, y: 52, action: "tuesday" },
      { id: "back", label: "Back to town", x: 10, y: 88, href: "/places/backwards-town" },
    ],
    ambientAnimations: [{ id: "neon", kind: "pulse", x: 50, y: 30 }],
  },
  observatory: {
    id: "observatory",
    name: "Crossroads Observatory",
    realmId: "crossroads",
    backgroundAsset: "/art/adventure/observatory.png",
    description: "An ancient observatory where the sky feels closer.",
    hotspots: [
      { id: "orra", label: "Orra Vale", x: 42, y: 55, action: "talk-orra" },
      { id: "telescope", label: "Telescope", x: 65, y: 40, action: "telescope" },
      { id: "begin", label: "Begin Moonfall", x: 50, y: 78, href: "/adventure/moonfall-prologue" },
      { id: "home", label: "Return Home", x: 12, y: 88, href: "/home" },
    ],
    ambientAnimations: [{ id: "stars", kind: "drift", x: 70, y: 20 }],
  },
};

export const shops: ShopDefinition[] = [
  {
    id: "nearly-needed",
    locationId: "general-store",
    npcId: "mr-before",
    itemIds: [
      "small-lantern",
      "crooked-rug",
      "button-jar",
      "companion-snack",
      "town-poster",
      "clockwork-hat",
      "empty-map-frame",
    ],
  },
];

export const bakeryDailyTable: DailyTableEntry[] = [
  { itemId: "yesterdays-bun", weight: 35 },
  { itemId: "pocket-crumb", weight: 25 },
  { itemId: "jam-unopened", weight: 20 },
  { itemId: "backwards-biscuit", weight: 15 },
  { itemId: "empty-pie-recipe", weight: 5 },
];

export const wheelPrizes: WheelPrize[] = [
  { id: "c10", label: "10 coins", weight: 22, coins: 10 },
  { id: "c25", label: "25 coins", weight: 18, coins: 25 },
  { id: "c50", label: "50 coins", weight: 10, coins: 50 },
  { id: "biscuit", label: "Backwards Biscuit", weight: 16, itemId: "backwards-biscuit" },
  { id: "hand", label: "Clock Hand", weight: 12, itemId: "clock-hand" },
  { id: "nothing", label: "Nothing (amusingly)", weight: 12, funnyOnly: true },
  { id: "token", label: "Rewind Token", weight: 7, itemId: "rewind-token" },
  { id: "tomorrow", label: "Tiny Tomorrow", weight: 3, itemId: "tiny-tomorrow" },
];

export const quests: QuestDefinition[] = [
  {
    id: "bakery-loaf",
    name: "The Unbaked Loaf",
    kind: "cosy",
    stages: ["intro", "sort", "done"],
    startLocationId: "bakery",
  },
  {
    id: "moonfall-prologue",
    name: "Moonfall Prologue",
    kind: "adventure",
    stages: ["observatory", "explore", "creature", "fragment", "return", "done"],
    startLocationId: "observatory",
  },
];

export const moonfallEvent: EventDefinition = {
  id: "moonfall",
  name: "Moonfall",
  status: "Prologue",
  stage: "A crack has appeared",
  countdownLabel: "When the sky is ready",
  communityProgress: 12,
  cosyContribution: "Lanterns lit · parcels shared",
  adventureContribution: "Fragments found · paths walked",
  recentChange: "A cracked moon can now be seen from cosy skies.",
};

export const journalEntries: JournalEntry[] = [
  {
    id: "mara-crumb",
    section: "People",
    title: "Mara Crumb",
    body: "Mara said goodbye when I arrived. Nobody else seemed to think that was strange.",
    unlockOn: "mara-crumb",
  },
  {
    id: "orra-vale",
    section: "People",
    title: "Orra Vale",
    body: "Orra looks at the sky like it owes her an explanation.",
    unlockOn: "orra-vale",
  },
  {
    id: "backwards-town",
    section: "Places",
    title: "Backwards Town",
    body: "Clocks run the wrong way and people still manage to bake.",
    unlockOn: "backwards-town",
  },
  {
    id: "crossroads",
    section: "Places",
    title: "The Crossroads",
    body: "Home sits where paths remember each other.",
    unlockOn: "crossroads",
  },
  {
    id: "yesterdays-bakery",
    section: "Places",
    title: "Yesterday's Bakery",
    body: "The bun was baked tomorrow. It tasted like now.",
    unlockOn: "yesterdays-bakery",
  },
  {
    id: "moonfall",
    section: "Events",
    title: "Moonfall",
    body: "Something cracked the moon from inside. The sky has not finished reacting.",
    unlockOn: "moonfall",
  },
  {
    id: "moon-fragment",
    section: "Strange Things",
    title: "Moon Fragment",
    body: "Cold light. A memory of an eye opening. Then nothing.",
    unlockOn: "moon-fragment",
  },
  {
    id: "companion-spriggle",
    section: "People",
    title: "Spriggle",
    body: "My sprout-headed friend keeps checking my pockets for buttons.",
    unlockOn: "companion-spriggle",
  },
  {
    id: "companion-glim",
    section: "People",
    title: "Glim",
    body: "Glim hums at lanterns until they hum back.",
    unlockOn: "companion-glim",
  },
  {
    id: "companion-pebbit",
    section: "People",
    title: "Pebbit",
    body: "Pebbit fell asleep on the warm map table. Twice.",
    unlockOn: "companion-pebbit",
  },
];

export const mapRealms = [
  {
    id: "crossroads",
    name: "The Crossroads",
    status: "open" as const,
    href: "/home",
    x: 50,
    y: 55,
    blurb: "Your tower and the paths between.",
  },
  {
    id: "backwards",
    name: "Backwards Town",
    status: "open" as const,
    href: "/places/backwards-town",
    x: 28,
    y: 48,
    blurb: "Warm streets that refuse to agree on time.",
  },
  {
    id: "rusted-moon",
    name: "The Rusted Moon",
    status: "locked" as const,
    x: 72,
    y: 30,
    blurb: "The path exists, but it has not noticed you yet.",
  },
  {
    id: "upside-ocean",
    name: "The Upside-Down Ocean",
    status: "locked" as const,
    x: 78,
    y: 62,
    blurb: "Waves hang like curtains. Not for today.",
  },
  {
    id: "library",
    name: "The Library of Unwritten Things",
    status: "locked" as const,
    x: 40,
    y: 28,
    blurb: "Shelves rearrange when unread.",
  },
  {
    id: "giants-garden",
    name: "The Giant's Garden",
    status: "locked" as const,
    x: 18,
    y: 70,
    blurb: "A bootprint large enough to picnic in.",
  },
  {
    id: "quiet-planet",
    name: "The Quiet Planet",
    status: "locked" as const,
    x: 62,
    y: 78,
    blurb: "Listening carefully. Not ready to reply.",
  },
  {
    id: "black-sun",
    name: "The Black Sun Carnival",
    status: "special" as const,
    x: 85,
    y: 45,
    blurb: "Appears when it chooses.",
  },
];
