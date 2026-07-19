export type HotspotDefinition = {
  id: string;
  label: string;
  x: number; // percent
  y: number;
  w?: number;
  h?: number;
  href?: string;
  action?: string;
  showLabel?: boolean;
  requiresFlag?: string;
  hideWhenFlag?: string;
};

export type AmbientAnimationDefinition = {
  id: string;
  kind: "float" | "spin" | "pulse" | "drift" | "waterfall";
  x: number;
  y: number;
  asset?: string;
};

export type LocationVariant = {
  backgroundAsset?: string;
  overlays?: string[];
  note?: string;
};

export type LocationDefinition = {
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

export type ItemRarity = "common" | "uncommon" | "rare" | "legendary";
export type ItemCategory = "Food" | "Clothing" | "Home" | "Quest" | "Curiosities";

export type ItemDefinition = {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  icon: string;
  price?: number;
  actionable?: "eat" | "place" | "wear" | "inspect";
  tags?: string[];
};

export type CompanionDefinition = {
  id: string;
  name: string;
  description: string;
  ability: string;
  habit: string;
  idleAsset: string;
  colourHint: string;
};

export type ExplorerDefinition = {
  id: string;
  name: string;
  blurb: string;
  portrait: string;
  coat: string;
};

export type NpcDefinition = {
  id: string;
  name: string;
  locationId: string;
  portrait: string;
  blurb: string;
};

export type ShopDefinition = {
  id: string;
  locationId: string;
  npcId: string;
  itemIds: string[];
};

export type WheelPrize = {
  id: string;
  label: string;
  weight: number;
  coins?: number;
  itemId?: string;
  funnyOnly?: boolean;
};

export type DailyTableEntry = {
  itemId: string;
  weight: number;
};

export type QuestDefinition = {
  id: string;
  name: string;
  kind: "cosy" | "adventure";
  stages: string[];
  startLocationId: string;
};

export type EventDefinition = {
  id: string;
  name: string;
  status: string;
  stage: string;
  countdownLabel: string;
  communityProgress: number;
  cosyContribution: string;
  adventureContribution: string;
  recentChange: string;
};

export type JournalEntry = {
  id: string;
  section: "People" | "Places" | "Discoveries" | "Quests" | "Strange Things" | "Events";
  title: string;
  body: string;
  unlockOn: string;
};
