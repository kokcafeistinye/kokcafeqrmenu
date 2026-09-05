# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import cv2, numpy as np

URL = "https://claude.ai/code/artifact/276b5bd5-b091-4b5d-80a2-7950b0e6a599"
LOGO = "/root/.claude/uploads/22531db1-0bdf-5b67-a2fa-a2178405ad5d/8487a6ac-image.png"

p = cv2.QRCodeEncoder_Params()
p.correction_level = cv2.QRCodeEncoder_CORRECT_LEVEL_Q
grid = (np.array(cv2.QRCodeEncoder_create(p).encode(URL)) == 0).astype(int)
n = len(grid)
det = cv2.QRCodeDetector()

def draw(g, module, quiet=4, fg=(0,0,0), bg=(255,255,255)):
    k = len(g); side = (k + quiet*2) * module
    im = Image.new("RGB", (side, side), bg); d = ImageDraw.Draw(im)
    for r in range(k):
        for c in range(k):
            if g[r][c]:
                x = (c+quiet)*module; y = (r+quiet)*module
                d.rectangle([x, y, x+module-1, y+module-1], fill=fg)
    return im

draw(grid, 40).save("kok-qr.png")

MM = 300/25.4
W, H = int(105*MM), int(148*MM)
STONE=(240,237,230); INK=(34,31,25); GOLD=(130,104,61); MUTED=(128,122,108)
DV = "/usr/share/fonts/truetype/dejavu/"
GF = "/usr/share/fonts/truetype/google-fonts/"
serif_i = ImageFont.truetype(GF+"Lora-Italic-Variable.ttf", 38)
sans    = ImageFont.truetype(DV+"DejaVuSans.ttf", 26)
sans_b  = ImageFont.truetype(DV+"DejaVuSans-Bold.ttf", 30)
small   = ImageFont.truetype(DV+"DejaVuSans.ttf", 23)

card = Image.new("RGB", (W, H), STONE)
d = ImageDraw.Draw(card); cx = W//2

def tracked(dr, cx, y, text, font, fill, track):
    ws = [dr.textlength(ch, font=font) for ch in text]
    x = cx - (sum(ws) + track*(len(text)-1))/2
    for ch, w in zip(text, ws):
        dr.text((x, y), ch, font=font, fill=fill); x += w + track

def centered(dr, cx, y, text, font, fill):
    dr.text((cx - dr.textlength(text, font=font)/2, y), text, font=font, fill=fill)

# logo (beyaz zemin kaldırılıp marka altınıyla basılıyor)
lg = Image.open(LOGO).convert("RGB")
arr = np.asarray(lg).astype(np.int16)
alpha = np.clip((255 - arr.min(axis=2)) * 1.15, 0, 255).astype(np.uint8)
mask = Image.fromarray(alpha, "L")
mask = mask.crop(mask.point(lambda v: 255 if v > 8 else 0).getbbox())
lw = 700; lh = round(mask.height * lw / mask.width)
mask = mask.resize((lw, lh), Image.LANCZOS)
gold = Image.new("RGB", (lw, lh), GOLD)
card.paste(gold, (cx - lw//2, 108), mask)

ly = 108 + lh + 36
d.line([(cx-90, ly), (cx+90, ly)], fill=(196,190,172), width=2)

qsize = 610; qy = ly + 44
qim = draw(grid, max(1, qsize//(n+8)), quiet=4).resize((qsize, qsize), Image.NEAREST)
d.rounded_rectangle([cx-qsize//2-26, qy-26, cx+qsize//2+26, qy+qsize+26], radius=10, fill=(255,255,255))
card.paste(qim, (cx-qsize//2, qy))

y = qy + qsize + 72
tracked(d, cx, y, "MENÜ", sans_b, GOLD, 14)
tracked(d, cx, y+46, "MENU", sans_b, GOLD, 14)
centered(d, cx, y+112, "Kamerayı QR koda tutun", serif_i, INK)
centered(d, cx, y+160, "Point your camera at the QR code", serif_i, INK)
tracked(d, cx, H-92, "TÜRKÇE  ·  ENGLISH", small, MUTED, 9)

card.save("kok-masa-karti.pdf", "PDF", resolution=300.0)
card.resize((W//3, H//3), Image.LANCZOS).save("card-preview.png")

crop = card.crop((cx-qsize//2-26, qy-26, cx+qsize//2+26, qy+qsize+26))
t,_,_ = det.detectAndDecode(cv2.cvtColor(np.array(crop), cv2.COLOR_RGB2GRAY))
print("kart QR:", "OK" if t == URL else "HATA")
