// pages/blog/ に実際に存在するファイルを基準に、
// assets/blog-plan-190.json の status を「公開済み」に更新する。
// 実行: node update-plan-status.js

const fs = require("fs");
const path = require("path");

const blogDir = path.join(__dirname, "pages/blog");
const planPath = path.join(__dirname, "assets/blog-plan-190.json");

const existingFiles = new Set(
  fs.readdirSync(blogDir).filter((f) => f.endsWith(".html") && f !== "index.html")
);

const plan = JSON.parse(fs.readFileSync(planPath, "utf-8"));

let updated = 0;
for (const item of plan) {
  const fileName = `${item.slug}.html`;
  if (existingFiles.has(fileName) && item.status !== "公開済み") {
    item.status = "公開済み";
    updated++;
  }
}

fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), "utf-8");
const remaining = plan.filter((p) => p.status === "未執筆").length;
console.log(`${updated}件を公開済みに更新しました。残り: ${remaining}件`);
