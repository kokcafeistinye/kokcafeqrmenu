/* KÖK Cafe Lounge — menü çalışma zamanı. Globaller: STATE, SHELL, ICONS */
const ST = STATE;
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const PH_DATA = "__DA" + "TA__", PH_SHELL = "__SH" + "ELL__";

const T = {
 tr:{tag:"", ph:"Ürün, malzeme veya kategori ara…", bless:"Afiyet olsun", vat:"Fiyatlarımıza KDV dahildir.",
     alrg:"Nargile ürünleri 18 yaş altına servis edilmez.", none:"Bu filtrelerle eşleşen ürün yok.", flabel:"Alerjen içermesin",
     hit:n=>n+" ürün gösteriliyor", clear:"Filtreleri temizle", cats:"Kategoriler", more:"İçindekiler · Alerjenler",
     ing:"İçindekiler", all:"Alerjenler", noall:"Bildirilen alerjen yok", out:"Tükendi",
     warn:"İçerik ve alerjen bilgileri hazırlık aşamasındadır. Alerjiniz varsa lütfen sipariş vermeden önce servis ekibimize danışın; mutfağımızda çapraz bulaşma olabilir.",
     wa:"WhatsApp", ig:"Instagram", gg:"Google'da Bul", wamsg:"Merhaba, KÖK Cafe Lounge'a menüden yazıyorum.", top:"Başa dön"},
 en:{tag:"", ph:"Search dishes, ingredients or categories…", bless:"Enjoy your meal", vat:"All prices include VAT.",
     alrg:"Shisha is not served to guests under 18.", none:"No dishes match these filters.", flabel:"Exclude allergens",
     hit:n=>n+" dishes shown", clear:"Clear filters", cats:"Categories", more:"Ingredients · Allergens",
     ing:"Ingredients", all:"Allergens", noall:"No declared allergens", out:"Sold out",
     warn:"Ingredient and allergen information is still being finalised. If you have an allergy, please speak to our team before ordering — cross-contamination is possible in our kitchen.",
     wa:"WhatsApp", ig:"Instagram", gg:"Find us on Google", wamsg:"Hello, I'm writing from the KÖK Cafe Lounge menu.", top:"Back to top"},
 ar:{tag:"", ph:"ابحث عن طبق أو مكوّن أو قسم…", bless:"بالهناء والشفاء", vat:"الأسعار شاملة ضريبة القيمة المضافة.",
     alrg:"لا تُقدَّم الشيشة لمن هم دون 18 عامًا.", none:"لا توجد أطباق مطابقة لهذه الفلاتر.", flabel:"استبعاد مسببات الحساسية",
     hit:n=>"عرض "+n+" طبقًا", clear:"مسح الفلاتر", cats:"الأقسام", more:"المكوّنات · مسببات الحساسية",
     ing:"المكوّنات", all:"مسببات الحساسية", noall:"لا توجد مسببات حساسية مُعلنة", out:"نفد",
     warn:"معلومات المكوّنات ومسببات الحساسية قيد الإعداد. إذا كنت تعاني من حساسية، يُرجى إبلاغ فريق الخدمة قبل الطلب؛ قد يحدث تلوّث متبادل في مطبخنا.",
     wa:"واتساب", ig:"إنستغرام", gg:"خرائط غوغل", wamsg:"مرحبًا، أكتب إليكم من قائمة كوك كافيه لاونج.", top:"العودة للأعلى"}
};

let lang = "tr";
try {
  const sv = localStorage.getItem("kok-lang");
  if (["tr","en","ar"].includes(sv)) lang = sv;
  else { const nl = (navigator.language||"tr").slice(0,2).toLowerCase(); lang = nl==="tr"?"tr":(nl==="ar"?"ar":"en"); }
} catch(e){}

const tx = o => (o && (o[lang] || o.tr || o.en)) || "";
const EX = new Set();
const USED = (()=>{ const u=new Set(); ST.sections.forEach(s=>s.g.forEach(g=>g.i.forEach(it=>(it.a||[]).forEach(a=>u.add(a))))); return Object.keys(ST.alg).filter(k=>u.has(k)); })();
const money = p => Number(p||0).toLocaleString(lang==="tr"?"tr-TR":"en-US") + '<span class="cur"> ₺</span>';
const ICO = k => '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[k]||ICONS.plate)+'</svg>';
const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8l7 8 7-8"/></svg>';
const menuEl = $("menu"), railEl = $("rail"), qEl = $("q"), emptyEl = $("empty");

function applyBrand(){
  const b = ST.brand;
  document.documentElement.style.setProperty("--logo", 'url("'+ST.logo+'")');
  document.documentElement.style.setProperty("--logo-ar", ST.logoAr || "560/403");
  document.title = b.name + (lang==="tr"?" Menü":lang==="ar"?" — القائمة":" Menu");
  document.querySelectorAll(".silogo").forEach(im=>{ const src=ST.social&&ST.social[im.dataset.s]; if(src&&im.src!==src) im.src=src; });
}

function build(){
  const t = T[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang==="ar" ? "rtl" : "ltr";
  railEl.innerHTML = ST.sections.map(s=>'<button class="chip" type="button" data-go="'+s.id+'">'+esc(tx(s.title))+'</button>').join("");
  menuEl.innerHTML = ST.sections.map(s=>{
    const groups = s.g.map(g=>{
      const items = g.i.map(it=>{
        const nm = tx(it.name), ing = tx(it.ing);
        const key = [it.name.tr,it.name.en,it.name.ar,it.ing.tr,it.ing.en,it.ing.ar,g.title.tr,g.title.en,g.title.ar,s.title.tr,s.title.en,s.title.ar].join(" ").toLocaleLowerCase("tr");
        const chips = (it.a||[]).map(a=>'<span class="achip"><b>'+esc(a)+'</b>'+esc(tx(ST.alg[a]))+'</span>').join("");
        const photo = it.img ? '<div class="photo"><img src="'+it.img+'" alt="'+esc(nm)+'" loading="lazy"></div>' : '';
        return '<div class="item'+(it.so?' so':'')+'" data-id="'+it.id+'" data-k="'+esc(key)+'" data-a="'+((it.a||[]).join(","))+'">'
          +'<button class="irow" type="button" aria-expanded="false" aria-controls="d-'+it.id+'">'
            +'<span class="thumb">'+(it.img?'<img src="'+it.img+'" alt="" loading="lazy">':ICO(it.ic))+'</span>'
            +'<span class="ibody">'
              +'<span class="line"><span class="nm">'+esc(nm)+(it.s?'<span class="badge">KÖK</span>':'')+(it.so?'<span class="badge out">'+t.out+'</span>':'')
              +'</span><span class="dots"></span><span class="pr">'+money(it.p)+'</span></span>'
              +(ing?'<span class="desc">'+esc(ing)+'</span>':'')
              +'<span class="more">'+t.more+CHEV+'</span>'
            +'</span></button>'
          +'<div class="idet" id="d-'+it.id+'"><div><div class="idin">'+photo
            +(ing?'<div class="dblock"><h4>'+t.ing+'</h4><p>'+esc(ing)+'</p></div>':'')
            +'<div class="dblock"><h4>'+t.all+'</h4>'+(chips?'<div class="achips">'+chips+'</div>':'<p class="snone">'+t.noall+'</p>')+'</div>'
            +'<div class="dwarn">'+t.warn+'</div>'
          +'</div></div></div></div>';
      }).join("");
      return '<div class="grp"><p class="grp-label">'+esc(tx(g.title))+'</p>'+(g.note&&tx(g.note)?'<p class="grp-note">'+esc(tx(g.note))+'</p>':'')+items+'</div>';
    }).join("");
    return '<section class="sec" id="sec-'+s.id+'" data-sec="'+s.id+'" style="--tint:var(--t'+s.t+');--tink:var(--k'+s.t+')">'
      +'<div class="sec-head"><h2 class="sec-title">'+esc(tx(s.title))+'</h2></div><p class="sec-sub">'+esc(tx(s.sub))+'</p>'+groups+'</section>';
  }).join("");

  $("fchips").innerHTML = USED.map(k=>'<button class="fchip" type="button" data-a="'+k+'" aria-pressed="'+(EX.has(k)?"true":"false")+'">'+esc(tx(ST.alg[k]))+'</button>').join("");

  const b = ST.brand;
  const wurl = "https://wa.me/"+b.wa+"?text="+encodeURIComponent(t.wamsg);
  ["wafab","wabtn2"].forEach(id=>{ $(id).href=wurl; $(id).setAttribute("aria-label",t.wa); });
  ["igfab","igbtn2"].forEach(id=>{ $(id).href=b.ig; $(id).setAttribute("aria-label",t.ig); $(id).hidden=!b.ig; });
  ["ggfab","ggbtn2"].forEach(id=>{ $(id).href=b.gg; $(id).setAttribute("aria-label",t.gg); $(id).hidden=!b.gg; });
  $("watext2").textContent=t.wa; $("igtext2").textContent=t.ig; $("ggtext2").textContent=t.gg;
  $("addr").textContent=tx(b.addr); $("addr2").textContent=tx(b.addr); $("addr").href=b.maps; $("addr2").href=b.maps;
  $("phone").textContent=b.phoneText; $("phone").href="tel:"+b.phoneTel; $("phone2").textContent=b.phoneText; $("phone2").href="tel:"+b.phoneTel;
  $("tagline").textContent=tx(b.tag); $("bless").textContent=t.bless; $("vat").textContent=t.vat; $("alrg").textContent=t.alrg;
  $("flabel").textContent=t.flabel; $("clear").textContent=t.clear; $("totop").setAttribute("aria-label",t.top);
  qEl.placeholder=t.ph; qEl.setAttribute("aria-label",t.ph); emptyEl.textContent=t.none; railEl.setAttribute("aria-label",t.cats);
  document.querySelectorAll(".lang button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.lang===lang?"true":"false"));
  applyBrand();
}

function filter(){
  const q = qEl.value.trim().toLocaleLowerCase("tr");
  let hits = 0;
  menuEl.querySelectorAll(".sec").forEach(sec=>{
    let sv=false;
    sec.querySelectorAll(".grp").forEach(grp=>{
      let gv=false;
      grp.querySelectorAll(".item").forEach(el=>{
        const al = el.dataset.a ? el.dataset.a.split(",") : [];
        const ok = (!q || el.dataset.k.includes(q)) && !al.some(a=>EX.has(a));
        el.hidden=!ok; if(ok){gv=true;hits++}
      });
      grp.hidden=!gv; if(gv)sv=true;
    });
    sec.hidden=!sv;
  });
  const active = q || EX.size;
  emptyEl.hidden = !(active && hits===0);
  $("hits").textContent = active ? T[lang].hit(hits) : "";
  $("clear").hidden = !active;
  $("pbtn").classList.toggle("has", EX.size>0); $("pdot").textContent=EX.size;
  spy();
}

function spy(){
  const y = window.scrollY+56; let cur=null;
  const secs = menuEl.querySelectorAll(".sec");
  secs.forEach(s=>{ if(!s.hidden && s.offsetTop<=y) cur=s.dataset.sec; });
  if(!cur){ const f=[...secs].find(s=>!s.hidden); cur=f?f.dataset.sec:null; }
  [...railEl.children].forEach(c=>{
    const on = c.dataset.go===cur;
    if(on && c.getAttribute("aria-current")!=="true"){
      const target = c.offsetLeft - railEl.clientWidth/2 + c.clientWidth/2;
      railEl.scrollTo({left:target, behavior:"smooth"});
    }
    c.setAttribute("aria-current", on?"true":"false");
  });
  $("totop").classList.toggle("on", window.scrollY>700);
}

let toastT;
function toast(msg, ms){ const t=$("toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("on"), ms||2600); }

/* ---- olaylar ---- */
menuEl.addEventListener("click", e=>{
  const btn=e.target.closest(".irow"); if(!btn) return;
  const item=btn.closest(".item"); const open=!item.classList.contains("open");
  item.classList.toggle("open",open); btn.setAttribute("aria-expanded",open?"true":"false");
});
railEl.addEventListener("click", e=>{ const b=e.target.closest("[data-go]"); if(!b) return; const el=$("sec-"+b.dataset.go); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); });
$("pbtn").addEventListener("click", ()=>{ const open=$("panel").hidden; $("panel").hidden=!open; $("pbtn").setAttribute("aria-expanded",open?"true":"false"); if(open){ window.scrollTo({top:0,behavior:"smooth"}); setTimeout(()=>qEl.focus(),240);} });
$("fchips").addEventListener("click", e=>{ const b=e.target.closest(".fchip"); if(!b) return; const a=b.dataset.a; EX.has(a)?EX.delete(a):EX.add(a); b.setAttribute("aria-pressed",EX.has(a)?"true":"false"); filter(); });
$("clear").addEventListener("click", ()=>{ EX.clear(); qEl.value=""; $("fchips").querySelectorAll(".fchip").forEach(c=>c.setAttribute("aria-pressed","false")); filter(); });
const ADMWORDS = ["yönetici","yonetici","admin","مدير","yöneti̇ci̇"];
qEl.addEventListener("input", ()=>{
  const v = qEl.value.trim().toLocaleLowerCase("tr");
  if (ADMWORDS.includes(v)) { qEl.value=""; qEl.blur(); filter(); askPin(); return; }
  filter();
});
$("totop").addEventListener("click", ()=>window.scrollTo({top:0,behavior:"smooth"}));
document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click", ()=>{
  if(b.dataset.lang===lang) return; lang=b.dataset.lang;
  try{ localStorage.setItem("kok-lang",lang) }catch(e){}
  const y=window.scrollY; build(); filter(); window.scrollTo(0,y);
}));
let tick=false; window.addEventListener("scroll", ()=>{ if(tick) return; tick=true; requestAnimationFrame(()=>{spy();tick=false}); }, {passive:true});

build(); filter();
try{ if(sessionStorage.getItem("kok-saved")){ sessionStorage.removeItem("kok-saved"); toast("Menü yayınlandı ✓", 3200); } }catch(e){}

/* ==========================================================================
   YÖNETİCİ PANELİ
   ========================================================================== */
const A = {open:false, dirty:false, tab:"items"};
const ALGKEYS = Object.keys(ST.alg);

function renderDoc(state){
  const data  = JSON.stringify(state).replace(/<\//g,"<\\/");
  const shell = JSON.stringify(SHELL).replace(/<\//g,"<\\/");
  return SHELL.replace(PH_DATA, ()=>data).replace(PH_SHELL, ()=>shell);
}

function askPin(){
  if(document.querySelector(".pin")) return;
  const w=document.createElement("div"); w.className="pin";
  w.innerHTML='<div><h3>Yönetici girişi</h3><p>Menüyü düzenlemek için PIN girin.</p>'
    +'<input id="pinin" type="password" inputmode="numeric" autocomplete="off" maxlength="12">'
    +'<div class="err" id="pinerr"></div><div class="row"><button class="b" id="pincancel">Vazgeç</button><button class="b p" id="pinok">Giriş</button></div></div>';
  document.body.appendChild(w);
  const inp=w.querySelector("#pinin"); setTimeout(()=>inp.focus(),50);
  const tryPin=()=>{ if(inp.value===String(ST.brand.pin)){ w.remove(); try{sessionStorage.setItem("kok-adm","1")}catch(e){} openAdmin(); } else { w.querySelector("#pinerr").textContent="PIN hatalı"; inp.value=""; inp.focus(); } };
  w.querySelector("#pinok").addEventListener("click",tryPin);
  inp.addEventListener("keydown",e=>{ if(e.key==="Enter") tryPin(); if(e.key==="Escape") w.remove(); });
  w.querySelector("#pincancel").addEventListener("click",()=>{ w.remove(); if(location.hash==="#admin") history.replaceState(null,"",location.pathname+location.search); });
}

function openAdmin(){
  if(A.open) return; A.open=true; A.tab="items";
  const w=document.createElement("div"); w.className="adm"; w.id="adm";
  w.innerHTML='<div class="adm-top"><h2>Yönetici Paneli</h2><button class="b s" id="admclose">Kapat</button></div>'
    +'<div class="adm-tabs"><button data-t="items" aria-selected="true">Ürünler</button><button data-t="settings" aria-selected="false">Ayarlar</button><button data-t="help" aria-selected="false">Yardım</button></div>'
    +'<div class="adm-body" id="admbody"></div>'
    +'<div class="adm-foot"><span class="st" id="admst">Değişiklik yok</span><button class="b p" id="admsave" disabled>Kaydet ve Yayınla</button></div>';
  document.body.appendChild(w);
  document.body.style.overflow="hidden";
  w.querySelector("#admclose").addEventListener("click", closeAdmin);
  w.querySelector(".adm-tabs").addEventListener("click", e=>{ const b=e.target.closest("[data-t]"); if(!b) return; A.tab=b.dataset.t; w.querySelectorAll(".adm-tabs button").forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false")); renderAdmin(); });
  w.querySelector("#admsave").addEventListener("click", save);
  renderAdmin();
}
function closeAdmin(){
  const w=$("adm"); if(w) w.remove(); A.open=false; document.body.style.overflow="";
  if(location.hash==="#admin") history.replaceState(null,"",location.pathname+location.search);
  const y=window.scrollY; build(); filter(); window.scrollTo(0,y);
  if(A.dirty) toast("Kaydedilmemiş değişiklikler var — panelden 'Kaydet ve Yayınla' deyin", 4000);
}
function markDirty(){ A.dirty=true; const s=$("admst"), b=$("admsave"); if(s) s.textContent="Kaydedilmemiş değişiklikler var"; if(b) b.disabled=false; }

function renderAdmin(){
  const body=$("admbody"); if(!body) return;
  if(A.tab==="items") return renderItems(body);
  if(A.tab==="settings") return renderSettings(body);
  body.innerHTML='<div class="note">Bu panel yalnızca menüyü düzenlemek içindir. Değişiklikler "Kaydet ve Yayınla" ile menü adresine anında yansır; QR kod değişmez.</div>'
    +'<p style="font-size:.9rem;line-height:1.6"><b>Ürünler:</b> fiyat, ad (3 dil), içindekiler, alerjenler, fotoğraf, "tükendi" işareti. Satırdaki anahtar ürünü hızlıca tükendi/mevcut yapar.<br><br>'
    +'<b>Ayarlar:</b> telefon, WhatsApp, Instagram, Google bağlantısı, adres, slogan ve PIN.<br><br>'
    +'<b>Fotoğraf:</b> telefondan seçtiğiniz fotoğraf otomatik küçültülür (en fazla 720 px). Çok sayıda fotoğraf sayfayı yavaşlatabilir; en çok satan 60–80 ürüne fotoğraf koymak idealdir.<br><br>'
    +'<b>Güvenlik:</b> PIN yalnızca paneli müşterilerden gizler. Gerçek koruma, yayınlamanın sadece sizin Claude hesabınızla mümkün olmasıdır — başka biri PIN’i bilse bile değişiklik yayınlayamaz.<br><br>'
    +'<b>Panele girmek için:</b> adresin sonuna <code>#admin</code> ekleyin ya da alt bilgideki küçük "Yönetici" yazısına dokunun.</p>';
}

function renderItems(body){
  const q=(A.q||"").toLocaleLowerCase("tr");
  let h='<input class="adm-search" id="admq" placeholder="Ürün ara…" value="'+esc(A.q||"")+'">';
  ST.sections.forEach((s,si)=>{
    let sh='';
    s.g.forEach((g,gi)=>{
      const rows=g.i.map((it,ii)=>{
        if(q && !(it.name.tr+" "+it.name.en).toLocaleLowerCase("tr").includes(q)) return "";
        return '<div class="arow'+(it.so?' so':'')+'" data-p="'+si+'.'+gi+'.'+ii+'"><div class="n">'+esc(it.name.tr)+'<small>'+esc(it.name.en)+(it.name.ar?' · '+esc(it.name.ar):'')+'</small></div>'
          +'<span class="p">'+Number(it.p).toLocaleString("tr-TR")+' ₺</span>'
          +'<button class="sw" role="switch" aria-checked="'+(it.so?"false":"true")+'" data-act="so" title="Mevcut / Tükendi"></button>'
          +'<button class="b s" data-act="edit">Düzenle</button></div>';
      }).join("");
      if(rows || !q) sh+='<div class="adm-grp"><span>'+esc(g.title.tr)+'</span><button class="b s" data-act="add" data-p="'+si+'.'+gi+'">+ Ürün</button></div>'+rows;
    });
    if(sh) h+='<div class="adm-sec">'+esc(s.title.tr)+'</div>'+sh;
  });
  body.innerHTML=h;
  const qi=$("admq"); qi.addEventListener("input",()=>{ A.q=qi.value; const pos=qi.selectionStart; renderItems(body); const n=$("admq"); n.focus(); n.setSelectionRange(pos,pos); });
  body.addEventListener("click", onItemsClick);
}
function onItemsClick(e){
  const b=e.target.closest("[data-act]"); if(!b) return;
  const act=b.dataset.act;
  if(act==="add"){ const [si,gi]=b.dataset.p.split(".").map(Number); const g=ST.sections[si].g[gi];
    const it={id:ST.sections[si].id+"-n"+Date.now().toString(36), name:{tr:"",en:"",ar:""}, ing:{tr:"",en:"",ar:""}, p:0, a:[], ic:g.i[0]?g.i[0].ic:"plate", img:""};
    g.i.push(it); markDirty(); editItem(si,gi,g.i.length-1); return; }
  const row=b.closest(".arow"); const [si,gi,ii]=row.dataset.p.split(".").map(Number); const it=ST.sections[si].g[gi].i[ii];
  if(act==="so"){ it.so=!it.so; row.classList.toggle("so",!!it.so); b.setAttribute("aria-checked",it.so?"false":"true"); markDirty(); }
  if(act==="edit") editItem(si,gi,ii);
}

function field(label,id,val,opts){ opts=opts||{}; return '<label class="f"><span>'+label+'</span>'+(opts.area?'<textarea id="'+id+'"'+(opts.rtl?' dir="rtl"':'')+'>'+esc(val)+'</textarea>':'<input id="'+id+'" type="'+(opts.type||"text")+'" value="'+esc(val)+'"'+(opts.rtl?' dir="rtl"':'')+(opts.attrs||'')+'>')+'</label>'; }

function editItem(si,gi,ii){
  const it=ST.sections[si].g[gi].i[ii]; const g=ST.sections[si].g[gi];
  const m=document.createElement("div"); m.className="adm-modal"; m.id="admmodal";
  m.innerHTML='<div class="adm-top"><h2>'+esc(it.name.tr||"Yeni ürün")+'</h2><button class="b s" id="mclose">Geri</button></div><div class="adm-body">'
    +'<div class="frow">'+field("Fiyat (₺)","f_p",it.p,{type:"number",attrs:' inputmode="numeric" min="0" step="1"'})+'<label class="f"><span>Görsel türü</span><select id="f_ic">'+Object.keys(ICONS).map(k=>'<option value="'+k+'"'+(k===it.ic?' selected':'')+'>'+k+'</option>').join("")+'</select></label></div>'
    +field("Ürün adı (Türkçe)","f_ntr",it.name.tr)+field("Product name (English)","f_nen",it.name.en)+field("اسم المنتج (العربية)","f_nar",it.name.ar,{rtl:1})
    +field("İçindekiler (Türkçe)","f_itr",it.ing.tr,{area:1})+field("Ingredients (English)","f_ien",it.ing.en,{area:1})+field("المكوّنات (العربية)","f_iar",it.ing.ar,{area:1,rtl:1})
    +'<div class="f"><span>Alerjenler</span><div class="chk">'+ALGKEYS.map(k=>'<label class="'+((it.a||[]).includes(k)?'on':'')+'"><input type="checkbox" value="'+k+'"'+((it.a||[]).includes(k)?' checked':'')+'>'+esc(ST.alg[k].tr)+'</label>').join("")+'</div></div>'
    +'<div class="frow"><label class="f"><span>KÖK rozeti</span><select id="f_s"><option value="0"'+(!it.s?' selected':'')+'>Yok</option><option value="1"'+(it.s?' selected':'')+'>Var</option></select></label>'
    +'<label class="f"><span>Durum</span><select id="f_so"><option value="0"'+(!it.so?' selected':'')+'>Mevcut</option><option value="1"'+(it.so?' selected':'')+'>Tükendi</option></select></label></div>'
    +'<div class="f"><span>Fotoğraf</span>'+(it.img?'<img class="pv" id="f_pv" src="'+it.img+'">':'<div class="pv" id="f_pv" style="display:grid;place-items:center;color:var(--ink-3);font-size:.75rem">fotoğraf yok</div>')
    +'<input type="file" id="f_img" accept="image/*"> '+(it.img?'<button class="b s d" id="f_rm" type="button">Fotoğrafı kaldır</button>':'')+'</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="b s" id="f_up" type="button">▲ Yukarı taşı</button><button class="b s" id="f_dn" type="button">▼ Aşağı taşı</button><button class="b s d" id="f_del" type="button">Ürünü sil</button></div>'
    +'<div id="f_delc" hidden style="margin-top:8px"><span style="font-size:.85rem;color:var(--danger)">Emin misiniz? </span><button class="b s d" id="f_delok" type="button">Evet, sil</button></div>'
    +'</div><div class="adm-foot"><span class="st"></span><button class="b" id="mcancel">Vazgeç</button><button class="b p" id="mok">Uygula</button></div>';
  document.body.appendChild(m);
  let newImg = it.img, removeImg=false;
  m.querySelector("#f_img").addEventListener("change", async e=>{ const f=e.target.files[0]; if(!f) return; try{ newImg=await shrink(f); removeImg=false; const pv=$("f_pv"); const img=document.createElement("img"); img.className="pv"; img.id="f_pv"; img.src=newImg; pv.replaceWith(img);}catch(err){ toast("Fotoğraf okunamadı"); } });
  const rm=m.querySelector("#f_rm"); if(rm) rm.addEventListener("click",()=>{ removeImg=true; newImg=""; $("f_pv").outerHTML='<div class="pv" id="f_pv" style="display:grid;place-items:center;color:var(--ink-3);font-size:.75rem">kaldırıldı</div>'; });
  m.querySelector(".chk").addEventListener("change", e=>{ const l=e.target.closest("label"); if(l) l.classList.toggle("on",e.target.checked); });
  const close=()=>{ m.remove(); renderAdmin(); };
  m.querySelector("#mclose").addEventListener("click",close); m.querySelector("#mcancel").addEventListener("click",close);
  m.querySelector("#f_up").addEventListener("click",()=>{ if(ii>0){ [g.i[ii-1],g.i[ii]]=[g.i[ii],g.i[ii-1]]; ii--; markDirty(); toast("Yukarı taşındı"); } });
  m.querySelector("#f_dn").addEventListener("click",()=>{ if(ii<g.i.length-1){ [g.i[ii+1],g.i[ii]]=[g.i[ii],g.i[ii+1]]; ii++; markDirty(); toast("Aşağı taşındı"); } });
  m.querySelector("#f_del").addEventListener("click",()=>{ $("f_delc").hidden=false; });
  m.querySelector("#f_delok").addEventListener("click",()=>{ g.i.splice(ii,1); markDirty(); close(); toast("Ürün silindi"); });
  m.querySelector("#mok").addEventListener("click",()=>{
    it.p=Math.max(0,Math.round(Number($("f_p").value)||0)); it.ic=$("f_ic").value;
    it.name={tr:$("f_ntr").value.trim(),en:$("f_nen").value.trim(),ar:$("f_nar").value.trim()};
    it.ing={tr:$("f_itr").value.trim(),en:$("f_ien").value.trim(),ar:$("f_iar").value.trim()};
    it.a=[...m.querySelectorAll('.chk input:checked')].map(x=>x.value);
    it.s=$("f_s").value==="1"?1:0; it.so=$("f_so").value==="1"?1:0;
    if(removeImg) it.img=""; else if(newImg) it.img=newImg;
    if(!it.name.tr){ toast("Türkçe ürün adı boş olamaz"); return; }
    if(!it.name.en) it.name.en=it.name.tr; if(!it.name.ar) it.name.ar=it.name.en;
    markDirty(); close();
  });
}

function shrink(file){
  return new Promise((res,rej)=>{
    const r=new FileReader(); r.onerror=rej;
    r.onload=()=>{ const im=new Image(); im.onerror=rej; im.onload=()=>{
      const MAX=720; let w=im.width,h=im.height; const k=Math.min(1,MAX/Math.max(w,h)); w=Math.round(w*k); h=Math.round(h*k);
      const c=document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(im,0,0,w,h);
      res(c.toDataURL("image/jpeg",0.72)); }; im.src=r.result; };
    r.readAsDataURL(file);
  });
}

function renderSettings(body){
  const b=ST.brand;
  body.innerHTML='<div class="note">Bağlantı ve iletişim bilgileri. WhatsApp numarasını ülke koduyla, boşluksuz yazın (örn. 905xxxxxxxxx).</div>'
    +field("Telefon (görünen)","s_pt",b.phoneText)+field("Telefon (aranacak, +90…)","s_pl",b.phoneTel)
    +field("WhatsApp numarası","s_wa",b.wa,{attrs:' inputmode="numeric"'})+field("Instagram adresi","s_ig",b.ig)+field("Google bağlantısı (harita / yorumlar)","s_gg",b.gg)
    +field("Harita bağlantısı (adrese tıklayınca)","s_maps",b.maps)
    +field("Adres (Türkçe)","s_atr",b.addr.tr)+field("Address (English)","s_aen",b.addr.en)+field("العنوان (العربية)","s_aar",b.addr.ar,{rtl:1})
    +field("Slogan (Türkçe)","s_ttr",b.tag.tr)+field("Tagline (English)","s_ten",b.tag.en)+field("الشعار (العربية)","s_tar",b.tag.ar,{rtl:1})
    +field("Yönetici PIN","s_pin",b.pin,{attrs:' inputmode="numeric"'})
    +'<button class="b p" id="s_ok" type="button">Ayarları uygula</button>';
  $("s_ok").addEventListener("click",()=>{
    b.phoneText=$("s_pt").value.trim(); b.phoneTel=$("s_pl").value.trim(); b.wa=$("s_wa").value.replace(/\D/g,"");
    b.ig=$("s_ig").value.trim(); b.gg=$("s_gg").value.trim(); b.maps=$("s_maps").value.trim();
    b.addr={tr:$("s_atr").value.trim(),en:$("s_aen").value.trim(),ar:$("s_aar").value.trim()};
    b.tag={tr:$("s_ttr").value.trim(),en:$("s_ten").value.trim(),ar:$("s_tar").value.trim()};
    const pin=$("s_pin").value.trim(); if(pin) b.pin=pin;
    markDirty(); toast("Ayarlar uygulandı — yayınlamayı unutmayın");
  });
}

async function save(){
  const st=$("admst"), btn=$("admsave"); btn.disabled=true; st.textContent="Yayınlanıyor…";
  const html=renderDoc(ST);
  const mb=(new Blob([html]).size/1048576);
  if(mb>14){ st.textContent="Sayfa çok büyük ("+mb.toFixed(1)+" MB) — bazı fotoğrafları kaldırın."; btn.disabled=false; return; }
  let art=null;
  try{ if(typeof claude!=="undefined" && claude && claude.use) art=await claude.use("artifact"); }catch(e){}
  if(art){
    try{ try{sessionStorage.setItem("kok-saved","1")}catch(e){} await art.publish(html); st.textContent="Yayınlandı, sayfa yenileniyor…"; A.dirty=false; return; }
    catch(e){ try{sessionStorage.removeItem("kok-saved")}catch(x){}
      const code=e&&e.code;
      if(code==="conflict"){ st.textContent="Başka bir sürüm yayınlanmış — sayfa yenileniyor."; return; }
      st.textContent = code==="not_writer"||code==="not_granted" ? "Bu hesabın yayınlama yetkisi yok. Dosyayı indirip kendiniz yükleyebilirsiniz." : "Yayınlanamadı ("+(code||"hata")+"). Dosyayı indirebilirsiniz.";
    }
  } else st.textContent="Bu ortamda doğrudan yayınlama yok — güncel menüyü indirip sitenize yükleyin.";
  const dl=document.createElement("button"); dl.className="b p"; dl.textContent="index.html indir";
  dl.addEventListener("click", ()=>download(html));
  btn.replaceWith(dl);
}
async function download(html){
  let d=null; try{ if(typeof claude!=="undefined"&&claude&&claude.use) d=await claude.use("downloads"); }catch(e){}
  if(d){ try{ await d.save({filename:"index.html",data:html}); toast("İndirildi"); return; }catch(e){} }
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([html],{type:"text/html"})); a.download="index.html"; document.body.appendChild(a); a.click(); a.remove();
}

/* giriş yolları */
let lp; const logo=document.querySelector(".hero .logo");
logo.addEventListener("pointerdown",()=>{ lp=setTimeout(askPin,900); }); ["pointerup","pointerleave","pointercancel"].forEach(ev=>logo.addEventListener(ev,()=>clearTimeout(lp)));
if(location.hash==="#admin"){ let ok=false; try{ ok=sessionStorage.getItem("kok-adm")==="1" }catch(e){} ok?openAdmin():askPin(); }
window.addEventListener("hashchange",()=>{ if(location.hash==="#admin"&&!A.open) askPin(); });
