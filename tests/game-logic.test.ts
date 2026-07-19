import { describe, expect, it } from "vitest";
import {
  addInventoryQuantity,
  arcadeCoinReward,
  canClaimDaily,
  canSpinWheel,
  chooseWheelPrize,
  dialogueForAge,
  localDayKey,
  moonfallAltersWorld,
  placeDecoration,
  purchaseItem,
  shouldGrantCourierCap,
} from "../src/lib/game/logic";

describe("daily claim", () => {
  it("allows once per day", () => {
    const day = localDayKey();
    expect(canClaimDaily({}, "bakery-daily", day)).toBe(true);
    expect(canClaimDaily({ "bakery-daily": day }, "bakery-daily", day)).toBe(false);
  });
});

describe("wheel", () => {
  it("allows one spin per day", () => {
    const day = localDayKey();
    expect(canSpinWheel({}, "wheel", day)).toBe(true);
    expect(canSpinWheel({ wheel: day }, "wheel", day)).toBe(false);
  });

  it("chooses prize before animation with stable index", () => {
    const prizes = [
      { id: "a", label: "A", weight: 1, coins: 10 },
      { id: "b", label: "B", weight: 0, coins: 20 },
    ];
    const { prize, index } = chooseWheelPrize(prizes, () => 0);
    expect(prize.id).toBe("a");
    expect(index).toBe(0);
  });
});

describe("shop & inventory", () => {
  it("deducts coins on purchase", () => {
    expect(purchaseItem(40, 20)).toEqual({ ok: true, coins: 20 });
    expect(purchaseItem(10, 20)).toEqual({ ok: false, reason: "insufficient" });
  });

  it("updates quantities", () => {
    const inv = addInventoryQuantity([{ itemId: "bun", quantity: 1 }], "bun", 2);
    expect(inv.find((e) => e.itemId === "bun")?.quantity).toBe(3);
  });
});

describe("arcade rewards", () => {
  it("caps coins", () => {
    expect(arcadeCoinReward(10000, false)).toBeLessThanOrEqual(55);
    expect(arcadeCoinReward(100, true)).toBeLessThanOrEqual(40);
  });

  it("grants courier cap at milestone once", () => {
    expect(shouldGrantCourierCap(200, false)).toBe(true);
    expect(shouldGrantCourierCap(200, true)).toBe(false);
    expect(shouldGrantCourierCap(100, false)).toBe(false);
  });
});

describe("dialogue age variants", () => {
  it("selects bracket line", () => {
    const line = dialogueForAge(
      {
        "6-8": "simple",
        "9-12": "mid",
        "13-16": "older",
        default: "fallback",
      },
      "6-8",
    );
    expect(line).toBe("simple");
  });
});

describe("home decoration & event", () => {
  it("persists unique placements", () => {
    expect(placeDecoration(["a"], "b")).toEqual(["a", "b"]);
    expect(placeDecoration(["a"], "a")).toEqual(["a"]);
  });

  it("detects cracked moon world flag", () => {
    expect(moonfallAltersWorld({ crackedMoonVisible: true })).toBe(true);
    expect(moonfallAltersWorld({})).toBe(false);
  });
});
