# KÖK Cafe Lounge — QR Menü Yazılımı

Bu klasör menünün **kaynak kodudur**. Menüyü kullanmak için buna ihtiyacın yok
(yönetici panelinden düzenleyebilirsin) — burası, sıfırdan yeniden üretmek veya
başka birine devretmek istediğinde lazım olur.

## Ne nerede

| Dosya | Ne işe yarar |
|---|---|
| `data.json` | Menünün ham verisi: 9 bölüm, 36 grup, 241 ürün. Ad (TR/EN), fiyat, içindekiler, alerjen kodları, görsel anahtarı. |
| `ar.js` | Arapça çeviri tabloları: bölüm, grup, ürün adı, içindekiler, alerjen adları. |
| `augment.js` | `data.json`'a içindekiler ve alerjen bilgisi ekleyen betik. Kural tabanlı çıkarım + elle yazılmış tablolar. |
| `icons.js` | 37 adet el çizimi yemek illüstrasyonu (SVG path'leri). Fotoğrafı olmayan ürünlerde görünür. |
| `page.css` | Sayfanın tüm stili (menü + yönetici paneli). |
| `page.js` | Sayfanın tüm davranışı: dil değiştirme, arama, filtre, açılır detay, yönetici paneli, kendi kendini yayınlama. |
| `build2.js` | Hepsini birleştirip `menu.html` (Claude artifact) ve `site/index.html` (bağımsız site) üretir. |
| `all.js` | Zinciri tek komutta çalıştırır. |
| `social.json` | WhatsApp / Instagram / Google Maps logoları (data URI). |
| `logo-mask.b64`, `logo-size.txt` | KÖK logosu, CSS maskesi olarak. Marka altınıyla basılır. |
| `card.py` | A6 masa kartı PDF'i + QR kod üretir (OpenCV'nin QR kodlayıcısı). |
| `sheet.py` | Alerjen/içerik kontrol Excel dosyasını üretir. |

## Yeniden üretmek

Node.js 18+ ve Python 3 gerekir.

```bash
cd kaynak
node all.js          # data.json -> augment -> build2 -> menu.html + site/index.html
python3 card.py      # kok-masa-karti.pdf + kok-qr.png   (pillow, opencv-python gerekir)
python3 sheet.py     # KOK-alerjen-kontrol.xlsx          (openpyxl gerekir)
```

`site/index.html` tek dosyalık, bağımsız bir web sitesidir — herhangi bir
statik sunucuya konabilir.

## Sayfa nasıl çalışıyor

Sayfa **tek bir HTML dosyasıdır**; sunucu, veritabanı, dış bağlantı yoktur.
İçinde iki şey vardır:

1. `STATE` — menünün tüm verisi (JSON).
2. `SHELL` — sayfanın kendi şablonu (veri yerine `__DATA__` yer tutucusu içeren
   tam HTML metni).

Yönetici panelinde bir şey değiştirip **Kaydet** dediğinde sayfa,
`SHELL` içindeki `__DATA__` yerine güncel `STATE`'i koyup yeni bir HTML üretir
ve `claude.use("artifact").publish(html)` ile kendini yeniden yayınlar.
Yani menü kendi kaynağını taşır ve kendini günceller.

Statik bir sunucuda (Netlify/Vercel) `publish` çalışmaz; panel bunun yerine
güncel `index.html`'i indirtir, sen de onu tekrar yüklersin.

## Yönetici paneline giriş (üç yol)

1. Arama kutusuna **`yönetici`** yaz (İngilizce `admin`, Arapça `مدير` de olur)
2. Adresin sonuna **`#admin`** ekle
3. Üstteki logoya ~1 saniye basılı tut

Sonra PIN sorar. Varsayılan **5053** — Ayarlar sekmesinden değiştir.

PIN sadece paneli müşteriden gizler. Asıl koruma şudur: yayınlamayı yalnızca
menünün sahibi olan Claude hesabı yapabilir. PIN'i bilen biri paneli açsa bile
değişikliği yayına alamaz.

## Veri sözlüğü

**Alerjen kodları:** G gluten · M süt · Y yumurta · B balık · K kabuklu deniz
ürünleri · S soya · SS susam · N sert kabuklu yemişler · F yer fıstığı ·
H hardal · C kereviz · SO sülfit · MO yumuşakçalar · L acı bakla

**Ürün kimliği:** `<bölüm>-<grup sırası>-<ürün sırası>` — örn. `ana-1-1` =
Ana Yemekler / Izgara Çeşitleri / birinci ürün.

**Bölüm renkleri:** her bölümün kendi sıcak tonu var (`--t1..--t9` /
`--k1..--k9`), ürün görsellerinin zemininde kullanılıyor.

## Bilinmesi gerekenler

- **Alerjen ve içindekiler bilgileri taslaktır.** Ürün adlarından ve verilen
  malzeme listelerinden çıkarıldı. Mutfak ekibi doğrulamadan yayına
  girmemeliydi — `KOK-alerjen-kontrol.xlsx` bu iş için hazırlandı.
- "Karpuz, Pancar, Karadut Üçlüsü" kokteylinin fiyatı kaynak listede yoktu;
  aynı gruptaki diğerlerine bakılarak 270 ₺ yazıldı.
- WhatsApp numarası sabit hattan alındı (0212...). Cep numarası varsa
  yönetici panelinden değiştirilmeli.
- Fotoğraflar sayfaya gömülür (data URI). Sayfa sınırı 16 MB; panel 14 MB'ı
  aşarsa uyarır. ~60-80 fotoğraf rahatlıkla sığar.
- Yazı tipleri Google Fonts'tan çekilir (Alegreya, Karla, Amiri, Tajawal).
  İnternet yoksa sistem yazı tiplerine düşer, sayfa yine çalışır.
