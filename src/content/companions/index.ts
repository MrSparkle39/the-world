import type { CompanionDefinition } from "@/lib/types/content";

export const companions: CompanionDefinition[] = [
  {
    id: "spriggle",
    name: "Spriggle",
    description:
      "A cream-fluff wanderer with soft unusual ears and a living sprout on its head.",
    ability: "Notices lost buttons from surprising distances.",
    habit: "Stores treasures in a tiny green backpack, then forgets which pocket.",
    idleAsset: "/art/companions/spriggle-idle.png",
    colourHint: "#f3e6cf",
  },
  {
    id: "glim",
    name: "Glim",
    description:
      "A round midnight-blue companion with soft glowing markings and a short floating tail.",
    ability: "Calms starlight into a gentle guide-glow.",
    habit: "Stares at lanterns until they blink first.",
    idleAsset: "/art/companions/glim-idle.png",
    colourHint: "#243a62",
  },
  {
    id: "pebbit",
    name: "Pebbit",
    description:
      "A squat mossy stone friend with tiny legs and lichen-soft fur.",
    ability: "Becomes an immovable doorstop when needed.",
    habit: "Falls asleep in any warm patch of sun within thirty seconds.",
    idleAsset: "/art/companions/pebbit-idle.png",
    colourHint: "#5f7a45",
  },
];

export function getCompanion(id: string | null | undefined) {
  return companions.find((c) => c.id === id) ?? null;
}
