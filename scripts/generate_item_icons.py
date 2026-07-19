"""Generate soft-painted item icons for The World game."""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "art" / "items"
ICON = ROOT / "public" / "icons"
SIZE = 128
random.seed(42)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(3))


def radial_bg(draw: ImageDraw.ImageDraw, colors: tuple[tuple[int, int, int], ...]) -> None:
    cx, cy = SIZE // 2, SIZE // 2
    for y in range(SIZE):
        for x in range(SIZE):
            d = math.hypot(x - cx, y - cy) / (SIZE * 0.72)
            t = min(1.0, d)
            if len(colors) == 2:
                c = mix(colors[0], colors[1], t)
            else:
                if t < 0.5:
                    c = mix(colors[0], colors[1], t * 2)
                else:
                    c = mix(colors[1], colors[2], (t - 0.5) * 2)
            draw.point((x, y), fill=c + (255,))


def soft_ellipse(draw, box, fill, outline=None, width=2):
    draw.ellipse(box, fill=fill, outline=outline, width=width)


def save_icon(img: Image.Image, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    softened = img.filter(ImageFilter.GaussianBlur(radius=0.6))
    out = Image.alpha_composite(
        Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0)), softened
    )
    out.save(OUT / f"{name}.png", "PNG")


def icon_yesterdays_bun() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((255, 236, 210), (245, 200, 150), (220, 170, 120)))
    soft_ellipse(draw, (28, 38, 100, 96), (235, 190, 130), (200, 150, 95), 3)
    soft_ellipse(draw, (36, 46, 92, 88), (250, 215, 165))
    for i in range(5):
        x = 44 + i * 10
        draw.arc((x - 8, 52, x + 8, 72), 200, 340, fill=(210, 160, 100), width=2)
    return img


def icon_pocket_crumb() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((240, 225, 200), (210, 185, 150)))
    draw.polygon([(30, 70), (98, 70), (88, 98), (40, 98)], fill=(170, 130, 90), outline=(130, 95, 60))
    draw.polygon([(34, 70), (94, 70), (90, 78), (38, 78)], fill=(190, 155, 115))
    for x, y in [(52, 82), (68, 86), (58, 90), (74, 80)]:
        soft_ellipse(draw, (x - 5, y - 4, x + 5, y + 4), (220, 180, 120))
    return img


def icon_jam_unopened() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((255, 230, 220), (230, 190, 180)))
    draw.rounded_rectangle((42, 36, 86, 98), radius=8, fill=(180, 60, 70), outline=(130, 40, 50), width=2)
    draw.rectangle((48, 28, 80, 40), fill=(220, 210, 190), outline=(170, 150, 120))
    draw.ellipse((54, 52, 74, 72), fill=(140, 30, 45))
    draw.line([(58, 56), (70, 68)], fill=(180, 80, 90), width=2)
    return img


def icon_backwards_biscuit() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((255, 245, 220), (230, 200, 160)))
    draw.rounded_rectangle((30, 44, 98, 88), radius=14, fill=(215, 175, 120), outline=(175, 130, 80), width=3)
    for x in range(38, 92, 12):
        for y in range(52, 82, 12):
            soft_ellipse(draw, (x - 2, y - 2, x + 2, y + 2), (190, 145, 90))
    draw.arc((40, 48, 88, 84), 300, 120, fill=(160, 110, 60), width=2)
    return img


def icon_empty_pie_recipe() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((250, 240, 225), (220, 205, 185)))
    draw.rounded_rectangle((34, 28, 94, 100), radius=6, fill=(245, 235, 215), outline=(190, 170, 140), width=2)
    for y in range(40, 92, 10):
        draw.line([(42, y), (86, y)], fill=(210, 195, 175), width=1)
    draw.line([(50, 48), (78, 48)], fill=(200, 180, 160), width=3)
    draw.line([(50, 60), (72, 60)], fill=(200, 180, 160), width=3)
    draw.line([(50, 72), (64, 72)], fill=(200, 180, 160), width=3)
    return img


def icon_clock_hand() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((230, 225, 210), (190, 185, 170)))
    soft_ellipse(draw, (24, 24, 104, 104), (250, 245, 230), (180, 170, 150), 3)
    soft_ellipse(draw, (34, 34, 94, 94), (240, 235, 220))
    draw.line([(64, 64), (64, 38)], fill=(60, 60, 70), width=4)
    draw.line([(64, 64), (86, 74)], fill=(100, 80, 50), width=3)
    soft_ellipse(draw, (58, 58, 70, 70), (180, 150, 80))
    return img


def icon_rewind_token() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((220, 235, 255), (170, 190, 230)))
    soft_ellipse(draw, (26, 26, 102, 102), (80, 140, 210), (50, 90, 160), 3)
    draw.polygon([(78, 64), (48, 48), (48, 80)], fill=(230, 240, 255))
    draw.polygon([(50, 64), (80, 48), (80, 80)], fill=(180, 210, 245))
    return img


def icon_tiny_tomorrow() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((255, 240, 200), (255, 200, 140), (240, 160, 100)))
    soft_ellipse(draw, (30, 30, 98, 98), (255, 220, 120), (240, 180, 80), 2)
    for i in range(8):
        ang = i * math.pi / 4
        x1 = 64 + math.cos(ang) * 22
        y1 = 64 + math.sin(ang) * 22
        x2 = 64 + math.cos(ang) * 34
        y2 = 64 + math.sin(ang) * 34
        draw.line([(x1, y1), (x2, y2)], fill=(255, 240, 180), width=3)
    return img


def icon_small_lantern() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((255, 230, 180), (200, 160, 100)))
    draw.rectangle((58, 24, 70, 34), fill=(100, 80, 50))
    draw.polygon([(46, 34), (82, 34), (76, 88), (52, 88)], fill=(220, 160, 60), outline=(160, 100, 40))
    draw.rectangle((54, 88, 74, 96), fill=(120, 90, 50))
    draw.line([(64, 96), (64, 108)], fill=(90, 70, 40), width=3)
    draw.ellipse((56, 48, 72, 72), fill=(255, 220, 120))
    return img


def icon_crooked_rug() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((230, 215, 195), (190, 170, 150)))
    draw.polygon([(24, 78), (96, 62), (104, 92), (32, 108)], fill=(160, 80, 70), outline=(120, 50, 45))
    for i in range(4):
        y = 68 + i * 10
        draw.line([(30 + i * 2, y), (98 - i, y + 4)], fill=(200, 120, 100), width=2)
    draw.polygon([(40, 82), (88, 70), (92, 86), (44, 98)], fill=(140, 60, 55))
    return img


def icon_button_jar() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((240, 235, 225), (210, 200, 185)))
    draw.rounded_rectangle((36, 40, 92, 104), radius=10, fill=(200, 220, 235, 180), outline=(150, 170, 190), width=2)
    colors = [(200, 60, 60), (60, 120, 200), (220, 180, 50), (100, 180, 100), (180, 100, 180)]
    positions = [(52, 58), (72, 56), (60, 72), (78, 78), (48, 84), (66, 90)]
    for (x, y), c in zip(positions, colors):
        soft_ellipse(draw, (x - 6, y - 6, x + 6, y + 6), c, (80, 80, 80), 1)
        draw.line([(x - 2, y), (x + 2, y)], fill=(255, 255, 255, 120), width=1)
    return img


def icon_companion_snack() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((230, 250, 220), (180, 210, 160)))
    draw.rounded_rectangle((34, 50, 94, 78), radius=8, fill=(120, 170, 80), outline=(80, 120, 50), width=2)
    soft_ellipse(draw, (44, 56, 58, 70), (255, 200, 100))
    soft_ellipse(draw, (58, 54, 72, 68), (255, 160, 80))
    soft_ellipse(draw, (72, 58, 86, 72), (200, 120, 60))
    draw.line([(38, 50), (90, 50)], fill=(90, 140, 60), width=2)
    return img


def icon_town_poster() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((235, 225, 210), (200, 185, 165)))
    draw.rectangle((38, 28, 90, 96), fill=(240, 120, 80), outline=(180, 80, 50), width=2)
    draw.polygon([(38, 28), (90, 28), (86, 36), (42, 36)], fill=(250, 200, 160))
    draw.rectangle((48, 44, 80, 56), fill=(255, 220, 180))
    draw.polygon([(48, 62), (80, 62), (76, 84), (52, 84)], fill=(100, 160, 200))
    draw.line([(64, 28), (64, 20)], fill=(120, 90, 60), width=2)
    return img


def icon_clockwork_hat() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((220, 215, 205), (180, 175, 165)))
    draw.polygon([(24, 72), (104, 72), (96, 84), (32, 84)], fill=(100, 90, 80))
    draw.rounded_rectangle((36, 36, 92, 72), radius=10, fill=(140, 110, 70), outline=(90, 70, 40), width=2)
    soft_ellipse(draw, (52, 48, 76, 72), (180, 150, 90), (120, 90, 50), 2)
    draw.rectangle((60, 30, 68, 38), fill=(160, 130, 80))
    return img


def icon_empty_map_frame() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((235, 225, 205), (200, 185, 160)))
    draw.rectangle((28, 32, 100, 96), fill=(160, 120, 70), outline=(120, 85, 45), width=4)
    draw.rectangle((36, 40, 92, 88), fill=(240, 230, 210))
    draw.line([(40, 52), (88, 52)], fill=(210, 195, 175), width=1)
    draw.line([(40, 64), (80, 64)], fill=(210, 195, 175), width=1)
    draw.line([(40, 76), (70, 76)], fill=(210, 195, 175), width=1)
    return img


def icon_couriers_rewind_cap() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((210, 225, 240), (160, 180, 210)))
    draw.polygon([(30, 70), (98, 70), (88, 92), (40, 92)], fill=(70, 110, 170))
    draw.rounded_rectangle((34, 38, 94, 72), radius=12, fill=(90, 130, 190), outline=(50, 80, 140), width=2)
    draw.polygon([(48, 38), (80, 38), (64, 24)], fill=(110, 150, 210))
    draw.arc((52, 48, 76, 68), 300, 120, fill=(180, 210, 255), width=2)
    return img


def icon_moon_fragment() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((30, 35, 60), (15, 20, 40)))
    soft_ellipse(draw, (28, 28, 100, 100), (230, 235, 245), (180, 190, 210), 2)
    draw.line([(48, 42), (72, 88)], fill=(120, 130, 160), width=3)
    draw.line([(56, 50), (78, 78)], fill=(100, 110, 140), width=2)
    draw.ellipse((70, 36, 82, 48), fill=(255, 240, 180))
    return img


def icon_unbaked_loaf() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radial_bg(draw, ((255, 240, 220), (230, 210, 185)))
    soft_ellipse(draw, (26, 50, 102, 92), (245, 225, 195), (210, 185, 155), 3)
    draw.arc((34, 54, 94, 88), 190, 350, fill=(220, 195, 165), width=3)
    for x in range(40, 90, 10):
        draw.line([(x, 58), (x + 4, 66)], fill=(230, 210, 180), width=2)
    draw.rectangle((44, 88, 84, 98), fill=(190, 160, 120))
    return img


def make_pwa_icons() -> None:
    src = ICON / "icon-512.png"
    if not src.exists():
        return
    base = Image.open(src).convert("RGBA")
    base.resize((192, 192), Image.Resampling.LANCZOS).save(ICON / "icon-192.png", "PNG")


def main() -> None:
    icons = {
        "yesterdays-bun": icon_yesterdays_bun,
        "pocket-crumb": icon_pocket_crumb,
        "jam-unopened": icon_jam_unopened,
        "backwards-biscuit": icon_backwards_biscuit,
        "empty-pie-recipe": icon_empty_pie_recipe,
        "clock-hand": icon_clock_hand,
        "rewind-token": icon_rewind_token,
        "tiny-tomorrow": icon_tiny_tomorrow,
        "small-lantern": icon_small_lantern,
        "crooked-rug": icon_crooked_rug,
        "button-jar": icon_button_jar,
        "companion-snack": icon_companion_snack,
        "town-poster": icon_town_poster,
        "clockwork-hat": icon_clockwork_hat,
        "empty-map-frame": icon_empty_map_frame,
        "couriers-rewind-cap": icon_couriers_rewind_cap,
        "moon-fragment": icon_moon_fragment,
        "unbaked-loaf": icon_unbaked_loaf,
    }
    for name, fn in icons.items():
        save_icon(fn(), name)
        print(f"created {name}.png")
    make_pwa_icons()
    print("created icon-192.png")


if __name__ == "__main__":
    main()
