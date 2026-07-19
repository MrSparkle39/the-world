"use client";

import { useRouter } from "next/navigation";
import { useWorldStore } from "@/lib/store/world-store";
import { getCompanion } from "@/content/companions";
import { PageShell } from "@/components/ui/primitives";

export default function CompanionProfilePage() {
  const router = useRouter();
  const profile = useWorldStore((s) => s.save.profile);
  const companion = getCompanion(profile?.companionId);

  if (!companion) {
    return (
      <PageShell title="Companion" backHref="/home">
        <p>No companion yet.</p>
        <button type="button" className="btn-primary mt-3" onClick={() => router.push("/companion")}>
          Choose one
        </button>
      </PageShell>
    );
  }

  return (
    <PageShell title={companion.name} subtitle="First-day companion" backHref="/home">
      <div className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] shadow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={companion.idleAsset} alt="" className="h-64 w-full object-cover" />
        <div className="p-5">
          <p>{companion.description}</p>
          <p className="mt-3 text-sm"><strong>Ability:</strong> {companion.ability}</p>
          <p className="mt-1 text-sm"><strong>Habit:</strong> {companion.habit}</p>
        </div>
      </div>
    </PageShell>
  );
}
