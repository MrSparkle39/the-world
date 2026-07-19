import type { ExplorerDefinition } from "@/lib/types/content";
import type { ExplorerStyle } from "@/lib/types/player";

export const explorers: ExplorerDefinition[] = [
  {
    id: "ember-trail",
    name: "Ember Trail",
    blurb: "Warm copper coat, coiled dark hair, ready boots.",
    portrait: "/art/explorers/ember-trail.png",
    coat: "#b85c38",
  },
  {
    id: "moss-path",
    name: "Moss Path",
    blurb: "Forest-green wrap, soft locs, quiet curiosity.",
    portrait: "/art/explorers/moss-path.png",
    coat: "#4a6335",
  },
  {
    id: "sky-thread",
    name: "Sky Thread",
    blurb: "Sky-blue cloak, silver-sheen braids, bright gaze.",
    portrait: "/art/explorers/sky-thread.png",
    coat: "#3d6ea5",
  },
  {
    id: "stone-song",
    name: "Stone Song",
    blurb: "Stone-grey coat, short curls, patient stance.",
    portrait: "/art/explorers/stone-song.png",
    coat: "#6b5e52",
  },
];

export function getExplorer(style: ExplorerStyle) {
  return explorers.find((e) => e.id === style) ?? explorers[0];
}
