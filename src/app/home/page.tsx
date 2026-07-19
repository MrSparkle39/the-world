"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { locations } from "@/content/world";
import { getExplorer } from "@/content/explorers";
import { getCompanion } from "@/content/companions";
import { items } from "@/content/items";
import { useWorldStore } from "@/lib/store/world-store";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";
import type { HotspotDefinition } from "@/lib/types/content";

export default function HomeRoomPage() {
  const router = useRouter();
  const profile = useWorldStore((s) => s.save.profile);
  const progress = useWorldStore((s) => s.save.progress);
  const visitLocation = useWorldStore((s) => s.visitLocation);
  const bumpLockedDoor = useWorldStore((s) => s.bumpLockedDoor);
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    if (!profile?.companionId) router.replace("/start");
    else visitLocation("home");
  }, [profile, router, visitLocation]);

  if (!profile?.companionId) return null;

  const explorer = getExplorer(profile.explorerStyle);
  const companion = getCompanion(profile.companionId);
  const cracked = !!progress.worldFlags.crackedMoonVisible;
  const questReward = progress.questStates["moonfall-prologue"]?.status === "completed";

  function onHotspot(h: HotspotDefinition) {
    if (h.action === "bed") {
      setModal({ title: "Bed", body: "Not tired yet. There are still paths you have not seen." });
    } else if (h.action === "wardrobe") {
      const worn = progress.wornItems.map((id) => items[id]?.name ?? id).join(", ") || "Nothing special yet.";
      setModal({
        title: "Wardrobe",
        body: `${explorer.name} look ready. Worn: ${worn} Customisation arrives later.`,
      });
    } else if (h.action === "window") {
      setModal({
        title: "Window",
        body: cracked
          ? "The valley looks the same — except the moon carries a quiet crack."
          : "The valley breathes. Paths wait.",
      });
    } else if (h.action === "locked-door") {
      const n = bumpLockedDoor();
      setModal({
        title: "Locked door",
        body:
          n < 3
            ? "There is no handle on this side."
            : n < 6
              ? "Still no handle. The wood sounds… less certain."
              : "A softer knock answers you. It still will not open.",
      });
    } else if (h.action === "notice") {
      setModal({
        title: "Notice board",
        body: cracked
          ? "Someone pinned a sketch of a cracked moon. No signature."
          : "Welcome, Wayfinder. The Between is listening.",
      });
    }
  }

  return (
    <PageShell
      title={`${profile.explorerName}'s room`}
      subtitle={companion ? `${companion.name} settles nearby.` : undefined}
    >
      <LayeredScene location={locations.home} onHotspot={onHotspot}>
        {progress.placedDecorations.includes("small-lantern") && (
          <div className="pointer-events-none absolute left-[48%] top-[20%] h-8 w-8 rounded-full bg-[var(--gold)]/80 blur-[1px]" />
        )}
        {progress.placedDecorations.includes("crooked-rug") && (
          <div className="pointer-events-none absolute bottom-[12%] left-[40%] h-10 w-28 -rotate-6 rounded-[40%] bg-[#8b3a2f]/70" />
        )}
        {progress.placedDecorations.includes("town-poster") && (
          <div className="pointer-events-none absolute left-[26%] top-[30%] h-16 w-12 rounded bg-[#5f7a45]/80" />
        )}
        {questReward && (
          <div className="pointer-events-none absolute right-[18%] top-[35%] rounded-lg border border-[var(--gold)] bg-[rgba(255,248,235,0.85)] px-2 py-1 text-xs">
            Moon Fragment display
          </div>
        )}
      </LayeredScene>
      <IllustratedModal
        open={!!modal}
        title={modal?.title ?? ""}
        onClose={() => setModal(null)}
      >
        <p>{modal?.body}</p>
      </IllustratedModal>
    </PageShell>
  );
}
