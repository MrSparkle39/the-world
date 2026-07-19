"use client";

import Link from "next/link";
import { useState } from "react";
import { mapRealms } from "@/content/world";
import { useWorldStore } from "@/lib/store/world-store";
import { IllustratedModal, PageShell } from "@/components/ui/primitives";
import { moonfallEvent } from "@/content/world";

export default function MapPage() {
  const cracked = !!useWorldStore((s) => s.save.progress.worldFlags.crackedMoonVisible);
  const visitLocation = useWorldStore((s) => s.visitLocation);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <PageShell title="The Between" subtitle="Paths float. Do not ask what the medium is." backHref="/home">
      {cracked && (
        <div className="mb-3 rounded-2xl border border-[var(--title)]/25 bg-[rgba(255,248,235,0.9)] px-4 py-2 text-sm text-[var(--title)]">
          {moonfallEvent.name}: {moonfallEvent.recentChange}
        </div>
      )}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-[var(--cream-edge)] shadow-[var(--shadow)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/map/the-between.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        {cracked && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/art/backwards-town/sky-cracked-moon.png"
            alt=""
            className="absolute right-[12%] top-[10%] h-20 w-20 object-contain opacity-90"
          />
        )}
        {mapRealms.map((r) => {
          const open = r.status === "open";
          const node = (
            <button
              type="button"
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-sm shadow ${
                open
                  ? "bg-[rgba(255,248,235,0.92)] text-[var(--ink)]"
                  : "bg-[rgba(30,25,40,0.65)] text-[var(--cream)]"
              }`}
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
              onClick={() => {
                if (open && r.href) {
                  visitLocation(r.id);
                } else {
                  setMsg(r.blurb);
                }
              }}
            >
              {r.name}
            </button>
          );
          return open && r.href ? (
            <Link key={r.id} href={r.href} className="contents" onClick={() => visitLocation(r.id)}>
              {node}
            </Link>
          ) : (
            <span key={r.id}>{node}</span>
          );
        })}
      </div>
      <IllustratedModal open={!!msg} title="A distant path" onClose={() => setMsg(null)}>
        <p>{msg}</p>
      </IllustratedModal>
    </PageShell>
  );
}
