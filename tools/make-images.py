"""Generira OG slike (1200×630) i ikone u public/img/.

Pokretanje:  python3 tools/make-images.py
Potrebno:    pip install pillow fonttools brotli
"""
import io
import math
import os

from fontTools.ttLib import TTFont
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "public", "fonts")
OUT = os.path.join(ROOT, "public", "img")

NAVY = (10, 35, 68)
BLUE = (0, 104, 181)
CYAN = (0, 160, 227)
SKY = (238, 245, 251)
SKY_2 = (220, 235, 247)
WHITE = (255, 255, 255)
MUTED = (88, 101, 121)


# ---------- fontovi (woff2 → TTF u memoriji, latin + latin-ext) ----------
def load_ttf(name):
    font = TTFont(os.path.join(FONTS, name))
    font.flavor = None
    buf = io.BytesIO()
    font.save(buf)
    cmap = set(font.getBestCmap().keys())
    return buf.getvalue(), cmap


SANS = [load_ttf("montserrat-latin-wght-normal.woff2"), load_ttf("montserrat-latin-ext-wght-normal.woff2")]


def make_fonts(family, size, weight=None):
    out = []
    for data, cmap in family:
        f = ImageFont.truetype(io.BytesIO(data), size)
        if weight is not None:
            f.set_variation_by_axes([weight])
        out.append((f, cmap))
    return out


def text(draw, xy, s, fonts, fill, tracking=0.0):
    """Crta tekst znak po znak s fallbackom latin → latin-ext (bez raqm-a). Vraća širinu."""
    x, y = xy
    size = fonts[0][0].size
    for ch in s:
        font = next((f for f, cmap in fonts if ord(ch) in cmap), fonts[0][0])
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking * size
    return x - xy[0]


def measure(s, fonts, tracking=0.0):
    size = fonts[0][0].size
    w = 0
    for ch in s:
        font = next((f for f, cmap in fonts if ord(ch) in cmap), fonts[0][0])
        w += font.getlength(ch) + tracking * size
    return w


# ---------- grafički elementi ----------
def icon(size, pad=0.0, radius=0.18):
    """Ikona: tamnoplavi kvadrat sa slovom „e“ (rezervna ikona; na stranici se koristi EMSO logo)."""
    S = size * 4
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    p = int(S * pad)
    d.rounded_rectangle([p, p, S - p, S - p], radius=int((S - 2 * p) * radius), fill=NAVY)
    f = make_fonts(SANS, int((S - 2 * p) * 0.78), 800)
    w = measure("e", f)
    font = f[0][0]
    bbox = font.getbbox("e")
    x = (S - w) / 2
    y = (S - (bbox[3] + bbox[1])) / 2
    text(d, (x, y), "e", f, WHITE)
    d.rectangle([p + (S - 2 * p) * 0.2, S - p - (S - 2 * p) * 0.16, S - p - (S - 2 * p) * 0.2, S - p - (S - 2 * p) * 0.12], fill=CYAN)
    return im.resize((size, size), Image.LANCZOS)


def panel_pattern(im, box):
    """Mreža solarnih ćelija u svijetloplavoj boji (desna strana OG slike)."""
    x0, y0, x1, y1 = box
    d = ImageDraw.Draw(im)
    d.rectangle(box, fill=SKY)
    pw, ph, gap = 118, 176, 10
    y = y0 + 40
    while y < y1:
        x = x0 + 40
        while x < x1:
            d.rectangle([x, y, x + pw, y + ph], fill=WHITE, outline=SKY_2, width=2)
            for i in range(1, 4):
                d.line([(x + pw * i / 4, y), (x + pw * i / 4, y + ph)], fill=SKY_2, width=1)
            for j in range(1, 6):
                d.line([(x, y + ph * j / 6), (x + pw, y + ph * j / 6)], fill=SKY_2, width=1)
            x += pw + gap
        y += ph + gap


def og(filename, title, sub, chips):
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), WHITE)
    panel_pattern(im, (780, 0, W, H))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 12, H], fill=BLUE)
    # logo (tekstualno)
    word = make_fonts(SANS, 40, 800)
    text(d, (72, 62), "EMSO", word, NAVY)
    small = make_fonts(SANS, 18, 600)
    text(d, (74, 112), "e-mobility solutions", small, BLUE)
    # naslov u više redova
    h1 = make_fonts(SANS, 64, 700)
    y = 200
    for line in title:
        text(d, (70, y), line, h1, NAVY, tracking=-0.02)
        y += 78
    subf = make_fonts(SANS, 25, 500)
    text(d, (72, y + 14), sub, subf, MUTED)
    chipf = make_fonts(SANS, 20, 600)
    x = 72
    for c in chips:
        w = measure(c, chipf) + 32
        d.rounded_rectangle([x, 520, x + w, 562], radius=4, fill=SKY, outline=SKY_2)
        text(d, (x + 16, 529), c, chipf, NAVY)
        x += w + 10
    im.save(os.path.join(OUT, filename), optimize=True)
    print("✓", filename)


def icons():
    icon(32).save(os.path.join(OUT, "favicon-32.png"), optimize=True)
    icon(192).save(os.path.join(OUT, "icon-192.png"), optimize=True)
    icon(512).save(os.path.join(OUT, "icon-512.png"), optimize=True)
    icon(512, pad=0.0, radius=0).save(os.path.join(OUT, "icon-512-maskable.png"), optimize=True)
    icon(180, radius=0).convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
    print("✓ ikone")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    icons()
    og(
        "og-solarne-elektrane.png",
        ["Solarne elektrane", "ključ u ruke"],
        "Savjetovanje i ponuda besplatno. Montaža u 1 dan.",
        ["2.074 elektrane", "Partner E.ON-a", "Kalkulator uštede"],
    )
    og(
        "og-elektro-punionice.png",
        ["Elektro punionice", "ključ u ruke"],
        "Kućne, poslovne i javne punionice. Projekt, montaža, servis.",
        ["Partner HT-a", "ETREL", "Kalkulator punjenja"],
    )
    og(
        "og-poticaji-2026.png",
        ["Poticaji za solarne", "elektrane 2026."],
        "FZOEU: do 50 % sufinanciranja, do 6.000 € za elektranu.",
        ["Kalkulator poticaja", "Uvjeti i iznosi", "0 % PDV"],
    )
