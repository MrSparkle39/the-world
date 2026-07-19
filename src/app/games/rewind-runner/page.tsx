"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type Phaser from "phaser";
import { useWorldStore } from "@/lib/store/world-store";
import { PageShell } from "@/components/ui/primitives";

/**
 * Rewind Runner — Phaser-powered endless runner.
 * Dynamically imported to keep SSR clean.
 */
export default function RewindRunnerPage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const recordArcadeRun = useWorldStore((s) => s.recordArcadeRun);
  const high = useWorldStore((s) => s.save.progress.arcadeHighScores["rewind-runner"] ?? 0);
  const [hud, setHud] = useState({ score: 0, status: "ready" as string });
  const [summary, setSummary] = useState<{
    score: number;
    coins: number;
    grantedCap: boolean;
    highScore: number;
  } | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!hostRef.current || gameRef.current) return;
      const Phaser = await import("phaser");
      if (cancelled || !hostRef.current) return;

      const W = Math.min(900, hostRef.current.clientWidth || 900);
      const H = 360;

      class RunnerScene extends Phaser.Scene {
        player!: Phaser.Physics.Arcade.Sprite;
        cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        wasd!: { W: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
        obstacles!: Phaser.Physics.Arcade.Group;
        seconds!: Phaser.Physics.Arcade.Group;
        score = 0;
        speed = 220;
        grounded = false;
        ducking = false;
        paused = false;
        reverseWarn = false;
        spawnTimer = 0;
        bg!: Phaser.GameObjects.TileSprite[];

        constructor() {
          super("runner");
        }

        preload() {
          // generate textures
          const g = this.make.graphics({ x: 0, y: 0 });
          g.fillStyle(0xd4a84b, 1);
          g.fillRoundedRect(0, 0, 28, 36, 6);
          g.generateTexture("player", 28, 36);
          g.clear();
          g.fillStyle(0x6b5e52, 1);
          g.fillRect(0, 0, 36, 28);
          g.generateTexture("cart", 36, 28);
          g.clear();
          g.fillStyle(0x3d6ea5, 1);
          g.fillRect(0, 0, 20, 40);
          g.generateTexture("sign", 20, 40);
          g.clear();
          g.fillStyle(0x8fb8d8, 0.8);
          g.fillEllipse(16, 8, 32, 14);
          g.generateTexture("puddle", 32, 14);
          g.clear();
          g.fillStyle(0xf5e6a8, 1);
          g.fillCircle(8, 8, 8);
          g.generateTexture("second", 16, 16);
          g.clear();
          g.fillStyle(0x5f7a45, 1);
          g.fillRect(0, 0, 64, 64);
          g.generateTexture("ground", 64, 64);
          g.clear();
          g.fillStyle(0x9ec4df, 1);
          g.fillRect(0, 0, 64, 64);
          g.generateTexture("sky", 64, 64);
          g.destroy();
        }

        create() {
          this.bg = [
            this.add.tileSprite(W / 2, H / 2, W, H, "sky").setDepth(0),
            this.add.tileSprite(W / 2, H - 40, W, 80, "ground").setDepth(1),
          ];
          this.physics.world.setBounds(0, 0, W, H);
          this.player = this.physics.add.sprite(90, H - 90, "player");
          this.player.setCollideWorldBounds(true);
          this.player.setDepth(5);
          (this.player.body as Phaser.Physics.Arcade.Body).setSize(22, 34);

          const floor = this.add.rectangle(W / 2, H - 18, W, 36, 0x000000, 0);
          this.physics.add.existing(floor, true);
          this.physics.add.collider(this.player, floor, () => {
            this.grounded = true;
          });

          this.obstacles = this.physics.add.group();
          this.seconds = this.physics.add.group();
          this.physics.add.overlap(this.player, this.obstacles, () => this.gameOver());
          this.physics.add.overlap(this.player, this.seconds, (_p, s) => {
            (s as Phaser.Physics.Arcade.Sprite).destroy();
            this.score += 15;
            setHud({ score: this.score, status: "running" });
          });

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys("W,S,A,D") as typeof this.wasd;
          this.input.keyboard!.on("keydown-ESC", () => {
            this.paused = !this.paused;
            this.physics.world.isPaused = this.paused;
            setHud({ score: this.score, status: this.paused ? "paused" : "running" });
          });

          this.add
            .text(12, 10, "Rewind Runner", {
              fontFamily: "serif",
              fontSize: "16px",
              color: "#243a62",
            })
            .setDepth(10);

          setHud({ score: 0, status: "running" });
        }

        jump() {
          if (this.grounded && !this.ducking) {
            this.player.setVelocityY(-380);
            this.grounded = false;
          }
        }

        update(_t: number, dt: number) {
          if (this.paused || muted) {
            /* mute flag reserved for future audio */
          }
          if (this.paused) return;

          this.speed = Math.min(420, 220 + this.score / 8);
          this.bg[0].tilePositionX += (this.speed * dt) / 1000 / 4;
          this.bg[1].tilePositionX += (this.speed * dt) / 1000;

          const reverse = this.reverseWarn;
          const left = this.cursors.left?.isDown || this.wasd.A.isDown;
          const right = this.cursors.right?.isDown || this.wasd.D.isDown;
          let vx = 0;
          if (left) vx = reverse ? 80 : -60;
          if (right) vx = reverse ? -60 : 80;
          this.player.setVelocityX(vx);

          if (
            Phaser.Input.Keyboard.JustDown(this.cursors.up!) ||
            Phaser.Input.Keyboard.JustDown(this.wasd.W) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.space!)
          ) {
            this.jump();
          }

          this.ducking = !!(this.cursors.down?.isDown || this.wasd.S.isDown);
          this.player.setScale(1, this.ducking ? 0.55 : 1);
          if (this.ducking) this.player.y = Math.min(this.player.y, H - 70);

          this.score += dt / 100;
          setHud({ score: Math.floor(this.score), status: this.reverseWarn ? "reversed!" : "running" });

          this.spawnTimer += dt;
          const interval = Math.max(700, 1400 - this.score);
          if (this.spawnTimer > interval) {
            this.spawnTimer = 0;
            this.spawnObstacle();
            if (Math.random() < 0.45) this.spawnSecond();
            this.reverseWarn = Math.random() < 0.12;
          }

          this.obstacles.getChildren().forEach((o) => {
            const s = o as Phaser.Physics.Arcade.Sprite;
            s.x -= (this.speed * dt) / 1000;
            if (s.x < -40) s.destroy();
          });
          this.seconds.getChildren().forEach((o) => {
            const s = o as Phaser.Physics.Arcade.Sprite;
            s.x -= (this.speed * dt) / 1000;
            if (s.x < -40) s.destroy();
          });
        }

        spawnObstacle() {
          const kind = Math.random();
          const key = kind < 0.4 ? "cart" : kind < 0.7 ? "sign" : "puddle";
          const y = key === "sign" ? H - 95 : H - 55;
          const obs = this.obstacles.create(W + 40, y, key) as Phaser.Physics.Arcade.Sprite;
          obs.setImmovable(true);
          (obs.body as Phaser.Physics.Arcade.Body).allowGravity = false;
          // avoid impossible stacks — single spawn
        }

        spawnSecond() {
          const s = this.seconds.create(
            W + 40,
            H - 110 - Math.random() * 40,
            "second",
          ) as Phaser.Physics.Arcade.Sprite;
          (s.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        }

        gameOver() {
          if (this.paused) return;
          this.paused = true;
          this.physics.world.isPaused = true;
          const score = Math.floor(this.score);
          const reward = recordArcadeRun("rewind-runner", score);
          setSummary({ score, ...reward });
          setHud({ score, status: "game over" });
        }
      }

      const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: W,
        height: H,
        parent: hostRef.current,
        backgroundColor: "#8fb8d8",
        physics: { default: "arcade", arcade: { gravity: { x: 0, y: 900 }, debug: false } },
        scene: RunnerScene,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      });
      gameRef.current = game;
    }

    boot();
    return () => {
      cancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [recordArcadeRun, muted]);

  return (
    <PageShell
      title="Rewind Runner"
      subtitle="Run backwards while the town repairs itself."
      backHref="/places/backwards-town/arcade"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p>
          Score: {hud.score} · Best: {high} · {hud.status}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={() => setMuted((m) => !m)}>
            {muted ? "Unmute" : "Mute"}
          </button>
          <Link href="/places/backwards-town/arcade" className="btn-ghost">
            Exit
          </Link>
        </div>
      </div>
      <div
        ref={hostRef}
        className="overflow-hidden rounded-2xl border border-[var(--cream-edge)] bg-[#8fb8d8] shadow"
      />
      <div className="mt-3 flex gap-2 sm:hidden">
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={() => {
            const canvas = hostRef.current?.querySelector("canvas");
            canvas?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
          }}
        >
          Jump
        </button>
        <button type="button" className="btn-secondary flex-1">
          Duck (hold ↓)
        </button>
      </div>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        Tutorial: Jump over carts, duck under signs, collect lost seconds. Esc pauses.
      </p>

      {summary && (
        <div className="mt-4 rounded-3xl border border-[var(--cream-edge)] bg-[rgba(255,248,235,0.95)] p-4 shadow">
          <p className="font-display text-2xl">Run complete</p>
          <p>Score {summary.score} · High {summary.highScore}</p>
          <p>+{summary.coins} coins (capped)</p>
          {summary.grantedCap && <p>Reward unlocked: Courier&apos;s Rewind Cap</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSummary(null);
                gameRef.current?.destroy(true);
                gameRef.current = null;
                // remount by reload route state
                window.location.reload();
              }}
            >
              Restart
            </button>
            <Link href="/inventory" className="btn-secondary">
              Open satchel
            </Link>
          </div>
        </div>
      )}
    </PageShell>
  );
}
