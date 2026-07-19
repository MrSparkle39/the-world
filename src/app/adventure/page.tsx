"use client";

import Link from "next/link";
import { locations, moonfallEvent, npcs } from "@/content/world";
import { useWorldStore } from "@/lib/store/world-store";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { PageShell } from "@/components/ui/primitives";
import { useState } from "react";
import { IllustratedModal } from "@/components/ui/primitives";

export default function AdventureHubPage() {
  const unlockJournal = useWorldStore((s) => s.unlockJournal);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <PageShell
      title="Adventure Mode"
      subtitle="Optional. Leave whenever you like — nobody will scold you."
      backHref="/home"
    >
      <div className="mb-4 rounded-2xl border border-[var(--title)]/20 bg-[rgba(255,248,235,0.92)] p-4">
        <p className="font-display text-xl text-[var(--title)]">{moonfallEvent.name}</p>
        <p className="text-sm">Status: {moonfallEvent.status}</p>
        <p className="text-sm">{moonfallEvent.countdownLabel}</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--cream-edge)]">
          <div
            className="h-full bg-[var(--title)]"
            style={{ width: `${moonfallEvent.communityProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--ink-soft)]">
          Cosy: {moonfallEvent.cosyContribution} · Adventure: {moonfallEvent.adventureContribution}
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--ink-soft)]">
            Dev note: community totals are simulated content data
          </p>
        )}
      </div>

      <LayeredScene
        location={locations.observatory}
        onHotspot={(h) => {
          if (h.action === "talk-orra") {
            unlockJournal("orra-vale");
            setMsg("Orra: The moon cracked from inside. Look through the telescope when you are ready.");
          }
          if (h.action === "telescope") {
            setMsg("Through the glass, a silver crack widens — slowly, like a held breath.");
          }
        }}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/adventure/moonfall-prologue"
          className="btn-primary text-center"
          onClick={() => unlockJournal("orra-vale")}
        >
          Begin the Moonfall Prologue
        </Link>
        <Link href="/home" className="btn-secondary text-center">
          Maybe another time
        </Link>
        <Link href="/home" className="btn-ghost text-center">
          Return Home
        </Link>
      </div>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{npcs["orra-vale"].blurb}</p>
      <IllustratedModal open={!!msg} title="Observatory" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
