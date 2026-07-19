"use client";

import { useRouter } from "next/navigation";
import { useWorldStore } from "@/lib/store/world-store";
import { PageShell } from "@/components/ui/primitives";

export default function SettingsPage() {
  const router = useRouter();
  const settings = useWorldStore((s) => s.save.settings);
  const updateSettings = useWorldStore((s) => s.updateSettings);
  const resetProfile = useWorldStore((s) => s.resetProfile);

  return (
    <PageShell title="Options" subtitle="Comfort controls for your visit." backHref="/home">
      <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-5 shadow">
        <label className="flex items-center justify-between gap-3">
          <span>Music</span>
          <input
            type="checkbox"
            checked={settings.music}
            onChange={(e) => updateSettings({ music: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span>Sound effects</span>
          <input
            type="checkbox"
            checked={settings.sfx}
            onChange={(e) => updateSettings({ sfx: e.target.checked })}
          />
        </label>
        <label className="block">
          <span>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            className="mt-1 w-full"
          />
        </label>
        <label className="block">
          <span>Motion</span>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--cream-edge)] bg-white/80 px-3 py-2"
            value={settings.motion}
            onChange={(e) =>
              updateSettings({ motion: e.target.value as "full" | "gentle" | "reduced" })
            }
          >
            <option value="full">Full</option>
            <option value="gentle">Gentle</option>
            <option value="reduced">Reduced</option>
          </select>
        </label>
        <label className="block">
          <span>Text size</span>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--cream-edge)] bg-white/80 px-3 py-2"
            value={settings.textSize}
            onChange={(e) =>
              updateSettings({ textSize: e.target.value as "standard" | "large" })
            }
          >
            <option value="standard">Standard</option>
            <option value="large">Large</option>
          </select>
        </label>
        <label className="flex items-center justify-between gap-3">
          <span>High contrast</span>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSettings({ highContrast: e.target.checked })}
          />
        </label>

        <div className="rounded-2xl border border-[var(--cream-edge)] bg-white/50 p-3 text-sm">
          <p className="font-display text-lg text-[var(--title)]">Controls</p>
          <p className="mt-1"><strong>Keyboard:</strong> arrows / WASD move, Space jump, Down duck, Esc pause.</p>
          <p className="mt-1"><strong>Touch:</strong> on-screen jump / duck buttons in arcade & adventure.</p>
        </div>

        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => {
            if (confirm("Reset local profile? This clears this device's adventure.")) {
              resetProfile();
              router.push("/");
            }
          }}
        >
          Reset local profile (dev)
        </button>
      </div>
    </PageShell>
  );
}
