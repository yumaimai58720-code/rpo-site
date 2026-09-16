// assets/blog-plan-190.json の status を pages/blog/ の実ファイルの有無に基づいて更新する。
// 実行: node update-plan-status.js

const fs = require("fs");
const path = require("path");

const root = __dirname;
const planPath = path.join(root, "assets/blog-plan-190.json");
const plan = JSON.parse(fs.readFileSync(planPath, "utf-8"));

let changed = 0;

for (const item of plan) {
  const exists = fs.existsSync(path.join(root, "pages/blog", `${item.slug}.html`));
  const nextStatus = exists ? "公開済み" : "未執筆";
  if (item.status !== nextStatus) {
    item.status = nextStatus;
    changed++;
  }
}

fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + "\n", "utf-8");

const published = plan.filter((i) => i.status === "公開済み").length;
console.log(`ステータスを${changed}件更新しました。公開済み: ${published}件 / 全${plan.length}件`);
