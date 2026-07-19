"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorldStore } from "@/lib/store/world-store";
import { getCompanion } from "@/content/companions";
import { moonfallEvent } from "@/content/world";

const HIDDEN = new Set(["/", "/start", "/companion"]);

export function TravelBar() {
  const pathname = usePathname();
  const profile = useWorldStore((s) => s.save.profile);
  const progress = useWorldStore((s) => s.save.progress);
  const companion = getCompanion(profile?.companionId);
  const cracked = !!progress.worldFlags.crackedMoonVisible;

  if (!profile?.companionId || HIDDEN.has(pathname)) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:bottom-auto sm:top-0 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.88)] px-3 py-2 shadow-[var(--shadow)] backdrop-blur-md">
        <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Travel">
          <TravelLink href="/home">Home</TravelLink>
          <TravelLink href="/map">Map</TravelLink>
          <TravelLink href="/inventory">Satchel</TravelLink>
          <TravelLink href="/journal">Journal</TravelLink>
          <TravelLink href="/companion-profile">Companion</TravelLink>
          <TravelLink href="/adventure">Adventure</TravelLink>
          <TravelLink href="/settings">Options</TravelLink>
        </nav>
        <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
          {cracked && (
            <Link
              href="/adventure"
              className="rounded-full bg-[var(--title)]/10 px-2 py-1 text-[var(--title)]"
            >
              {moonfallEvent.name}: {moonfallEvent.status}
            </Link>
          )}
          <span aria-label={`${profile.coins} coins`}>✦ {profile.coins}</span>
          {companion && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companion.idleAsset}
              alt={companion.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-[var(--gold)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TravelLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`rounded-full px-2.5 py-1 transition ${
        active
          ? "bg-[var(--moss)] text-[var(--cream)]"
          : "text-[var(--ink)] hover:bg-[var(--cream-edge)]"
      }`}
    >
      {children}
    </Link>
  );
}
