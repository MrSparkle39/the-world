/** Pure game logic — unit-testable without DOM */

export function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function canClaimDaily(
  collectedDailies: Record<string, string>,
  activityId: string,
  day = localDayKey(),
): boolean {
  return collectedDailies[activityId] !== day;
}

export function canSpinWheel(
  wheelSpins: Record<string, string>,
  wheelId: string,
  day = localDayKey(),
): boolean {
  return wheelSpins[wheelId] !== day;
}

export type Weighted<T extends { weight: number }> = T;

export function pickWeighted<T extends { weight: number }>(
  entries: T[],
  random = Math.random,
): T {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1];
}

export function purchaseItem(
  coins: number,
  price: number,
): { ok: true; coins: number } | { ok: false; reason: "insufficient" } {
  if (coins < price) return { ok: false, reason: "insufficient" };
  return { ok: true, coins: coins - price };
}

export function addInventoryQuantity(
  inventory: { itemId: string; quantity: number }[],
  itemId: string,
  quantity: number,
) {
  const next = inventory.map((e) => ({ ...e }));
  const existing = next.find((e) => e.itemId === itemId);
  if (existing) existing.quantity += quantity;
  else next.push({ itemId, quantity });
  return next;
}

/** Cap arcade coin rewards to prevent score farming */
export function arcadeCoinReward(score: number, alreadyClaimedToday: boolean): number {
  const base = Math.min(40, Math.floor(score / 50));
  const firstBonus = alreadyClaimedToday ? 0 : 15;
  return Math.min(55, base + firstBonus);
}

export function shouldGrantCourierCap(score: number, alreadyOwned: boolean): boolean {
  return !alreadyOwned && score >= 200;
}

export function dialogueForAge(
  variants: Record<"6-8" | "9-12" | "13-16" | "default", string>,
  age: "6-8" | "9-12" | "13-16",
): string {
  return variants[age] ?? variants.default;
}

export function placeDecoration(
  placed: string[],
  itemId: string,
): string[] {
  if (placed.includes(itemId)) return placed;
  return [...placed, itemId];
}

export type WheelPrizeDef = {
  id: string;
  label: string;
  weight: number;
  coins?: number;
  itemId?: string;
  funnyOnly?: boolean;
};

/** Choose prize before animation; index must match visual segment */
export function chooseWheelPrize(
  prizes: WheelPrizeDef[],
  random = Math.random,
): { prize: WheelPrizeDef; index: number } {
  const prize = pickWeighted(prizes, random);
  const index = prizes.findIndex((p) => p.id === prize.id);
  return { prize, index: index < 0 ? 0 : index };
}

export function moonfallAltersWorld(worldFlags: Record<string, string | number | boolean>) {
  return worldFlags.moonfallPrologueComplete === true || worldFlags.crackedMoonVisible === true;
}
