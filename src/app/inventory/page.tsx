"use client";

import { useMemo, useState } from "react";
import { items } from "@/content/items";
import { useWorldStore } from "@/lib/store/world-store";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";
import type { ItemCategory } from "@/lib/types/content";

const CATS: ItemCategory[] = ["Food", "Clothing", "Home", "Quest", "Curiosities"];

export default function InventoryPage() {
  const inventory = useWorldStore((s) => s.save.inventory);
  const eatFood = useWorldStore((s) => s.eatFood);
  const placeHomeDecoration = useWorldStore((s) => s.placeHomeDecoration);
  const wearItem = useWorldStore((s) => s.wearItem);
  const toggleFavourite = useWorldStore((s) => s.toggleFavourite);
  const [cat, setCat] = useState<ItemCategory | "All">("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const list = useMemo(() => {
    return inventory
      .map((e) => ({ entry: e, def: items[e.itemId] }))
      .filter((x) => x.def && (cat === "All" || x.def.category === cat));
  }, [inventory, cat]);

  const def = selected ? items[selected] : null;

  return (
    <PageShell title="Satchel" subtitle="Things you nearly needed — and kept." backHref="/home">
      <div className="mb-3 flex flex-wrap gap-2">
        {(["All", ...CATS] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={cat === c ? "btn-primary" : "btn-secondary"}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ entry, def: d }) => (
          <button
            key={entry.itemId}
            type="button"
            className="rounded-2xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-3 text-left"
            onClick={() => setSelected(entry.itemId)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.icon} alt="" className="mb-2 h-14 w-14" />
            <p className="font-display text-lg">
              {d.name} {entry.favourite ? "★" : ""}
            </p>
            <p className="text-xs text-[var(--ink-soft)]">
              ×{entry.quantity} · {d.rarity}
            </p>
          </button>
        ))}
        {list.length === 0 && <p className="text-[var(--ink-soft)]">Empty pocket, full path ahead.</p>}
      </div>

      <IllustratedModal open={!!def} title={def?.name ?? ""} onClose={() => setSelected(null)}>
        {def && selected && (
          <>
            <p className="mb-2 text-sm">{def.description}</p>
            <p className="mb-3 text-xs text-[var(--ink-soft)]">Source recorded quietly.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={() => toggleFavourite(selected)}>
                Favourite
              </button>
              {def.actionable === "eat" && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const r = eatFood(selected);
                    setMsg(r.ok ? `Shared ${def.name}.` : "None left.");
                    setSelected(null);
                  }}
                >
                  Eat / share
                </button>
              )}
              {def.actionable === "place" && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    placeHomeDecoration(selected);
                    setMsg(`${def.name} placed in your room.`);
                    setSelected(null);
                  }}
                >
                  Place at home
                </button>
              )}
              {def.actionable === "wear" && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    wearItem(selected);
                    setMsg(`${def.name} added to wardrobe.`);
                    setSelected(null);
                  }}
                >
                  Wear
                </button>
              )}
            </div>
          </>
        )}
      </IllustratedModal>
      <IllustratedModal open={!!msg} title="Satchel" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
