import { z } from "zod";

export const AgeBracketSchema = z.enum(["6-8", "9-12", "13-16"]);
export type AgeBracket = z.infer<typeof AgeBracketSchema>;

export const ExplorerStyleSchema = z.enum([
  "ember-trail",
  "moss-path",
  "sky-thread",
  "stone-song",
]);
export type ExplorerStyle = z.infer<typeof ExplorerStyleSchema>;

export const PlayerProfileSchema = z.object({
  id: z.string(),
  explorerName: z.string().min(1).max(24),
  ageBracket: AgeBracketSchema,
  explorerStyle: ExplorerStyleSchema,
  companionId: z.string().nullable(),
  coins: z.number().int().nonnegative(),
  starlight: z.number().int().nonnegative(),
  createdAt: z.string(),
  lastVisitedAt: z.string(),
});
export type PlayerProfile = z.infer<typeof PlayerProfileSchema>;

export const InventoryEntrySchema = z.object({
  itemId: z.string(),
  quantity: z.number().int().positive(),
  acquiredAt: z.string(),
  source: z.string(),
  favourite: z.boolean().optional(),
});
export type InventoryEntry = z.infer<typeof InventoryEntrySchema>;

export const QuestStateSchema = z.object({
  questId: z.string(),
  stage: z.string(),
  status: z.enum(["locked", "available", "active", "completed"]),
  flags: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  updatedAt: z.string(),
});
export type QuestState = z.infer<typeof QuestStateSchema> & {
  flags: Record<string, string | number | boolean>;
};

export const PlayerProgressSchema = z.object({
  completedOnboarding: z.boolean(),
  visitedLocations: z.array(z.string()),
  collectedDailies: z.record(z.string(), z.string()),
  wheelSpins: z.record(z.string(), z.string()),
  questStates: z.record(z.string(), QuestStateSchema),
  arcadeHighScores: z.record(z.string(), z.number()),
  arcadeRewardsClaimed: z.record(z.string(), z.boolean()).optional(),
  discoveredSecrets: z.array(z.string()),
  worldFlags: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  placedDecorations: z.array(z.string()).optional(),
  wornItems: z.array(z.string()).optional(),
  journalUnlocks: z.array(z.string()).optional(),
  lockedDoorClicks: z.number().int().nonnegative().optional(),
  bakeryQuestDone: z.boolean().optional(),
});
export type PlayerProgress = {
  completedOnboarding: boolean;
  visitedLocations: string[];
  collectedDailies: Record<string, string>;
  wheelSpins: Record<string, string>;
  questStates: Record<string, QuestState>;
  arcadeHighScores: Record<string, number>;
  arcadeRewardsClaimed: Record<string, boolean>;
  discoveredSecrets: string[];
  worldFlags: Record<string, string | number | boolean>;
  placedDecorations: string[];
  wornItems: string[];
  journalUnlocks: string[];
  lockedDoorClicks: number;
  bakeryQuestDone: boolean;
};

export const SettingsSchema = z.object({
  music: z.boolean(),
  sfx: z.boolean(),
  volume: z.number().min(0).max(1),
  motion: z.enum(["full", "gentle", "reduced"]),
  textSize: z.enum(["standard", "large"]),
  highContrast: z.boolean(),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const PlayerSaveSchema = z.object({
  profile: PlayerProfileSchema.nullable(),
  inventory: z.array(InventoryEntrySchema),
  progress: PlayerProgressSchema,
  settings: SettingsSchema,
  version: z.literal(1),
});
export type PlayerSave = {
  profile: PlayerProfile | null;
  inventory: InventoryEntry[];
  progress: PlayerProgress;
  settings: Settings;
  version: 1;
};

export function createDefaultProgress(): PlayerProgress {
  return {
    completedOnboarding: false,
    visitedLocations: [],
    collectedDailies: {},
    wheelSpins: {},
    questStates: {},
    arcadeHighScores: {},
    arcadeRewardsClaimed: {},
    discoveredSecrets: [],
    worldFlags: {},
    placedDecorations: [],
    wornItems: [],
    journalUnlocks: [],
    lockedDoorClicks: 0,
    bakeryQuestDone: false,
  };
}

export function createDefaultSettings(): Settings {
  return {
    music: true,
    sfx: true,
    volume: 0.7,
    motion: "full",
    textSize: "standard",
    highContrast: false,
  };
}

export function createEmptySave(): PlayerSave {
  return {
    profile: null,
    inventory: [],
    progress: createDefaultProgress(),
    settings: createDefaultSettings(),
    version: 1,
  };
}
