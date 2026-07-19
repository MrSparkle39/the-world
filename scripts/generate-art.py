"""Generate painted-style placeholder-free art assets for The World phase one."""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "public" / "art"
ICONS = ROOT / "public" / "icons"


def noise(img: Image.Image, amount=18) -> Image.Image:
    px = img.load()
    w, h = img.size
    rng = random.Random(42)
    for _ in range(w * h // 40):
        x, y = rng.randrange(w), rng.randrange(h)
        r, g, b = px[x, y][:3]
        d = rng.randint(-amount, amount)
        px[x, y] = (max(0, min(255, r + d)), max(0, min(255, g + d)), max(0, min(255, b + d)))
    return img


def vignette(img: Image.Image, strength=0.35) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGB", (w, h), (20, 16, 12))
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((-w * 0.1, -h * 0.15, w * 1.1, h * 1.15), fill=int(255 * strength))
    mask = mask.filter(ImageFilter.GaussianBlur(max(w, h) // 8))
    return Image.composite(overlay, img, mask)


def gradient(size, top, bottom) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        c = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        d.line([(0, y), (w, y)], fill=c)
    return img


def paint_scene(path: Path, kind: str, size=(1536, 1024)):
    path.parent.mkdir(parents=True, exist_ok=True)
    rng = random.Random(hash(kind) & 0xFFFFFFFF)
    w, h = size

    palettes = {
        "town": ((120, 170, 210), (70, 110, 70), (180, 120, 70)),
        "bakery": ((240, 210, 170), (160, 90, 50), (90, 50, 30)),
        "wheel": ((40, 50, 80), (180, 140, 60), (90, 70, 40)),
        "store": ((90, 70, 50), (200, 170, 120), (50, 80, 60)),
        "arcade": ((30, 20, 50), (200, 80, 140), (40, 120, 160)),
        "home": ((60, 50, 40), (200, 180, 140), (100, 140, 180)),
        "map": ((10, 15, 40), (80, 40, 120), (200, 180, 120)),
        "observatory": ((20, 25, 50), (90, 70, 50), (180, 200, 230)),
        "path": ((15, 20, 40), (40, 70, 50), (220, 230, 180)),
        "portrait": ((210, 190, 160), (120, 90, 70), (60, 50, 40)),
    }
    key = next((k for k in palettes if k in kind), "town")
    sky, mid, accent = palettes[key]
    img = gradient(size, sky, mid)
    d = ImageDraw.Draw(img)

    # hills / floor
    d.ellipse((-w * 0.2, h * 0.55, w * 1.2, h * 1.4), fill=mid)
    for i in range(8):
        x = rng.randint(0, w)
        y = rng.randint(int(h * 0.4), h)
        r = rng.randint(40, 160)
        col = tuple(max(0, min(255, c + rng.randint(-30, 30))) for c in mid)
        d.ellipse((x - r, y - r // 2, x + r, y + r // 2), fill=col)

    # buildings / props
    if "town" in kind or "arcade" in kind or "store" in kind or "bakery" in kind:
        for i in range(6):
            bw = rng.randint(80, 160)
            bh = rng.randint(120, 280)
            bx = 80 + i * (w // 7)
            by = h - bh - rng.randint(40, 120)
            wall = tuple(max(0, min(255, c + rng.randint(-40, 40))) for c in accent)
            d.rectangle((bx, by, bx + bw, by + bh), fill=wall)
            d.polygon([(bx - 10, by), (bx + bw // 2, by - 40), (bx + bw + 10, by)], fill=(90, 50, 40))
            for wy in range(by + 30, by + bh - 30, 40):
                d.rectangle((bx + 20, wy, bx + 45, wy + 25), fill=(220, 200, 140))

    if "home" in kind:
        # circular room suggestion
        d.ellipse((w * 0.08, h * 0.1, w * 0.92, h * 0.95), fill=(170, 140, 110))
        d.ellipse((w * 0.35, h * 0.12, w * 0.65, h * 0.42), fill=(140, 190, 220))  # window
        d.rectangle((w * 0.15, h * 0.55, w * 0.35, h * 0.75), fill=(120, 80, 50))  # bed
        d.ellipse((w * 0.55, h * 0.55, w * 0.75, h * 0.7), fill=(90, 70, 45))  # table

    if "map" in kind:
        for i in range(40):
            x, y = rng.randint(0, w), rng.randint(0, h)
            r = rng.randint(1, 4)
            d.ellipse((x, y, x + r, y + r), fill=(255, 240, 200))
        for i in range(12):
            x1, y1 = rng.randint(0, w), rng.randint(0, h)
            x2, y2 = rng.randint(0, w), rng.randint(0, h)
            d.line([(x1, y1), (x2, y2)], fill=(180, 160, 255), width=2)
        for i in range(8):
            x, y = rng.randint(100, w - 100), rng.randint(100, h - 100)
            d.ellipse((x - 30, y - 30, x + 30, y + 30), outline=(255, 220, 150), width=3)

    if "observatory" in kind or "path" in kind:
        d.ellipse((w * 0.7, h * 0.08, w * 0.88, h * 0.26), fill=(230, 230, 210))
        if "path" in kind or "cracked" in kind:
            # crack
            d.line([(int(w * 0.78), int(h * 0.1)), (int(w * 0.82), int(h * 0.22))], fill=(40, 40, 60), width=4)
            d.ellipse((w * 0.45, h * 0.7, w * 0.55, h * 0.82), fill=(240, 245, 180))

    if "wheel" in kind:
        cx, cy, r = w // 2, int(h * 0.48), 180
        colors = [(200, 80, 70), (70, 140, 200), (220, 180, 60), (90, 160, 90), (160, 100, 180), (230, 140, 80)]
        for i in range(8):
            ang0 = i * 45
            # approximate wedges with pies via polygon
            pts = [(cx, cy)]
            for a in range(ang0, ang0 + 46, 5):
                rad = math.radians(a - 90)
                pts.append((cx + r * math.cos(rad), cy + r * math.sin(rad)))
            d.polygon(pts, fill=colors[i % len(colors)])
        d.ellipse((cx - 30, cy - 30, cx + 30, cy + 30), fill=(240, 220, 180))

    if "cracked-moon" in kind or "window-cracked" in kind:
        img = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.ellipse((80, 80, 430, 430), fill=(235, 235, 220, 230))
        d.line([(200, 100), (280, 380)], fill=(60, 60, 80, 255), width=6)
        d.line([(250, 200), (360, 240)], fill=(60, 60, 80, 255), width=4)
        img = img.filter(ImageFilter.SMOOTH)
        img.save(path)
        return

    if "portrait" in kind or any(x in kind for x in ["mara", "tock", "before", "orra", "ember", "moss", "sky", "stone", "spriggle", "glim", "pebbit"]):
        img = gradient((768, 768), (210, 190, 160), (120, 100, 80))
        d = ImageDraw.Draw(img)
        # soft vignette circle
        d.ellipse((120, 80, 650, 700), fill=(190, 160, 130))
        # head
        skin = {
            "ember": (140, 95, 70),
            "moss": (90, 60, 40),
            "sky": (210, 175, 145),
            "stone": (175, 140, 110),
            "mara": (200, 160, 130),
            "tock": (180, 150, 120),
            "before": (190, 155, 125),
            "orra": (165, 130, 105),
            "spriggle": (245, 230, 200),
            "glim": (40, 55, 110),
            "pebbit": (100, 120, 70),
        }
        sk = next((v for k, v in skin.items() if k in kind), (180, 140, 110))
        d.ellipse((260, 180, 520, 460), fill=sk)
        # coat / body
        coat = accent if "explorer" not in kind else mid
        coats = {
            "ember": (184, 92, 56),
            "moss": (74, 99, 53),
            "sky": (61, 110, 165),
            "stone": (107, 94, 82),
        }
        coat = next((v for k, v in coats.items() if k in kind), coat)
        d.ellipse((200, 420, 580, 760), fill=coat)
        # eyes
        d.ellipse((330, 300, 360, 330), fill=(30, 25, 20))
        d.ellipse((420, 300, 450, 330), fill=(30, 25, 20))
        if "spriggle" in kind:
            d.ellipse((360, 120, 420, 200), fill=(90, 150, 70))  # sprout
            d.rectangle((340, 400, 440, 480), fill=(60, 120, 70))  # backpack
        if "glim" in kind:
            d.ellipse((300, 250, 480, 420), fill=(50, 70, 140))
            for gx in range(320, 460, 30):
                d.ellipse((gx, 300, gx + 10, 310), fill=(180, 220, 255))
        if "pebbit" in kind:
            d.ellipse((280, 260, 500, 500), fill=(110, 130, 80))
            d.ellipse((340, 220, 370, 250), fill=(220, 120, 140))  # flower

    img = noise(img.convert("RGB"))
    img = ImageEnhance.Color(img).enhance(1.15)
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img = vignette(img, 0.25)
    img.save(path, quality=92)


def item_icon(path: Path, name: str, colour):
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((8, 8, 120, 120), radius=24, fill=(*colour, 255))
    d.ellipse((30, 30, 98, 98), fill=(255, 250, 240, 220))
    # unique mark
    h = abs(hash(name)) % 5
    if h == 0:
        d.rectangle((48, 40, 80, 90), fill=colour)
    elif h == 1:
        d.ellipse((44, 44, 84, 84), fill=colour)
    elif h == 2:
        d.polygon([(64, 36), (90, 88), (38, 88)], fill=colour)
    elif h == 3:
        d.chord((40, 40, 88, 88), 0, 180, fill=colour)
    else:
        d.rounded_rectangle((44, 36, 84, 92), radius=8, fill=colour)
    img = img.filter(ImageFilter.SMOOTH)
    img.save(path)


def main():
    scenes = {
        "backwards-town/town-square-base.png": "town",
        "backwards-town/bakery-interior.png": "bakery",
        "backwards-town/wheel-room.png": "wheel",
        "backwards-town/general-store.png": "store",
        "backwards-town/arcade-hall.png": "arcade",
        "home/tower-room.png": "home",
        "map/the-between.png": "map",
        "adventure/observatory.png": "observatory",
        "adventure/fragment-path.png": "path",
        "home/window-cracked-moon.png": "window-cracked-moon",
        "backwards-town/sky-cracked-moon.png": "cracked-moon-sky",
        "backwards-town/mara-crumb.png": "portrait-mara",
        "backwards-town/tock.png": "portrait-tock",
        "backwards-town/mr-before.png": "portrait-before",
        "adventure/orra-vale.png": "portrait-orra",
        "companions/spriggle-idle.png": "portrait-spriggle",
        "companions/glim-idle.png": "portrait-glim",
        "companions/pebbit-idle.png": "portrait-pebbit",
        "explorers/ember-trail.png": "portrait-ember",
        "explorers/moss-path.png": "portrait-moss",
        "explorers/sky-thread.png": "portrait-sky",
        "explorers/stone-song.png": "portrait-stone",
    }
    for rel, kind in scenes.items():
        paint_scene(ART / rel, kind)
        print("scene", rel)

    items = {
        "yesterdays-bun": (210, 150, 80),
        "pocket-crumb": (180, 130, 70),
        "jam-unopened": (180, 60, 80),
        "backwards-biscuit": (200, 160, 100),
        "empty-pie-recipe": (240, 230, 200),
        "clock-hand": (120, 120, 130),
        "rewind-token": (200, 170, 60),
        "tiny-tomorrow": (160, 200, 230),
        "small-lantern": (240, 190, 80),
        "crooked-rug": (140, 70, 60),
        "button-jar": (100, 150, 160),
        "companion-snack": (230, 180, 120),
        "town-poster": (90, 130, 100),
        "clockwork-hat": (70, 70, 90),
        "empty-map-frame": (150, 120, 80),
        "couriers-rewind-cap": (80, 100, 140),
        "moon-fragment": (220, 230, 180),
        "unbaked-loaf": (230, 200, 150),
    }
    for name, col in items.items():
        item_icon(ART / "items" / f"{name}.png", name, col)
        print("item", name)

    # PWA icons from homepage colours
    for size in (192, 512):
        icon = gradient((size, size), (90, 140, 180), (60, 100, 60))
        d = ImageDraw.Draw(icon)
        m = size // 6
        d.ellipse((m, m, size - m, size - m), fill=(243, 230, 207))
        d.ellipse((size // 3, size // 4, size * 2 // 3, size // 2), fill=(200, 80, 70))
        ICONS.mkdir(parents=True, exist_ok=True)
        icon.save(ICONS / f"icon-{size}.png")

    # moon overlays sized
    paint_scene(ART / "home" / "window-cracked-moon.png", "window-cracked-moon", (512, 512))
    paint_scene(ART / "backwards-town" / "sky-cracked-moon.png", "cracked-moon-sky", (768, 512))

    print("done")


if __name__ == "__main__":
    main()
