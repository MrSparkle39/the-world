"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { explorers } from "@/content/explorers";
import { useWorldStore } from "@/lib/store/world-store";
import type { AgeBracket, ExplorerStyle } from "@/lib/types/player";
import { PageShell } from "@/components/ui/primitives";

export default function StartPage() {
  const router = useRouter();
  const createExplorer = useWorldStore((s) => s.createExplorer);
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeBracket>("9-12");
  const [style, setStyle] = useState<ExplorerStyle>("ember-trail");

  return (
    <PageShell title="Create Explorer" subtitle="A nickname is enough. No full name needed." backHref="/">
      <form
        className="mx-auto max-w-xl space-y-5 rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-5 shadow-[var(--shadow)]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createExplorer({ explorerName: name, ageBracket: age, explorerStyle: style });
          router.push("/companion");
        }}
      >
        <label className="block">
          <span className="text-sm text-[var(--ink-soft)]">Explorer nickname</span>
          <input
            required
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--cream-edge)] bg-white/80 px-3 py-2"
            placeholder="Something wonderful"
          />
        </label>

        <fieldset>
          <legend className="text-sm text-[var(--ink-soft)]">Age bracket</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["6-8", "9-12", "13-16"] as AgeBracket[]).map((a) => (
              <button
                key={a}
                type="button"
                className={age === a ? "btn-primary" : "btn-secondary"}
                onClick={() => setAge(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm text-[var(--ink-soft)]">Starter look</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {explorers.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setStyle(ex.id as ExplorerStyle)}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  style === ex.id
                    ? "border-[var(--gold)] ring-2 ring-[var(--gold)]"
                    : "border-[var(--cream-edge)]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ex.portrait} alt="" className="h-36 w-full object-cover" />
                <div className="p-2">
                  <p className="font-display text-lg">{ex.name}</p>
                  <p className="text-xs text-[var(--ink-soft)]">{ex.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary w-full text-lg">
          Meet your companion
        </button>
      </form>
    </PageShell>
  );
}
