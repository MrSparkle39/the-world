"use client";

import { useEffect } from "react";
import { useWorldStore } from "@/lib/store/world-store";

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useWorldStore((s) => s.hydrate);
  const hydrated = useWorldStore((s) => s.hydrated);
  const settings = useWorldStore((s) => s.save.settings);

  useEffect(() => {
    try {
      hydrate();
    } catch (err) {
      console.error("World hydrate failed; continuing with empty save.", err);
      useWorldStore.setState({ hydrated: true });
    }
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.motion = settings.motion;
    document.documentElement.dataset.textSize = settings.textSize;
    document.documentElement.dataset.contrast = settings.highContrast ? "high" : "normal";
    if (settings.motion === "reduced") {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }
  }, [hydrated, settings]);

  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--sky)] text-[var(--ink)]">
        <p className="font-display text-2xl tracking-wide">Finding the path…</p>
      </div>
    );
  }

  return <>{children}</>;
}
