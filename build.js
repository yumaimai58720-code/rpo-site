// 地域別LPを cities.json のデータからテンプレートに差し込んで一括生成する。
// 実行: node build.js
// 出力: pages/{slug}.html を19本生成する

const fs = require("fs");
const path = require("path");

const root = __dirname;
const cities = JSON.parse(fs.readFileSync(path.join(root, "assets/cities.json"), "utf-8"));
const template = fs.readFileSync(path.join(root, "template.html"), "utf-8");

function buildAreaBadges(currentSlug) {
  return cities
    .map((c) => {
      const cls = c.slug === currentSlug ? "area-badge is-current" : "area-badge";
      return `<a href="${c.slug}.html" class="${cls}">${c.name}</a>`;
    })
    .join("\n      ");
}

const outDir = path.join(root, "pages");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

for (const city of cities) {
  let html = template
    .replaceAll("{{CITY}}", city.name)
    .replaceAll("{{CITY_READING}}", city.reading)
    .replaceAll("{{INDUSTRY}}", city.industry)
    .replace("{{AREA_BADGES}}", buildAreaBadges(city.slug));

  fs.writeFileSync(path.join(outDir, `${city.slug}.html`), html, "utf-8");
}

console.log(`${cities.length}本のページを pages/ に生成しました。`);
