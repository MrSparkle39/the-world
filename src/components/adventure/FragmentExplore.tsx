"use client";

import { useEffect, useRef } from "react";

/** Lightweight Phaser-free canvas explore for reliability in Next; still keyboard/touch. */
export function FragmentExplore({ onFound }: { onFound: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const found = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
      x: 80,
      y: 180,
      keys: new Set<string>(),
      fragment: { x: 420, y: 140, r: 18 },
      plants: [
        { x: 200, y: 100 },
        { x: 320, y: 200 },
        { x: 500, y: 160 },
      ],
    };

    function resize() {
      const parent = canvas!.parentElement;
      const w = Math.min(720, parent?.clientWidth ?? 720);
      canvas!.width = w;
      canvas!.height = 280;
    }
    resize();

    function down(e: KeyboardEvent) {
      state.keys.add(e.key.toLowerCase());
    }
    function up(e: KeyboardEvent) {
      state.keys.delete(e.key.toLowerCase());
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    let raf = 0;
    const tick = () => {
      const speed = 2.4;
      if (state.keys.has("arrowleft") || state.keys.has("a")) state.x -= speed;
      if (state.keys.has("arrowright") || state.keys.has("d")) state.x += speed;
      if (state.keys.has("arrowup") || state.keys.has("w")) state.y -= speed;
      if (state.keys.has("arrowdown") || state.keys.has("s")) state.y += speed;
      state.x = Math.max(20, Math.min(canvas!.width - 20, state.x));
      state.y = Math.max(20, Math.min(canvas!.height - 20, state.y));

      // draw
      const g = ctx!;
      g.clearRect(0, 0, canvas!.width, canvas!.height);
      const sky = g.createLinearGradient(0, 0, 0, canvas!.height);
      sky.addColorStop(0, "#1a2240");
      sky.addColorStop(1, "#3d5a45");
      g.fillStyle = sky;
      g.fillRect(0, 0, canvas!.width, canvas!.height);

      // path
      g.fillStyle = "#5a4a38";
      g.fillRect(0, canvas!.height - 60, canvas!.width, 60);

      for (const p of state.plants) {
        g.fillStyle = "#7dd3a0";
        g.beginPath();
        g.arc(p.x, p.y, 10, 0, Math.PI * 2);
        g.fill();
      }

      // fragment
      g.fillStyle = "#f5f2c8";
      g.beginPath();
      g.arc(state.fragment.x, state.fragment.y, state.fragment.r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#fff8a0";
      g.stroke();

      // player
      g.fillStyle = "#d4a84b";
      g.beginPath();
      g.arc(state.x, state.y, 12, 0, Math.PI * 2);
      g.fill();

      const dx = state.x - state.fragment.x;
      const dy = state.y - state.fragment.y;
      if (!found.current && dx * dx + dy * dy < 28 * 28) {
        found.current = true;
        onFound();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onFound]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl border border-[var(--cream-edge)]"
        aria-label="Explore the fallen light path"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          // tap-to-move toward click
          const canvas = canvasRef.current;
          if (!canvas) return;
          // handled via keyboard primarily; tap near fragment also works
          const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
          const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
          if ((x - 420) ** 2 + (y - 140) ** 2 < 40 ** 2 && !found.current) {
            found.current = true;
            onFound();
          }
        }}
      />
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        Move with arrows/WASD. Tap the glowing fragment on touch devices.
      </p>
      <div className="mt-2 flex gap-2 sm:hidden">
        <button type="button" className="btn-secondary" onClick={() => onFound()}>
          Reach the fragment
        </button>
      </div>
    </div>
  );
}
