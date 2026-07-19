"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function SpeechBubble({
  speaker,
  lines,
  onDone,
}: {
  speaker?: string;
  lines: string[];
  onDone?: () => void;
}) {
  const [i, setI] = useState(0);
  const line = lines[i];

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-[var(--cream-edge)] bg-[rgba(255,250,240,0.95)] p-4 shadow-[var(--shadow)]">
      {speaker && (
        <p className="mb-1 font-display text-lg text-[var(--title)]">{speaker}</p>
      )}
      <AnimatePresence mode="wait">
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-[var(--ink)]"
        >
          {line}
        </motion.p>
      </AnimatePresence>
      <div className="mt-3 flex justify-end gap-2">
        {i < lines.length - 1 ? (
          <button type="button" className="btn-primary" onClick={() => setI((x) => x + 1)}>
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onDone?.()}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

export function ChoiceList({
  choices,
  onChoose,
}: {
  choices: { id: string; label: string }[];
  onChoose: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {choices.map((c) => (
        <button
          key={c.id}
          type="button"
          className="btn-secondary text-left"
          onClick={() => onChoose(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export function IllustratedModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[85dvh] w-full max-w-lg overflow-auto rounded-3xl border border-[var(--cream-edge)] bg-[var(--cream)] p-5 shadow-[var(--shadow)]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl text-[var(--title)]">{title}</h2>
          <button type="button" className="btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageShell({
  title,
  subtitle,
  children,
  backHref,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <main className="relative min-h-dvh px-4 pb-28 pt-6 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-5xl">
        {(title || backHref) && (
          <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              {title && (
                <h1 className="font-display text-3xl text-[var(--title)] sm:text-4xl">
                  {title}
                </h1>
              )}
              {subtitle && <p className="mt-1 text-[var(--ink-soft)]">{subtitle}</p>}
            </div>
            {backHref && (
              <Link href={backHref} className="btn-ghost">
                ← Back
              </Link>
            )}
          </header>
        )}
        {children}
      </div>
    </main>
  );
}
