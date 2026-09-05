const fs = require("fs");
const S = JSON.parse(fs.readFileSync("data.json","utf8"));
const ICONS = require("./icons.js");
const AR = require("./ar.js");
const SOCIAL = JSON.parse(fs.readFileSync("social.json","utf8"));
const CSS = fs.readFileSync("page.css","utf8");
const JS  = fs.readFileSync("page.js","utf8");
const LOGO_B64 = fs.readFileSync("logo-mask.b64","utf8").trim();
const [LW,LH] = fs.readFileSync("logo-size.txt","utf8").trim().split(" ").map(Number);

/* ---------- durum (sayfaya gömülen tek veri nesnesi) ---------- */
const missing = [];
const sections = S.map((s,si)=>({
  id:s.id, t:si+1,
  title:{tr:s.tr, en:s.en, ar:AR.SECTIONS[s.tr]||(missing.push("bölüm:"+s.tr),s.en)},
  sub:{tr:s.str, en:s.sen, ar:AR.SUBS[s.str]||(missing.push("alt:"+s.str),s.sen)},
  g:s.g.map((g,gi)=>({
    title:{tr:g.tr, en:g.en, ar:AR.GROUPS[g.tr]||(missing.push("grup:"+g.tr),g.en)},
    note:g.note?{tr:g.note, en:g.noteEn, ar:AR.NOTES[g.note]||g.noteEn}:null,
    i:g.i.map((it,ii)=>({
      id:s.id+"-"+(gi+1)+"-"+(ii+1),
      name:{tr:it.n, en:it.ne, ar:AR.NAMES[it.n]||(missing.push("ad:"+it.n),it.ne)},
      ing:{tr:it.ing||"", en:it.inge||"", ar:it.ing?(AR.INGS[it.ing]||(missing.push("içerik:"+it.ing),it.inge||"")):""},
      p:it.p, a:it.a||[], ic:it.ic, s:it.s?1:0, so:0, img:""
    }))
  }))
}));
if(missing.length){ console.log("EKSİK ARAPÇA ("+missing.length+"):"); console.log(missing.join("\n")); }

const ALG = {
 G:{tr:"Gluten",en:"Gluten"}, M:{tr:"Süt",en:"Milk"}, Y:{tr:"Yumurta",en:"Egg"}, B:{tr:"Balık",en:"Fish"},
 K:{tr:"Kabuklu deniz ürünleri",en:"Crustaceans"}, S:{tr:"Soya",en:"Soy"}, SS:{tr:"Susam",en:"Sesame"},
 N:{tr:"Sert kabuklu yemişler",en:"Tree nuts"}, F:{tr:"Yer fıstığı",en:"Peanuts"}, H:{tr:"Hardal",en:"Mustard"},
 C:{tr:"Kereviz",en:"Celery"}, SO:{tr:"Sülfit",en:"Sulphites"}, MO:{tr:"Yumuşakçalar",en:"Molluscs"}, L:{tr:"Acı bakla",en:"Lupin"}
};
for(const k in ALG) ALG[k].ar = AR.ALG[k];

const STATE = {
  v:4,
  brand:{
    name:"KÖK Cafe Lounge",
    tag:{tr:"Kahvaltıdan gece yarısına", en:"From breakfast to midnight", ar:"من الفطور حتى منتصف الليل"},
    phoneText:"(0212) 277 50 53", phoneTel:"+902122775053", wa:"902122775053",
    ig:"https://www.instagram.com/kokcafeistinye/",
    gg:"https://share.google/0tCOkrVSxEeCA2mTo",
    maps:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("KÖK Cafe Lounge, İstinye Cd. No:5, Sarıyer, İstanbul"),
    addr:{tr:"İstinye, İstinye Cd. No:5, 34460 Sarıyer/İstanbul", en:"İstinye Cd. No:5, İstinye, 34460 Sarıyer/İstanbul", ar:"إستينيه، شارع إستينيه رقم 5، 34460 صاريير / إسطنبول"},
    pin:"5053"
  },
  logo:"data:image/png;base64,"+LOGO_B64, logoAr:LW+"/"+LH,
  social:SOCIAL,
  alg:ALG, sections
};

/* ---------- simgeler ---------- */
const I_WA = '<img class="silogo" data-s="wa" alt="">';
const I_IG = '<img class="silogo" data-s="ig" alt="">';
const I_GG = '<img class="silogo" data-s="gg" alt="">';
const I_UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
const I_SEARCH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';

/* ---------- gövde ---------- */
const BODY = `
<header class="hero wrap">
  <div class="logo" role="img" aria-label="KÖK Cafe Lounge"></div>
  <p class="tagline" id="tagline"></p>
  <p class="meta"><a id="addr" href="#" target="_blank" rel="noopener"></a><span class="sep">·</span><a id="phone" href="#"></a></p>
</header>
<div class="bar"><div class="bar-in">
  <nav class="rail" id="rail" aria-label="Kategoriler"></nav>
  <div class="tools">
    <button class="iconbtn" id="pbtn" aria-expanded="false" aria-controls="panel" aria-label="Ara ve filtrele">${I_SEARCH}<span class="dot" id="pdot">0</span></button>
    <div class="lang" role="group" aria-label="Dil / Language / اللغة">
      <button type="button" data-lang="tr" aria-pressed="true">TR</button><button type="button" data-lang="en" aria-pressed="false">EN</button><button type="button" data-lang="ar" aria-pressed="false">AR</button>
    </div>
  </div>
</div></div>
<div class="panel" id="panel" hidden><div class="wrap">
  <input id="q" type="search" autocomplete="off" enterkeyhint="search">
  <p class="flabel" id="flabel"></p><div class="fchips" id="fchips"></div>
  <div class="hits"><span id="hits"></span><button class="clear" id="clear" hidden></button></div>
</div></div>
<main class="wrap" id="menu"></main>
<p class="empty wrap" id="empty" hidden></p>
<footer class="foot wrap">
  <div class="logo" role="img" aria-label="KÖK Cafe Lounge"></div>
  <p class="bless" id="bless"></p>
  <p class="fline"><a id="addr2" href="#" target="_blank" rel="noopener"></a></p>
  <p class="fline"><a id="phone2" href="#"></a></p>
  <div class="socials">
    <a class="sbtn wa" id="wabtn2" href="#" target="_blank" rel="noopener">${I_WA}<span id="watext2"></span></a>
    <a class="sbtn ig" id="igbtn2" href="#" target="_blank" rel="noopener">${I_IG}<span id="igtext2"></span></a>
    <a class="sbtn gg" id="ggbtn2" href="#" target="_blank" rel="noopener">${I_GG}<span id="ggtext2"></span></a>
  </div>
  <p class="fsmall" id="vat"></p><p class="fsmall" id="alrg"></p>
</footer>
<div class="fabs">
  <button class="fab top" id="totop" type="button">${I_UP}</button>
  <a class="fab wa" id="wafab" href="#" target="_blank" rel="noopener">${I_WA}</a>
  <a class="fab ig" id="igfab" href="#" target="_blank" rel="noopener">${I_IG}</a>
  <a class="fab gg" id="ggfab" href="#" target="_blank" rel="noopener">${I_GG}</a>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>const ICONS=${JSON.stringify(ICONS)};const STATE=__DATA__;const SHELL=__SHELL__;</script>
<script>${JS}</script>`;

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
 + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..700&family=Karla:ital,wght@0,300..800;1,300..700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;500;700;800&display=swap">';
const TITLE = '<title>KÖK Cafe Lounge Menü</title>';
const STYLE = '<style>'+CSS+'</style>';

// Tam belge şablonu (sayfanın kendini yeniden yayınlarken kullandığı) — yer tutucular: __DATA__, __SHELL__
const FULL = '<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 + TITLE + FONTS + STYLE + '</head><body>' + BODY + '</body></html>';
// Artifact aracı için içerik (iskeleti platform ekler)
const CONTENT = TITLE + FONTS + STYLE + BODY;

function render(tpl, state){
  const data  = JSON.stringify(state).replace(/<\//g,"<\\/");
  const shell = JSON.stringify(FULL).replace(/<\//g,"<\\/");
  return tpl.replace("__DATA__",()=>data).replace("__SHELL__",()=>shell);
}
fs.writeFileSync("menu.html", render(CONTENT, STATE));
fs.mkdirSync("site",{recursive:true});
fs.writeFileSync("site/index.html", render(FULL, STATE));
fs.writeFileSync("state.json", JSON.stringify(STATE,null,1));
let n=0; sections.forEach(s=>s.g.forEach(g=>n+=g.i.length));
console.log("menu.html:", (fs.statSync("menu.html").size/1024).toFixed(0)+" KB | site/index.html:", (fs.statSync("site/index.html").size/1024).toFixed(0)+" KB | ürün:", n, "| eksik AR:", missing.length);
