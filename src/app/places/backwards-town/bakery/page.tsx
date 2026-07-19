"use client";

import { useMemo, useState } from "react";
import { locations, bakeryDailyTable, npcs } from "@/content/world";
import { items } from "@/content/items";
import { useWorldStore } from "@/lib/store/world-store";
import { LayeredScene } from "@/components/scene/LayeredScene";
import { ChoiceList, IllustratedModal, PageShell, SpeechBubble } from "@/components/ui/primitives";
import { canClaimDaily, localDayKey, pickWeighted } from "@/lib/game/logic";
import { dialogueForAge } from "@/lib/game/logic";
import type { HotspotDefinition } from "@/lib/types/content";

export default function BakeryPage() {
  const profile = useWorldStore((s) => s.save.profile);
  const progress = useWorldStore((s) => s.save.progress);
  const completeBakeryQuest = useWorldStore((s) => s.completeBakeryQuest);
  const claimDaily = useWorldStore((s) => s.claimDaily);
  const unlockJournal = useWorldStore((s) => s.unlockJournal);
  const visitLocation = useWorldStore((s) => s.visitLocation);

  const [talk, setTalk] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState<string[]>([]);
  const [dailyResult, setDailyResult] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const ingredients = useMemo(() => ["flour", "yeast", "time", "patience"], []);
  const needed = ["flour", "yeast", "patience"];

  function onHotspot(h: HotspotDefinition) {
    visitLocation("bakery");
    if (h.action === "talk-mara") {
      unlockJournal("mara-crumb");
      setTalk(true);
      setChoice(null);
    }
    if (h.action === "daily") {
      const day = localDayKey();
      if (!canClaimDaily(progress.collectedDailies, "bakery-daily", day)) {
        setMsg("Tomorrow's freebie is still busy being yesterday.");
        return;
      }
      const pick = pickWeighted(bakeryDailyTable);
      const res = claimDaily("bakery-daily", pick.itemId);
      if (res.ok) {
        setDailyResult(pick.itemId);
      }
    }
  }

  const ageLine = dialogueForAge(
    {
      "6-8": "The cake got here too early! Can you help sort the ingredients?",
      "9-12": "Finished cakes keep arriving before I order flour. Help me sort this mess?",
      "13-16": "Something's wrong with the order of things. Sort the ingredients — carefully.",
      default: "Help me sort the ingredients for an unbaked loaf?",
    },
    profile?.ageBracket ?? "9-12",
  );

  return (
    <PageShell title="Yesterday's Bakery" subtitle={npcs["mara-crumb"].blurb} backHref="/places/backwards-town">
      <LayeredScene location={locations.bakery} onHotspot={onHotspot} />

      <IllustratedModal open={talk && !choice} title="Mara Crumb" onClose={() => setTalk(false)}>
        <SpeechBubble
          speaker="Mara Crumb"
          lines={["Goodbye! You must be the new Wayfinder."]}
          onDone={() => {}}
        />
        <div className="mt-3">
          <ChoiceList
            choices={[
              { id: "hello", label: "Hello." },
              { id: "why", label: "Why did you say goodbye?" },
              { id: "what", label: "I might be. What happened here?" },
            ]}
            onChoose={(id) => {
              setChoice(id);
              if (!progress.bakeryQuestDone) setSorting(true);
            }}
          />
        </div>
      </IllustratedModal>

      <IllustratedModal
        open={!!choice && sorting && !progress.bakeryQuestDone}
        title="Unbaked loaf"
        onClose={() => setSorting(false)}
      >
        <p className="mb-3 text-sm text-[var(--ink-soft)]">{ageLine}</p>
        <p className="mb-2 text-sm">Tap ingredients that belong in bread (not &quot;time&quot;).</p>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <button
              key={ing}
              type="button"
              className={sorted.includes(ing) ? "btn-primary" : "btn-secondary"}
              onClick={() =>
                setSorted((s) => (s.includes(ing) ? s.filter((x) => x !== ing) : [...s, ing]))
              }
            >
              {ing}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => {
            const ok =
              needed.every((n) => sorted.includes(n)) && !sorted.includes("time");
            if (ok) {
              completeBakeryQuest();
              setSorting(false);
              setMsg("Mara sighs with relief. +25 coins. Yesterday's Bun acquired.");
            } else {
              setMsg("Not quite — leave 'time' out of the bowl.");
            }
          }}
        >
          Finish sorting
        </button>
      </IllustratedModal>

      <IllustratedModal open={!!dailyResult} title="Daily parcel" onClose={() => setDailyResult(null)}>
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={items[dailyResult!]?.icon}
            alt=""
            className="mx-auto mb-3 h-24 w-24"
          />
          <p className="font-display text-2xl">{items[dailyResult!]?.name}</p>
          <p className="text-sm capitalize text-[var(--ink-soft)]">{items[dailyResult!]?.rarity}</p>
          <p className="mt-2 text-sm">{items[dailyResult!]?.description}</p>
        </div>
      </IllustratedModal>

      <IllustratedModal open={!!msg} title="Bakery" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
