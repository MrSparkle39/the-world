"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HotspotDefinition, LocationDefinition } from "@/lib/types/content";
import { useWorldStore } from "@/lib/store/world-store";

export function LayeredScene({
  location,
  onHotspot,
  children,
}: {
  location: LocationDefinition;
  onHotspot?: (hotspot: HotspotDefinition) => void;
  children?: React.ReactNode;
}) {
  const cracked = !!useWorldStore((s) => s.save.progress.worldFlags.crackedMoonVisible);
  const variant = cracked ? location.worldStateVariants?.crackedMoon : undefined;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--cream-edge)] shadow-[var(--shadow)]">
      <div className="relative aspect-[16/10] w-full bg-[var(--sky)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={location.backgroundAsset}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {variant?.overlays?.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain object-top opacity-90"
          />
        ))}
        {location.ambientAnimations.map((a) => (
          <motion.span
            key={a.id}
            className="pointer-events-none absolute h-3 w-3 rounded-full bg-white/50"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
            animate={{ y: [0, -8, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {location.hotspots.map((h) => {
          const style = {
            left: `${h.x}%`,
            top: `${h.y}%`,
            width: h.w ? `${h.w}%` : undefined,
          } as const;
          const label = (
            <span
              className={`pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-[rgba(40,30,20,0.8)] px-2 py-0.5 text-xs text-[var(--cream)] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 ${
                h.showLabel ? "opacity-100" : ""
              }`}
            >
              {h.label}
            </span>
          );
          const className =
            "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-[rgba(255,248,235,0.35)] px-2 py-2 backdrop-blur-[2px] transition hover:bg-[rgba(255,248,235,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]";
          if (h.href) {
            return (
              <Link
                key={h.id}
                href={h.href}
                aria-label={h.label}
                className={className}
                style={style}
              >
                {label}
                <span className="block h-3 w-3 rounded-full bg-[var(--gold)] shadow" />
              </Link>
            );
          }
          return (
            <button
              key={h.id}
              type="button"
              className={className}
              style={style}
              aria-label={h.label}
              onClick={() => onHotspot?.(h)}
            >
              {label}
              <span className="block h-3 w-3 rounded-full bg-[var(--gold)] shadow" />
            </button>
          );
        })}
        {children}
      </div>
      <p className="border-t border-[var(--cream-edge)] bg-[rgba(255,248,235,0.92)] px-4 py-2 text-sm text-[var(--ink-soft)]">
        {location.description}
        {variant?.note ? ` ${variant.note}` : ""}
      </p>
    </div>
  );
}
