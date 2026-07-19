import {
  PlayerSave,
  PlayerSaveSchema,
  createEmptySave,
  type InventoryEntry,
  type PlayerProfile,
  type PlayerProgress,
  type Settings,
} from "@/lib/types/player";

const STORAGE_KEY = "the-world.player-save.v1";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export interface PlayerRepository {
  load(): PlayerSave;
  save(data: PlayerSave): void;
  reset(): void;
}

export class LocalPlayerRepository implements PlayerRepository {
  load(): PlayerSave {
    if (!canUseStorage()) return createEmptySave();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createEmptySave();
      const parsed = PlayerSaveSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) return createEmptySave();
      const data = parsed.data;
      return {
        ...data,
        progress: {
          ...createEmptySave().progress,
          ...data.progress,
          arcadeRewardsClaimed: data.progress.arcadeRewardsClaimed ?? {},
          placedDecorations: data.progress.placedDecorations ?? [],
          wornItems: data.progress.wornItems ?? [],
          journalUnlocks: data.progress.journalUnlocks ?? [],
          lockedDoorClicks: data.progress.lockedDoorClicks ?? 0,
          bakeryQuestDone: data.progress.bakeryQuestDone ?? false,
          questStates: Object.fromEntries(
            Object.entries(data.progress.questStates).map(([k, v]) => [
              k,
              { ...v, flags: v.flags ?? {} },
            ]),
          ),
        },
      };
    } catch {
      return createEmptySave();
    }
  }

  save(data: PlayerSave): void {
    if (!canUseStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  reset(): void {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export class InventoryRepository {
  constructor(private playerRepo: PlayerRepository) {}

  list(): InventoryEntry[] {
    return this.playerRepo.load().inventory;
  }

  add(itemId: string, quantity: number, source: string): InventoryEntry[] {
    const save = this.playerRepo.load();
    const existing = save.inventory.find((e) => e.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      save.inventory.push({
        itemId,
        quantity,
        acquiredAt: new Date().toISOString(),
        source,
      });
    }
    this.playerRepo.save(save);
    return save.inventory;
  }

  setFavourite(itemId: string, favourite: boolean): InventoryEntry[] {
    const save = this.playerRepo.load();
    const entry = save.inventory.find((e) => e.itemId === itemId);
    if (entry) entry.favourite = favourite;
    this.playerRepo.save(save);
    return save.inventory;
  }
}

export class QuestRepository {
  constructor(private playerRepo: PlayerRepository) {}

  getProgress(): PlayerProgress {
    return this.playerRepo.load().progress;
  }

  updateProgress(mutator: (p: PlayerProgress) => void): PlayerProgress {
    const save = this.playerRepo.load();
    mutator(save.progress);
    this.playerRepo.save(save);
    return save.progress;
  }
}

export class EventRepository {
  constructor(private playerRepo: PlayerRepository) {}

  getFlag(key: string) {
    return this.playerRepo.load().progress.worldFlags[key];
  }

  setFlag(key: string, value: string | number | boolean) {
    const save = this.playerRepo.load();
    save.progress.worldFlags[key] = value;
    this.playerRepo.save(save);
  }
}

export class GameRewardRepository {
  constructor(private playerRepo: PlayerRepository) {}

  recordScore(gameId: string, score: number): { highScore: number; isNew: boolean } {
    const save = this.playerRepo.load();
    const prev = save.progress.arcadeHighScores[gameId] ?? 0;
    const isNew = score > prev;
    if (isNew) save.progress.arcadeHighScores[gameId] = score;
    this.playerRepo.save(save);
    return { highScore: Math.max(prev, score), isNew };
  }
}

export class SettingsRepository {
  constructor(private playerRepo: PlayerRepository) {}

  get(): Settings {
    return this.playerRepo.load().settings;
  }

  set(next: Partial<Settings>): Settings {
    const save = this.playerRepo.load();
    save.settings = { ...save.settings, ...next };
    this.playerRepo.save(save);
    return save.settings;
  }
}

export function createRepositories() {
  const player = new LocalPlayerRepository();
  return {
    player,
    inventory: new InventoryRepository(player),
    quest: new QuestRepository(player),
    event: new EventRepository(player),
    gameReward: new GameRewardRepository(player),
    settings: new SettingsRepository(player),
  };
}

export type Repositories = ReturnType<typeof createRepositories>;

export function touchProfile(profile: PlayerProfile): PlayerProfile {
  return { ...profile, lastVisitedAt: new Date().toISOString() };
}
