"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWorldStore } from "@/lib/store/world-store";
import { ChoiceList, IllustratedModal, PageShell } from "@/components/ui/primitives";
import dynamic from "next/dynamic";

const FragmentExplore = dynamic(
  () => import("@/components/adventure/FragmentExplore").then((m) => m.FragmentExplore),
  { ssr: false, loading: () => <p>The map is remembering where it put that town…</p> },
);

type Stage = "observatory" | "explore" | "creature" | "fragment" | "return" | "done";

export default function MoonfallProloguePage() {
  const profile = useWorldStore((s) => s.save.profile);
  const progress = useWorldStore((s) => s.save.progress);
  const setQuestStage = useWorldStore((s) => s.setQuestStage);
  const setWorldFlag = useWorldStore((s) => s.setWorldFlag);
  const addItem = useWorldStore((s) => s.addItem);
  const unlockJournal = useWorldStore((s) => s.unlockJournal);
  const inventory = useWorldStore((s) => s.save.inventory);
  const eatFood = useWorldStore((s) => s.eatFood);

  const saved = progress.questStates["moonfall-prologue"];
  const [stage, setStage] = useState<Stage>((saved?.stage as Stage) || "observatory");
  const [note, setNote] = useState<string | null>(null);
  const [choiceMade, setChoiceMade] = useState<string | null>(
    (saved?.flags?.creatureChoice as string) || null,
  );

  useEffect(() => {
    setQuestStage("moonfall-prologue", stage, stage === "done" ? "completed" : "active");
  }, [stage, setQuestStage]);

  function go(next: Stage) {
    setStage(next);
  }

  function finish() {
    addItem("moon-fragment", 1, "moonfall-prologue");
    setWorldFlag("crackedMoonVisible", true);
    setWorldFlag("moonfallPrologueComplete", true);
    unlockJournal("moonfall");
    unlockJournal("moon-fragment");
    unlockJournal("orra-vale");
    setQuestStage("moonfall-prologue", "done", "completed", {
      creatureChoice: choiceMade ?? "observe",
    });
    setStage("done");
  }

  const hasFood = inventory.some(
    (e) => itemsFood(e.itemId) && e.quantity > 0,
  );

  return (
    <PageShell title="Moonfall Prologue" subtitle="A beginning, not a boss fight." backHref="/adventure">
      {stage === "observatory" && (
        <Panel>
          <p className="font-display text-2xl text-[var(--title)]">Orra Vale</p>
          <p className="mt-2">Look. The crack is growing.</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Your companion shifts closer, unsettled by the light.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/art/adventure/observatory.png"
            alt=""
            className="mt-3 max-h-64 w-full rounded-2xl object-cover"
          />
          <button type="button" className="btn-primary mt-4" onClick={() => go("explore")}>
            Follow the fallen light
          </button>
        </Panel>
      )}

      {stage === "explore" && (
        <Panel>
          <p className="mb-2">Search the path. Find the fragment.</p>
          <FragmentExplore
            onFound={() => {
              setNote("You find a glowing fragment near strange footprints.");
              go("creature");
            }}
          />
        </Panel>
      )}

      {stage === "creature" && (
        <Panel>
          <p className="mb-3">
            A small cosmic creature guards the fragment. It looks frightened more than fierce.
          </p>
          {!choiceMade ? (
            <ChoiceList
              choices={[
                { id: "strike", label: "Strike the creature" },
                { id: "food", label: "Offer food" },
                { id: "observe", label: "Observe before acting" },
              ]}
              onChoose={(id) => {
                if (id === "food") {
                  if (!hasFood) {
                    setNote("You reach for food — pockets empty. Try observing.");
                    return;
                  }
                  const food = inventory.find((e) => itemsFood(e.itemId));
                  if (food) eatFood(food.itemId);
                  setChoiceMade("food");
                  setQuestStage("moonfall-prologue", "creature", "active", {
                    creatureChoice: "food",
                  });
                  setNote("It calms, and nudges you toward the safer fragment resting place.");
                } else if (id === "strike") {
                  setChoiceMade("strike");
                  setQuestStage("moonfall-prologue", "creature", "active", {
                    creatureChoice: "strike",
                  });
                  setNote("It flees. The fragment drops. Your journal will remember the fear.");
                } else {
                  setChoiceMade("observe");
                  setQuestStage("moonfall-prologue", "creature", "active", {
                    creatureChoice: "observe",
                  });
                  setNote(
                    "It was shielding a smaller creature. You move the fragment without harm.",
                  );
                }
              }}
            />
          ) : (
            <button type="button" className="btn-primary" onClick={() => go("fragment")}>
              Touch the fragment
            </button>
          )}
        </Panel>
      )}

      {stage === "fragment" && (
        <Panel>
          <p className="font-display text-xl">A brief memory</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>An enormous shadow inside the moon</li>
            <li>An eye-like light opening</li>
            <li>The moon cracking outward</li>
            <li>Signal lost</li>
          </ul>
          <button type="button" className="btn-primary mt-4" onClick={() => go("return")}>
            Return to Orra
          </button>
        </Panel>
      )}

      {stage === "return" && (
        <Panel>
          <p>Orra: So it begins. The cosy skies will notice — gently.</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Explorer {profile?.explorerName}, the cracked moon will remain visible across The World.
          </p>
          <button type="button" className="btn-primary mt-4" onClick={finish}>
            Accept the fragment
          </button>
        </Panel>
      )}

      {stage === "done" && (
        <Panel>
          <p className="font-display text-2xl text-[var(--title)]">Prologue complete</p>
          <p className="mt-2">Moon Fragment secured. The cracked moon persists.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/" className="btn-primary">
              See the homepage sky
            </Link>
            <Link href="/home" className="btn-secondary">
              Return to room
            </Link>
            <Link href="/map" className="btn-ghost">
              Open map
            </Link>
          </div>
        </Panel>
      )}

      <IllustratedModal open={!!note} title="Moonfall" onClose={() => setNote(null)}>
        <p>{note}</p>
      </IllustratedModal>
    </PageShell>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] p-5 shadow">
      {children}
    </div>
  );
}

function itemsFood(id: string) {
  return ["companion-snack", "yesterdays-bun", "pocket-crumb", "backwards-biscuit", "jam-unopened"].includes(
    id,
  );
}
