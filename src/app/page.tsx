"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWorldStore } from "@/lib/store/world-store";
import { IllustratedModal } from "@/components/ui/primitives";
import { moonfallEvent } from "@/content/world";

export default function HomePage() {
  const profile = useWorldStore((s) => s.save.profile);
  const progress = useWorldStore((s) => s.save.progress);
  const settings = useWorldStore((s) => s.save.settings);
  const updateSettings = useWorldStore((s) => s.updateSettings);
  const cracked = !!progress.worldFlags.crackedMoonVisible;
  const hasSave = !!(profile && progress.completedOnboarding);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const motionOn = settings.motion !== "reduced";

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Full-bleed hero: single cover layer (no contain letterboxing) */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/art/homepage/homepage-valley-base.png"
          alt="A lush fantasy valley with a castle, village, windmill, and explorers on a hill."
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
        {cracked && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/art/backwards-town/sky-cracked-moon.png"
            alt=""
            className="pointer-events-none absolute right-[10%] top-[7%] h-[16vmin] w-[16vmin] object-contain opacity-95"
          />
        )}
        {/* Floating balloon — upper-right sky, clear of castle/subjects */}
        <motion.img
          src="/art/homepage/homepage-balloon.png"
          alt=""
          className="pointer-events-none absolute right-[14%] top-[10%] w-[min(8vw,96px)] drop-shadow-md"
          animate={
            motionOn
              ? { y: [0, -14, 0], x: [0, 8, -6, 0], rotate: [-2, 2, -1, -2] }
              : undefined
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-10">
        {cracked && (
          <div className="mb-4 rounded-full border border-[var(--title)]/30 bg-[rgba(255,248,235,0.85)] px-4 py-1 text-sm text-[var(--title)] shadow">
            {moonfallEvent.name} · {moonfallEvent.stage}
          </div>
        )}

        <div className="mb-8 text-center">
          <p className="font-script text-3xl text-[var(--cream)] drop-shadow sm:text-4xl">The World</p>
          <h1 className="font-display text-4xl font-semibold tracking-wide text-[var(--cream)] drop-shadow-md sm:text-6xl">
            The World
          </h1>
          <p className="mt-2 text-[var(--cream)]/95 drop-shadow">A Place of Wonder</p>
        </div>

        <nav
          className="flex w-full max-w-sm flex-col gap-2 rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.88)] p-4 shadow-[var(--shadow)] backdrop-blur-md"
          aria-label="Main"
        >
          {hasSave ? (
            <Link href="/home" className="btn-primary text-center text-lg">
              Continue Adventure
            </Link>
          ) : (
            <Link href="/start" className="btn-primary text-center text-lg">
              Start Adventure
            </Link>
          )}
          <Link href="/start" className="btn-secondary text-center">
            Create Explorer
          </Link>
          <button type="button" className="btn-secondary" onClick={() => setLoginOpen(true)}>
            Log In
          </button>
          <button type="button" className="btn-ghost" onClick={() => setOptionsOpen(true)}>
            Options
          </button>
          <button type="button" className="btn-ghost" onClick={() => setAboutOpen(true)}>
            What is The World?
          </button>
        </nav>
      </div>

      <IllustratedModal open={aboutOpen} title="What is The World?" onClose={() => setAboutOpen(false)}>
        <p className="mb-3 text-[var(--ink-soft)]">
          A vast magical universe you can visit for a few minutes or disappear into for hours.
        </p>
        <p className="text-[var(--ink-soft)]">
          Explore cosy places, play games, collect strange treasures, and—if you choose—step into Adventure Mode when the sky changes.
        </p>
      </IllustratedModal>

      <IllustratedModal open={loginOpen} title="Log In" onClose={() => setLoginOpen(false)}>
        <p className="text-[var(--ink-soft)]">
          Cloud save arrives later. For now your adventure lives on this device.
        </p>
      </IllustratedModal>

      <IllustratedModal open={optionsOpen} title="Options" onClose={() => setOptionsOpen(false)}>
        <label className="mb-3 block text-sm">
          Motion
          <select
            className="mt-1 w-full rounded-xl border border-[var(--cream-edge)] bg-white/80 px-3 py-2"
            value={settings.motion}
            onChange={(e) =>
              updateSettings({ motion: e.target.value as "full" | "gentle" | "reduced" })
            }
          >
            <option value="full">Full</option>
            <option value="gentle">Gentle</option>
            <option value="reduced">Reduced</option>
          </select>
        </label>
        <Link href="/settings" className="btn-primary inline-block" onClick={() => setOptionsOpen(false)}>
          More settings
        </Link>
      </IllustratedModal>
    </main>
  );
}
