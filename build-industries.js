// 業界別LP(強化版:選ばれる理由・導入フロー・FAQ付き)を
// industries.json のデータからテンプレートに差し込んで一括生成する。
// 実行: node build-industries.js
// 出力: pages/industries/{slug}.html を10本生成する

const fs = require("fs");
const path = require("path");

const root = __dirname;
const industries = JSON.parse(fs.readFileSync(path.join(root, "assets/industries.json"), "utf-8"));
const template = fs.readFileSync(path.join(root, "template-industry.html"), "utf-8");

const outDir = path.join(root, "pages", "industries");
fs.mkdirSync(outDir, { recursive: true });

for (const ind of industries) {
  let html = template
    .replaceAll("{{INDUSTRY}}", ind.name)
    .replaceAll("{{HOOK}}", ind.hook)
    .replace("{{PROBLEM1_TITLE}}", ind.problems[0].title)
    .replace("{{PROBLEM1_DESC}}", ind.problems[0].desc)
    .replace("{{PROBLEM2_TITLE}}", ind.problems[1].title)
    .replace("{{PROBLEM2_DESC}}", ind.problems[1].desc)
    .replace("{{PROBLEM3_TITLE}}", ind.problems[2].title)
    .replace("{{PROBLEM3_DESC}}", ind.problems[2].desc);

  fs.writeFileSync(path.join(outDir, `${ind.slug}.html`), html, "utf-8");
}

console.log(`${industries.length}本の業界別ページを pages/industries/ に生成しました。`);
