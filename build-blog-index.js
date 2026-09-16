// assets/blog-plan-190.json の「公開済み」記事のうち、
// pages/blog/index.html にまだ載っていないものだけをリストへ追記する。
// 既存の(手動調整済みの)一覧項目は上書きしない。
// 実行: node build-blog-index.js

const fs = require("fs");
const path = require("path");

const root = __dirname;
const planPath = path.join(root, "assets/blog-plan-190.json");
const indexPath = path.join(root, "pages/blog/index.html");

const plan = JSON.parse(fs.readFileSync(planPath, "utf-8"));
let html = fs.readFileSync(indexPath, "utf-8");

const published = plan.filter((item) => item.status === "公開済み");

const newBlocks = published
  .filter((item) => !html.includes(`href="${item.slug}.html"`))
  .map((item) => {
    const title = `${item.suggested_title}見直すべきポイントを解説`;
    const desc = `${item.city}で${item.industry}の採用に苦戦している企業様へ。応募が集まらない背景と、求人内容・採用フローの見直しポイントを解説します。`;
    return `      <a href="${item.slug}.html" class="blog-list-item">
        <span class="tag">${item.city} × ${item.industry}</span>
        <h3>${title}</h3>
        <p>${desc}</p>
      </a>`;
  });

if (newBlocks.length === 0) {
  console.log("新規追加する記事はありませんでした。");
} else {
  const marker = '\n    </div>\n    <p style="margin-top:32px;';
  const idx = html.indexOf(marker);
  if (idx === -1) {
    throw new Error("pages/blog/index.html の挿入位置マーカーが見つかりませんでした。手動で確認してください。");
  }
  html = html.slice(0, idx) + "\n" + newBlocks.join("\n") + html.slice(idx);
  fs.writeFileSync(indexPath, html, "utf-8");
  console.log(`${newBlocks.length}件の記事を一覧ページに追加しました。`);
}
