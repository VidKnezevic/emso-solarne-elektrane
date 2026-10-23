"""Generira OG slike (1200×630) i ikone u src/assets/img/.

Pokretanje:  python3 tools/make-images.py
Potrebno:    pip install pillow fonttools brotli
"""
import io
import math
import os

from fontTools.ttLib import TTFont
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "src", "assets", "fonts")
OUT = os.path.join(ROOT, "src", "assets", "img")

NAVY_950 = (2, 10, 24)
NAVY_900 = (5, 21, 48)
CYAN = (0, 160, 227)
SUN = (255, 176, 32)
SUN_300 = (255, 210, 122)
WHITE = (255, 255, 255)
MUTED = (184, 192, 205)


# ---------- fontovi (woff2 → TTF u memoriji, latin + latin-ext) ----------
def load_ttf(name):
    font = TTFont(os.path.join(FONTS, name))
    font.flavor = None
    buf = io.BytesIO()
    font.save(buf)
    cmap = set(font.getBestCmap().keys())
    return buf.getvalue(), cmap


SANS = [load_ttf("inter-tight-latin-wght-normal.woff2"), load_ttf("inter-tight-latin-ext-wght-normal.woff2")]
SERIF = [load_ttf("instrument-serif-latin-400-italic.woff2"), load_ttf("instrument-serif-latin-ext-400-italic.woff2")]


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
def logo_mark(size, bg=None, pad=0.0):
    """EMSO znak: krug s izlazećim suncem i panelima (crtano 4× pa smanjeno)."""
    S = size * 4
    im = Image.new("RGBA", (S, S), bg + (255,) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    p = S * pad
    r = (S - 2 * p) / 2
    cx = cy = S / 2
    k = (2 * r) / 40  # viewBox 40×40
    ox, oy = cx - r, cy - r
    d.ellipse([ox, oy, ox + 2 * r, oy + 2 * r], fill=CYAN)
    # polukrug sunca
    d.pieslice([ox + 10.5 * k, oy + 15.5 * k, ox + 29.5 * k, oy + 34.5 * k], 180, 360, fill=WHITE)
    lw = max(2, int(2.4 * k))
    for (x1, y1, x2, y2), col in [
        ((8, 29, 32, 29), WHITE),
        ((12, 33, 28, 33), WHITE),
        ((20, 7.5, 20, 11), SUN_300),
        ((11.6, 11.4, 14, 13.8), SUN_300),
        ((28.4, 11.4, 26, 13.8), SUN_300),
    ]:
        d.line([ox + x1 * k, oy + y1 * k, ox + x2 * k, oy + y2 * k], fill=col, width=lw)
        for (px, py) in ((x1, y1), (x2, y2)):
            d.ellipse([ox + px * k - lw / 2, oy + py * k - lw / 2, ox + px * k + lw / 2, oy + py * k + lw / 2], fill=col)
    return im.resize((size, size), Image.LANCZOS)


def background(W, H):
    im = Image.new("RGB", (W, H), NAVY_950)
    bd = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        bd.line([(0, y), (W, y)], fill=tuple(int(NAVY_950[i] + (NAVY_900[i] + 6 - NAVY_950[i]) * t) for i in range(3)))
    # sunčev sjaj
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse([W - 470, -330, W + 170, 310], fill=(255, 176, 32, 150))
    g.ellipse([W - 330, -200, W + 30, 160], fill=(255, 225, 160, 200))
    glow = glow.filter(ImageFilter.GaussianBlur(70))
    im.paste(glow, (0, 0), glow)
    cyan = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(cyan).ellipse([-300, H - 200, 500, H + 400], fill=(0, 160, 227, 90))
    cyan = cyan.filter(ImageFilter.GaussianBlur(90))
    im.paste(cyan, (0, 0), cyan)
    return im


def panel_field(im):
    """Polje solarnih panela u perspektivi na dnu slike."""
    W, H = im.size
    S = 2
    layer = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    vx, vy = W * 0.62 * S, H * 0.62 * S
    f = 260 * S

    def proj(X, Z):
        return (vx + X * f / Z, vy + f * 0.95 / Z)

    pw, ph, gap = 1.7, 1.0, 0.1
    for row in range(0, 26):
        z0 = 1.0 + row * (ph + gap) * 0.55
        z1 = z0 + ph * 0.55
        if z0 > 12:
            break
        fade = max(0.0, 1 - (z0 - 1) / 9)
        for col in range(-18, 19):
            x0 = col * (pw + gap)
            x1 = x0 + pw
            quad = [proj(x0, z0), proj(x1, z0), proj(x1, z1), proj(x0, z1)]
            if all(p[1] > H * S + 50 for p in quad):
                continue
            shade = 0.55 + 0.45 * fade
            c = (int(22 * shade + 10), int(70 * shade + 12), int(150 * shade + 18), int(255 * (0.25 + 0.75 * fade)))
            d.polygon(quad, fill=c)
            line = (150, 210, 255, int(90 * fade))
            for i in range(1, 6):
                a = proj(x0 + pw * i / 6, z0)
                b = proj(x0 + pw * i / 6, z1)
                d.line([a, b], fill=line, width=1)
            for j in range(1, 3):
                zz = z0 + (z1 - z0) * j / 3
                d.line([proj(x0, zz), proj(x1, zz)], fill=line, width=1)
    layer = layer.resize((W, H), Image.LANCZOS)
    # refleksija sunca na panelima (samo tamo gdje su paneli)
    refl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(refl).ellipse([W * 0.58, H * 0.62, W * 1.02, H * 1.02], fill=(255, 170, 70, 70))
    refl = refl.filter(ImageFilter.GaussianBlur(60))
    refl.putalpha(ImageChops.multiply(refl.split()[3], layer.split()[3]))
    # meki prijelaz prema horizontu: alfa maska po visini
    ramp = Image.new("L", (W, H), 0)
    rd = ImageDraw.Draw(ramp)
    y0, y1 = int(H * 0.6), int(H * 0.86)
    for y in range(y0, H):
        rd.line([(0, y), (W, y)], fill=int(255 * min(1, (y - y0) / (y1 - y0)) ** 1.4))
    for l in (layer, refl):
        l.putalpha(ImageChops.multiply(l.split()[3], ramp))
        im.paste(l, (0, 0), l)


def og(filename, line1, line2, sub, chips):
    W, H = 1200, 630
    im = background(W, H)
    panel_field(im)
    d = ImageDraw.Draw(im)
    # logo
    mark = logo_mark(56)
    im.paste(mark, (72, 64), mark)
    word = make_fonts(SANS, 34, 800)
    text(d, (140, 70), "EMSO", word, WHITE, tracking=-0.03)
    small = make_fonts(SANS, 13, 600)
    d.line([(244, 72), (244, 112)], fill=(255, 255, 255, 60), width=1)
    text(d, (256, 76), "E-MOBILITY", small, (170, 178, 190), tracking=0.06)
    text(d, (256, 94), "SOLUTIONS", small, (170, 178, 190), tracking=0.06)
    # naslov
    h1 = make_fonts(SANS, 84, 760)
    text(d, (68, 168), line1, h1, WHITE, tracking=-0.045)
    serif = make_fonts(SERIF, 92)
    # sunčani gradijent za drugi red
    w2 = int(measure(line2, serif, -0.01)) + 20
    txt = Image.new("L", (w2, 120), 0)
    text(ImageDraw.Draw(txt), (0, 0), line2, serif, 255, tracking=-0.01)
    grad = Image.new("RGB", (w2, 120))
    gd = ImageDraw.Draw(grad)
    for x in range(w2):
        t = x / max(1, w2 - 1)
        c = tuple(int(a + (b - a) * t) for a, b in zip((255, 217, 138), (255, 122, 26)))
        gd.line([(x, 0), (x, 120)], fill=c)
    im.paste(grad, (70, 258), txt)
    # podnaslov
    subf = make_fonts(SANS, 27, 450)
    text(d, (72, 386), sub, subf, MUTED, tracking=-0.005)
    # čipovi
    chipf = make_fonts(SANS, 21, 650)
    x = 72
    for c in chips:
        w = measure(c, chipf) + 40
        chip = Image.new("RGBA", (int(w), 46), (0, 0, 0, 0))
        ImageDraw.Draw(chip).rounded_rectangle([0, 0, w - 1, 45], radius=23, fill=(255, 255, 255, 26), outline=(255, 255, 255, 60))
        im.paste(chip, (int(x), 470), chip)
        text(d, (x + 20, 480), c, chipf, WHITE)
        x += w + 12
    im.save(os.path.join(OUT, filename), optimize=True)
    print("✓", filename)


def icons():
    logo_mark(512).save(os.path.join(OUT, "emso-logo-512.png"), optimize=True)
    logo_mark(32).save(os.path.join(OUT, "favicon-32.png"), optimize=True)
    logo_mark(192, bg=NAVY_950, pad=0.12).save(os.path.join(OUT, "icon-192.png"), optimize=True)
    logo_mark(512, bg=NAVY_950, pad=0.12).save(os.path.join(OUT, "icon-512.png"), optimize=True)
    logo_mark(512, bg=NAVY_950, pad=0.22).save(os.path.join(OUT, "icon-512-maskable.png"), optimize=True)
    logo_mark(180, bg=NAVY_950, pad=0.14).convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"), optimize=True)
    print("✓ ikone")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    icons()
    og(
        "og-solarne-elektrane.png",
        "Solarne elektrane",
        "ključ u ruke",
        "Besplatno savjetovanje i ponuda · montaža u 1 dan · jamstvo do 25 god.",
        ["2.074 elektrane", "Partner E.ON-a", "Kalkulator uštede"],
    )
    og(
        "og-elektro-punionice.png",
        "Punionice za vozila",
        "ključ u ruke",
        "Kućne, poslovne i javne punionice · projekt, montaža i servis",
        ["Partner HT-a", "ETREL", "Kalkulator punjenja"],
    )
    og(
        "og-poticaji-2026.png",
        "Poticaji 2026.",
        "do 50 % sufinanciranja",
        "FZOEU: do 6.000 € za elektranu · do 5.600 € za bateriju · 0 % PDV",
        ["Kalkulator poticaja", "Uvjeti i iznosi", "Neto obračun"],
    )
