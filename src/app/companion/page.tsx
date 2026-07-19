"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { companions } from "@/content/companions";
import { useWorldStore } from "@/lib/store/world-store";
import { PageShell } from "@/components/ui/primitives";

export default function CompanionPage() {
  const router = useRouter();
  const profile = useWorldStore((s) => s.save.profile);
  const chooseCompanion = useWorldStore((s) => s.chooseCompanion);
  const [selected, setSelected] = useState(companions[0].id);

  if (!profile) {
    return (
      <PageShell title="Companion" backHref="/start">
        <p>Create an explorer first.</p>
      </PageShell>
    );
  }

  const c = companions.find((x) => x.id === selected)!;

  return (
    <PageShell
      title="Choose a companion"
      subtitle="The choice feels meaningful — and you can switch later."
      backHref="/start"
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3 sm:grid-cols-3">
          {companions.map((comp) => (
            <button
              key={comp.id}
              type="button"
              onClick={() => setSelected(comp.id)}
              className={`overflow-hidden rounded-2xl border bg-[rgba(255,248,235,0.9)] text-left ${
                selected === comp.id ? "border-[var(--gold)] ring-2 ring-[var(--gold)]" : "border-[var(--cream-edge)]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comp.idleAsset} alt="" className="h-40 w-full object-cover" />
              <p className="p-2 font-display text-xl">{comp.name}</p>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-5 shadow-[var(--shadow)]">
          <h2 className="font-display text-3xl text-[var(--title)]">{c.name}</h2>
          <p className="mt-2 text-[var(--ink-soft)]">{c.description}</p>
          <p className="mt-3 text-sm"><strong>Ability:</strong> {c.ability}</p>
          <p className="mt-1 text-sm"><strong>Habit:</strong> {c.habit}</p>
          <button
            type="button"
            className="btn-primary mt-5 w-full text-lg"
            onClick={() => {
              chooseCompanion(selected);
              router.push("/home");
            }}
          >
            Arrive home with {c.name}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
