"use client";

import { useState } from "react";
import { locations, shops, npcs } from "@/content/world";
import { items } from "@/content/items";
import { useWorldStore } from "@/lib/store/world-store";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";

export default function GeneralStorePage() {
  const profile = useWorldStore((s) => s.save.profile);
  const buyItem = useWorldStore((s) => s.buyItem);
  const shop = shops[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const item = selected ? items[selected] : null;

  return (
    <PageShell
      title="General Store"
      subtitle={npcs["mr-before"].blurb}
      backHref="/places/backwards-town"
    >
      <LayeredScene
        location={locations["general-store"]}
        onHotspot={(h) => {
          if (h.action === "talk-before") {
            setMsg("Mr Before: You're wondering about the lantern. Yes — twenty coins.");
          }
        }}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shop.itemIds.map((id) => {
          const it = items[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className="rounded-2xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-3 text-left shadow-sm transition hover:shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.icon} alt="" className="mb-2 h-16 w-16" />
              <p className="font-display text-lg">{it.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">✦ {it.price}</p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-[var(--ink-soft)]">Your coins: ✦ {profile?.coins ?? 0}</p>

      <IllustratedModal open={!!item} title={item?.name ?? ""} onClose={() => setSelected(null)}>
        {item && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.icon} alt="" className="mb-3 h-20 w-20" />
            <p className="mb-2 text-sm">{item.description}</p>
            <p className="mb-4 text-sm">Price: ✦ {item.price}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                const res = buyItem(item.id, item.price ?? 0, "general-store");
                if (!res.ok) setMsg("Mr Before: You will notice that shortly — insufficient coins.");
                else {
                  setMsg(`Purchased ${item.name}.`);
                  setSelected(null);
                }
              }}
            >
              Buy
            </button>
          </>
        )}
      </IllustratedModal>
      <IllustratedModal open={!!msg} title="Store" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
