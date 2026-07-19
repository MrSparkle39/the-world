"use client";

import { create } from "zustand";
import {
  createEmptySave,
  createDefaultProgress,
  type InventoryEntry,
  type PlayerProfile,
  type PlayerProgress,
  type PlayerSave,
  type Settings,
} from "@/lib/types/player";
import { LocalPlayerRepository } from "@/lib/repos";
import {
  addInventoryQuantity,
  arcadeCoinReward,
  canClaimDaily,
  canSpinWheel,
  chooseWheelPrize,
  localDayKey,
  placeDecoration,
  purchaseItem,
  shouldGrantCourierCap,
  type WheelPrizeDef,
} from "@/lib/game/logic";

const repo = new LocalPlayerRepository();

type WorldStore = {
  hydrated: boolean;
  save: PlayerSave;
  hydrate: () => void;
  persist: () => void;
  resetProfile: () => void;
  createExplorer: (input: {
    explorerName: string;
    ageBracket: PlayerProfile["ageBracket"];
    explorerStyle: PlayerProfile["explorerStyle"];
  }) => void;
  chooseCompanion: (companionId: string) => void;
  visitLocation: (locationId: string) => void;
  unlockJournal: (entryId: string) => void;
  addCoins: (amount: number) => void;
  addItem: (itemId: string, qty: number, source: string) => void;
  buyItem: (itemId: string, price: number, source: string) => { ok: boolean; reason?: string };
  claimDaily: (
    activityId: string,
    itemId: string,
  ) => { ok: boolean; reason?: string };
  spinWheel: (
    wheelId: string,
    prizes: WheelPrizeDef[],
  ) =>
    | { ok: true; prize: WheelPrizeDef; index: number }
    | { ok: false; reason: string };
  setQuestStage: (
    questId: string,
    stage: string,
    status: "locked" | "available" | "active" | "completed",
    flags?: Record<string, string | number | boolean>,
  ) => void;
  setWorldFlag: (key: string, value: string | number | boolean) => void;
  completeBakeryQuest: () => void;
  recordArcadeRun: (
    gameId: string,
    score: number,
  ) => { coins: number; grantedCap: boolean; highScore: number };
  placeHomeDecoration: (itemId: string) => void;
  wearItem: (itemId: string) => void;
  toggleFavourite: (itemId: string) => void;
  bumpLockedDoor: () => number;
  updateSettings: (partial: Partial<Settings>) => void;
  eatFood: (itemId: string) => { ok: boolean; reason?: string };
};

function stamp(progress: PlayerProgress): PlayerProgress {
  return { ...progress };
}

export const useWorldStore = create<WorldStore>((set, get) => ({
  hydrated: false,
  save: createEmptySave(),

  hydrate: () => {
    const save = repo.load();
    set({ save, hydrated: true });
  },

  persist: () => {
    repo.save(get().save);
  },

  resetProfile: () => {
    repo.reset();
    set({ save: createEmptySave(), hydrated: true });
  },

  createExplorer: ({ explorerName, ageBracket, explorerStyle }) => {
    const now = new Date().toISOString();
    const profile: PlayerProfile = {
      id: crypto.randomUUID(),
      explorerName: explorerName.trim().slice(0, 24),
      ageBracket,
      explorerStyle,
      companionId: null,
      coins: 15,
      starlight: 0,
      createdAt: now,
      lastVisitedAt: now,
    };
    const save: PlayerSave = {
      ...get().save,
      profile,
      progress: {
        ...createDefaultProgress(),
        journalUnlocks: ["crossroads"],
      },
    };
    repo.save(save);
    set({ save });
  },

  chooseCompanion: (companionId) => {
    const { save } = get();
    if (!save.profile) return;
    const next: PlayerSave = {
      ...save,
      profile: {
        ...save.profile,
        companionId,
        lastVisitedAt: new Date().toISOString(),
      },
      progress: {
        ...save.progress,
        completedOnboarding: true,
        visitedLocations: Array.from(
          new Set([...save.progress.visitedLocations, "home"]),
        ),
        journalUnlocks: Array.from(
          new Set([...save.progress.journalUnlocks, `companion-${companionId}`, "crossroads"]),
        ),
      },
    };
    repo.save(next);
    set({ save: next });
  },

  visitLocation: (locationId) => {
    const { save } = get();
    const next = {
      ...save,
      profile: save.profile
        ? { ...save.profile, lastVisitedAt: new Date().toISOString() }
        : null,
      progress: {
        ...save.progress,
        visitedLocations: Array.from(
          new Set([...save.progress.visitedLocations, locationId]),
        ),
      },
    };
    repo.save(next);
    set({ save: next });
  },

  unlockJournal: (entryId) => {
    const { save } = get();
    if (save.progress.journalUnlocks.includes(entryId)) return;
    const next = {
      ...save,
      progress: {
        ...save.progress,
        journalUnlocks: [...save.progress.journalUnlocks, entryId],
      },
    };
    repo.save(next);
    set({ save: next });
  },

  addCoins: (amount) => {
    const { save } = get();
    if (!save.profile) return;
    const next = {
      ...save,
      profile: { ...save.profile, coins: Math.max(0, save.profile.coins + amount) },
    };
    repo.save(next);
    set({ save: next });
  },

  addItem: (itemId, qty, source) => {
    const { save } = get();
    const inventory = addInventoryQuantity(save.inventory, itemId, qty).map((e) => {
      const prev = save.inventory.find((p) => p.itemId === e.itemId);
      return {
        itemId: e.itemId,
        quantity: e.quantity,
        acquiredAt: prev?.acquiredAt ?? new Date().toISOString(),
        source: prev?.source ?? source,
        favourite: prev?.favourite,
      } satisfies InventoryEntry;
    });
    // ensure new items get source
    const finalInv = inventory.map((e) =>
      e.itemId === itemId && !save.inventory.find((p) => p.itemId === itemId)
        ? { ...e, source, acquiredAt: new Date().toISOString() }
        : e,
    );
    const next = { ...save, inventory: finalInv };
    repo.save(next);
    set({ save: next });
  },

  buyItem: (itemId, price, source) => {
    const { save } = get();
    if (!save.profile) return { ok: false, reason: "no-profile" };
    const result = purchaseItem(save.profile.coins, price);
    if (!result.ok) return { ok: false, reason: "insufficient" };
    const inventory = [...save.inventory];
    const existing = inventory.find((e) => e.itemId === itemId);
    if (existing) existing.quantity += 1;
    else {
      inventory.push({
        itemId,
        quantity: 1,
        acquiredAt: new Date().toISOString(),
        source,
      });
    }
    const next = {
      ...save,
      profile: { ...save.profile, coins: result.coins },
      inventory,
    };
    repo.save(next);
    set({ save: next });
    return { ok: true };
  },

  claimDaily: (activityId, itemId) => {
    const { save } = get();
    const day = localDayKey();
    if (!canClaimDaily(save.progress.collectedDailies, activityId, day)) {
      return { ok: false, reason: "already-claimed" };
    }
    const inventory = [...save.inventory];
    const existing = inventory.find((e) => e.itemId === itemId);
    if (existing) existing.quantity += 1;
    else {
      inventory.push({
        itemId,
        quantity: 1,
        acquiredAt: new Date().toISOString(),
        source: activityId,
      });
    }
    const next = {
      ...save,
      inventory,
      progress: {
        ...save.progress,
        collectedDailies: { ...save.progress.collectedDailies, [activityId]: day },
      },
    };
    repo.save(next);
    set({ save: next });
    return { ok: true };
  },

  spinWheel: (wheelId, prizes) => {
    const { save } = get();
    if (!save.profile) return { ok: false, reason: "no-profile" };
    const day = localDayKey();
    if (!canSpinWheel(save.progress.wheelSpins, wheelId, day)) {
      return { ok: false, reason: "already-spun" };
    }
    const { prize, index } = chooseWheelPrize(prizes);
    let coins = save.profile.coins;
    const inventory = [...save.inventory];
    if (prize.coins) coins += prize.coins;
    if (prize.itemId) {
      const existing = inventory.find((e) => e.itemId === prize.itemId);
      if (existing) existing.quantity += 1;
      else {
        inventory.push({
          itemId: prize.itemId,
          quantity: 1,
          acquiredAt: new Date().toISOString(),
          source: wheelId,
        });
      }
    }
    const next = {
      ...save,
      profile: { ...save.profile, coins },
      inventory,
      progress: {
        ...save.progress,
        wheelSpins: { ...save.progress.wheelSpins, [wheelId]: day },
      },
    };
    repo.save(next);
    set({ save: next });
    return { ok: true, prize, index };
  },

  setQuestStage: (questId, stage, status, flags = {}) => {
    const { save } = get();
    const prev = save.progress.questStates[questId];
    const next = {
      ...save,
      progress: {
        ...stamp(save.progress),
        questStates: {
          ...save.progress.questStates,
          [questId]: {
            questId,
            stage,
            status,
            flags: { ...(prev?.flags ?? {}), ...flags },
            updatedAt: new Date().toISOString(),
          },
        },
      },
    };
    repo.save(next);
    set({ save: next });
  },

  setWorldFlag: (key, value) => {
    const { save } = get();
    const next = {
      ...save,
      progress: {
        ...save.progress,
        worldFlags: { ...save.progress.worldFlags, [key]: value },
      },
    };
    repo.save(next);
    set({ save: next });
  },

  completeBakeryQuest: () => {
    const { save } = get();
    if (!save.profile || save.progress.bakeryQuestDone) return;
    const inventory = [...save.inventory];
    const bun = inventory.find((e) => e.itemId === "yesterdays-bun");
    if (bun) bun.quantity += 1;
    else {
      inventory.push({
        itemId: "yesterdays-bun",
        quantity: 1,
        acquiredAt: new Date().toISOString(),
        source: "bakery-quest",
      });
    }
    const next = {
      ...save,
      profile: { ...save.profile, coins: save.profile.coins + 25 },
      inventory,
      progress: {
        ...save.progress,
        bakeryQuestDone: true,
        journalUnlocks: Array.from(
          new Set([
            ...save.progress.journalUnlocks,
            "mara-crumb",
            "yesterdays-bakery",
            "backwards-town",
          ]),
        ),
      },
    };
    repo.save(next);
    set({ save: next });
  },

  recordArcadeRun: (gameId, score) => {
    const { save } = get();
    if (!save.profile) return { coins: 0, grantedCap: false, highScore: 0 };
    const day = localDayKey();
    const dailyKey = `${gameId}-daily`;
    const alreadyClaimedToday = save.progress.collectedDailies[dailyKey] === day;
    const coins = arcadeCoinReward(score, alreadyClaimedToday);
    const prevHigh = save.progress.arcadeHighScores[gameId] ?? 0;
    const highScore = Math.max(prevHigh, score);
    const ownsCap = save.inventory.some((e) => e.itemId === "couriers-rewind-cap");
    const grantedCap = shouldGrantCourierCap(score, ownsCap);

    const inventory = [...save.inventory];
    if (grantedCap) {
      inventory.push({
        itemId: "couriers-rewind-cap",
        quantity: 1,
        acquiredAt: new Date().toISOString(),
        source: gameId,
      });
    }

    const next = {
      ...save,
      profile: { ...save.profile, coins: save.profile.coins + coins },
      inventory,
      progress: {
        ...save.progress,
        arcadeHighScores: { ...save.progress.arcadeHighScores, [gameId]: highScore },
        arcadeRewardsClaimed: {
          ...save.progress.arcadeRewardsClaimed,
          ...(grantedCap ? { "couriers-rewind-cap": true } : {}),
        },
        collectedDailies: {
          ...save.progress.collectedDailies,
          [dailyKey]: day,
        },
      },
    };
    repo.save(next);
    set({ save: next });
    return { coins, grantedCap, highScore };
  },

  placeHomeDecoration: (itemId) => {
    const { save } = get();
    const next = {
      ...save,
      progress: {
        ...save.progress,
        placedDecorations: placeDecoration(save.progress.placedDecorations, itemId),
      },
    };
    repo.save(next);
    set({ save: next });
  },

  wearItem: (itemId) => {
    const { save } = get();
    const worn = save.progress.wornItems.includes(itemId)
      ? save.progress.wornItems
      : [...save.progress.wornItems, itemId];
    const next = {
      ...save,
      progress: { ...save.progress, wornItems: worn },
    };
    repo.save(next);
    set({ save: next });
  },

  toggleFavourite: (itemId) => {
    const { save } = get();
    const inventory = save.inventory.map((e) =>
      e.itemId === itemId ? { ...e, favourite: !e.favourite } : e,
    );
    const next = { ...save, inventory };
    repo.save(next);
    set({ save: next });
  },

  bumpLockedDoor: () => {
    const { save } = get();
    const lockedDoorClicks = save.progress.lockedDoorClicks + 1;
    const next = {
      ...save,
      progress: { ...save.progress, lockedDoorClicks },
    };
    repo.save(next);
    set({ save: next });
    return lockedDoorClicks;
  },

  updateSettings: (partial) => {
    const { save } = get();
    const next = {
      ...save,
      settings: { ...save.settings, ...partial },
    };
    repo.save(next);
    set({ save: next });
  },

  eatFood: (itemId) => {
    const { save } = get();
    const entry = save.inventory.find((e) => e.itemId === itemId);
    if (!entry || entry.quantity < 1) return { ok: false, reason: "missing" };
    const inventory = save.inventory
      .map((e) =>
        e.itemId === itemId ? { ...e, quantity: e.quantity - 1 } : e,
      )
      .filter((e) => e.quantity > 0);
    const next = { ...save, inventory };
    repo.save(next);
    set({ save: next });
    return { ok: true };
  },
}));
