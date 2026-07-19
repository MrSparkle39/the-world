"use client";

import { useEffect, useState } from "react";
import { locations } from "@/content/world";
import { useWorldStore } from "@/lib/store/world-store";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";
import type { HotspotDefinition } from "@/lib/types/content";

export default function BackwardsTownPage() {
  const visitLocation = useWorldStore((s) => s.visitLocation);
  const unlockJournal = useWorldStore((s) => s.unlockJournal);
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    visitLocation("backwards-town");
    unlockJournal("backwards-town");
  }, [visitLocation, unlockJournal]);

  function onHotspot(h: HotspotDefinition) {
    const messages: Record<string, string> = {
      clock: "The hands walk backwards. Somehow you still know when the bakery opens.",
      mailbox: "A letter arrives empty. The reply is already inside.",
      fountain: "Water splashes upward and apologises.",
      alley: "Footsteps approach from ahead of you.",
    };
    if (h.action && messages[h.action]) {
      setModal({ title: h.label, body: messages[h.action] });
    }
  }

  return (
    <PageShell
      title="Backwards Town"
      subtitle="Goodbye! You must be new here."
      backHref="/map"
    >
      <p className="mb-3 rounded-2xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.9)] px-4 py-2 text-sm">
        Town sign (readable): Backwards Town — arrow points away on purpose.
      </p>
      <LayeredScene location={locations["backwards-town"]} onHotspot={onHotspot} />
      <IllustratedModal open={!!modal} title={modal?.title ?? ""} onClose={() => setModal(null)}>
        <p>{modal?.body}</p>
      </IllustratedModal>
    </PageShell>
  );
}
