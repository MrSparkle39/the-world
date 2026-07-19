"use client";

import { journalEntries } from "@/content/world";
import { useWorldStore } from "@/lib/store/world-store";
import { PageShell } from "@/components/ui/primitives";

const SECTIONS = ["People", "Places", "Discoveries", "Quests", "Strange Things", "Events"] as const;

export default function JournalPage() {
  const unlocks = useWorldStore((s) => s.save.progress.journalUnlocks);
  const companionId = useWorldStore((s) => s.save.profile?.companionId);

  const unlocked = journalEntries.filter((e) => {
    if (unlocks.includes(e.unlockOn)) return true;
    if (companionId && e.unlockOn === `companion-${companionId}`) return true;
    return false;
  });

  return (
    <PageShell title="Journal" subtitle="Short observations in your own voice." backHref="/home">
      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const entries = unlocked.filter((e) => e.section === section);
          if (!entries.length) return null;
          return (
            <section key={section}>
              <h2 className="mb-2 font-display text-2xl text-[var(--title)]">{section}</h2>
              <div className="space-y-3">
                {entries.map((e) => (
                  <article
                    key={e.id}
                    className="rounded-2xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-4 shadow-sm"
                  >
                    <h3 className="font-display text-xl">{e.title}</h3>
                    <p className="mt-1 text-[var(--ink-soft)]">{e.body}</p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
        {unlocked.length === 0 && (
          <p className="text-[var(--ink-soft)]">Blank pages wait for footsteps.</p>
        )}
      </div>
    </PageShell>
  );
}
