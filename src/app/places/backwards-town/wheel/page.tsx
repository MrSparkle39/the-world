"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { locations, wheelPrizes, npcs } from "@/content/world";
import { useWorldStore } from "@/lib/store/world-store";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";
import { canSpinWheel, localDayKey } from "@/lib/game/logic";
import type { HotspotDefinition } from "@/lib/types/content";

export default function WheelPage() {
  const progress = useWorldStore((s) => s.save.progress);
  const spinWheel = useWorldStore((s) => s.spinWheel);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const segments = useMemo(() => wheelPrizes, []);
  const day = localDayKey();
  const available = canSpinWheel(progress.wheelSpins, "wheel-of-before", day);

  function onHotspot(h: HotspotDefinition) {
    if (h.action === "talk-tock") {
      setMsg("Tock: The wheel has already been spun. Unless it hasn't. Spin carefully.");
    }
    if (h.action === "spin") startSpin();
  }

  function startSpin() {
    if (!available || spinning) {
      setMsg("Next spin arrives with tomorrow morning.");
      return;
    }
    const outcome = spinWheel("wheel-of-before", segments);
    if (!outcome.ok) {
      setMsg("Next spin arrives with tomorrow morning.");
      return;
    }
    // Deterministic visual: land on chosen index
    const segAngle = 360 / segments.length;
    const target = 360 * 4 + (360 - outcome.index * segAngle - segAngle / 2);
    setSpinning(true);
    setRotation((r) => r + target);
    window.setTimeout(() => {
      setSpinning(false);
      setResult(
        outcome.prize.funnyOnly
          ? "Nothing — but Tock laughs like a wind-up bird."
          : `You receive: ${outcome.prize.label}`,
      );
    }, 4200);
  }

  return (
    <PageShell title="Wheel of Before" subtitle={npcs.tock.blurb} backHref="/places/backwards-town">
      <LayeredScene location={locations.wheel} onHotspot={onHotspot} />
      <div className="mx-auto mt-4 flex max-w-md flex-col items-center rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-4 shadow">
        <div className="relative mb-3 h-56 w-56">
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 text-2xl">▼</div>
          <motion.div
            className="h-full w-full rounded-full border-4 border-[var(--gold)]"
            style={{
              background: `conic-gradient(${segments
                .map((_, i) => {
                  const colors = ["#c45c4a", "#3d6ea5", "#d4a84b", "#5f7a45", "#7a5ea8", "#d4894b", "#6b5e52", "#8fb8d8"];
                  const start = (i / segments.length) * 100;
                  const end = ((i + 1) / segments.length) * 100;
                  return `${colors[i % colors.length]} ${start}% ${end}%`;
                })
                .join(", ")})`,
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.15, 0.8, 0.1, 1] }}
          />
        </div>
        <button type="button" className="btn-primary" disabled={spinning || !available} onClick={startSpin}>
          {available ? (spinning ? "Spinning…" : "Spin the wheel") : "Already spun today"}
        </button>
      </div>
      <IllustratedModal open={!!result} title="Wheel result" onClose={() => setResult(null)}>
        <p>{result}</p>
      </IllustratedModal>
      <IllustratedModal open={!!msg} title="Tock" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
