// tek adımda: temizle -> zenginleştir -> görselleri eşle -> sayfayı üret -> sözdizimi kontrolü
const fs = require("fs");
const { execFileSync } = require("child_process");

let S = JSON.parse(fs.readFileSync("data.json", "utf8"));
for (const s of S) for (const g of s.g) for (const it of g.i) {
  delete it.a; delete it.ing; delete it.inge; delete it.ic; delete it.id;
}
fs.writeFileSync("data.json", JSON.stringify(S, null, 1));

execFileSync(process.execPath, ["augment.js"], { stdio: "ignore" });

S = JSON.parse(fs.readFileSync("data.json", "utf8"));
const M = { menemen:"egg", quesadilla:"wrap", fajita:"pot", kebab:"steak", nuts:"plate", honey:"olive", water:"bottle" };
for (const s of S) for (const g of s.g) for (const it of g.i) if (M[it.ic]) it.ic = M[it.ic];
fs.writeFileSync("data.json", JSON.stringify(S, null, 1));

execFileSync(process.execPath, ["build2.js"], { stdio: "inherit" });

const h = fs.readFileSync("menu.html", "utf8");
fs.writeFileSync("/tmp/claude-0/c3.js", h.slice(h.indexOf("<script>") + 8, h.lastIndexOf("</script>")));
execFileSync(process.execPath, ["--check", "/tmp/claude-0/c3.js"]);
console.log("JS sozdizimi OK");

let ing = 0, tot = 0;
S = JSON.parse(fs.readFileSync("data.json", "utf8"));
for (const s of S) for (const g of s.g) for (const it of g.i) { tot++; if (it.ing) ing++; }
console.log("icerikli urun:", ing + "/" + tot);
