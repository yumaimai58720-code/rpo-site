// city-context.json(3市) × industries.json(10業界)から
// ブログ記事を生成する。既存の手書き記事(pages/blog/配下)は上書きしない。
// 実行: node build-blog.js

const fs = require("fs");
const path = require("path");

const root = __dirname;
const industries = JSON.parse(fs.readFileSync(path.join(root, "assets/industries.json"), "utf-8"));
const cityContext = JSON.parse(fs.readFileSync(path.join(root, "assets/city-context.json"), "utf-8"));
const template = fs.readFileSync(path.join(root, "template-blog-combo.html"), "utf-8");

// 対象都市(このフェーズで対応する3市。今後 cities.json の全19市に拡張可能)
const targetCitySlugs = ["kagoshima-shi", "aira-shi", "kirishima-shi"];

const outDir = path.join(root, "pages", "blog");
fs.mkdirSync(outDir, { recursive: true });

let created = 0;
let skipped = 0;

for (const citySlug of targetCitySlugs) {
  const city = cityContext[citySlug];
  if (!city) continue;

  for (const ind of industries) {
    const fileName = `${citySlug}-${ind.slug}.html`;
    const outPath = path.join(outDir, fileName);

    if (fs.existsSync(outPath)) {
      skipped++; // 既存の手書き記事は上書きしない
      continue;
    }

    const html = template
      .replaceAll("{{CITY}}", city.name)
      .replaceAll("{{INDUSTRY}}", ind.name)
      .replaceAll("{{BACKGROUND}}", city.background)
      .replace("{{CAUSE1_TITLE}}", ind.problems[0].title)
      .replace("{{CAUSE1_DESC}}", ind.problems[0].desc)
      .replace("{{CAUSE2_TITLE}}", ind.problems[1].title)
      .replace("{{CAUSE2_DESC}}", ind.problems[1].desc)
      .replace("{{CAUSE3_TITLE}}", ind.problems[2].title)
      .replace("{{CAUSE3_DESC}}", ind.problems[2].desc)
      .replace("{{IMPROVE1}}", ind.improvement[0])
      .replace("{{IMPROVE2}}", ind.improvement[1]);

    fs.writeFileSync(outPath, html, "utf-8");
    created++;
  }
}

console.log(`${created}本を新規生成しました(既存${skipped}本はスキップ)。`);
