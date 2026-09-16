// pages/blog/ 配下の記事ファイルをすべて読み込み、
// 各ファイルの <h1>・meta description・kicker から一覧ページを再生成する。
// 実行: node build-blog-index.js

const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "pages/blog");
const indexPath = path.join(dir, "index.html");

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".html") && f !== "index.html")
  .sort();

const items = files.map((f) => {
  const html = fs.readFileSync(path.join(dir, f), "utf-8");
  const h1 = html.match(/<h1>(.*?)<\/h1>/s)[1];
  const desc = html.match(/name="description" content="(.*?)"/)[1];
  const tag = html.match(/<span class="kicker">(.*?)<\/span>/)[1];
  return { file: f, h1, desc, tag };
});

const listHtml = items
  .map(
    (i) => `      <a href="${i.file}" class="blog-list-item">
        <span class="tag">${i.tag}</span>
        <h3>${i.h1}</h3>
        <p>${i.desc}</p>
      </a>`
  )
  .join("\n");

const template = fs.readFileSync(indexPath, "utf-8");
const newHtml = template.replace(
  /<div class="blog-list">[\s\S]*?<\/div>\n    <p/,
  `<div class="blog-list">\n${listHtml}\n    </div>\n    <p`
);
fs.writeFileSync(indexPath, newHtml, "utf-8");

console.log(`${items.length}件を一覧ページに反映しました。`);
