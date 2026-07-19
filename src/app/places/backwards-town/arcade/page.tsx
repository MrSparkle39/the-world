"use client";

import { useState } from "react";
import Link from "next/link";
import { locations } from "@/content/world";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";
import type { HotspotDefinition } from "@/lib/types/content";

export default function ArcadePage() {
  const [msg, setMsg] = useState<string | null>(null);

  function onHotspot(h: HotspotDefinition) {
    if (h.action === "dreaming") setMsg("This machine is dreaming.");
    if (h.action === "tuesday") setMsg("Someone appears to have stolen Tuesday from this cabinet.");
  }

  return (
    <PageShell title="Rewind Arcade" subtitle="A crooked theatre of cabinets." backHref="/places/backwards-town">
      <LayeredScene location={locations.arcade} onHotspot={onHotspot} />
      <div className="mt-4 text-center">
        <Link href="/games/rewind-runner" className="btn-primary inline-block text-lg">
          Play Rewind Runner
        </Link>
      </div>
      <IllustratedModal open={!!msg} title="Cabinet" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
