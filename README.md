# RPOサイト(今井雄馬) — 引き継ぎメモ

## 現在の構成

- `index.html` — トップページ
- `template.html` — 地域別LPテンプレート(19市)
- `template-industry.html` — 業界別LPテンプレート(強化版:選ばれる理由/導入フロー/FAQ付き)
- `template-blog-combo.html` — 地域×業界ブログ記事テンプレート
- `build.js` — 地域別LP19本を生成(`node build.js`)
- `build-industries.js` — 業界別LP10本を生成(`node build-industries.js`)
- `build-blog.js` — ブログ記事を生成(`node build-blog.js`、既存の手書き記事は上書きしない)
- `build-blog-index.js` — 公開済み記事を `pages/blog/index.html` に追記(`node build-blog-index.js`)
- `update-plan-status.js` — `pages/blog/` の実ファイルに基づき `assets/blog-plan-190.json` のstatusを更新
- `DAILY-BLOG-TASK.md` — /schedule のクラウドルーティンが毎日参照するブログ拡張タスクの手順書
- `assets/cities.json` — 19市のデータ
- `assets/industries.json` — 10業界のデータ(課題3項目ずつ)
- `assets/city-context.json` — ブログ生成対象市の背景データ
- `assets/blog-plan-190.json` — 地域×業界(19×10=190件)の**記事企画データ**
- `assets/styles.css` — 共通デザイントークン・CSS
- `assets/sakurajima.svg` — ヒーロー用イラスト
- `pages/` — 生成済みの地域別LP(19本)
- `pages/industries/` — 生成済みの業界別LP(10本・強化版)
- `pages/blog/` — 生成済みのブログ記事、`index.html`は記事一覧の静的ページ
- `pages/company/` — 会社概要・料金・プライバシーポリシー・利用規約・お問い合わせフォーム・無料求人診断の静的ページ

## 未確定・仮の項目

- **屋号**: 「薩摩人事舎」は廃止し、個人名「今井雄馬」で運営する方針に確定。全ファイル(会社概要・料金・プライバシーポリシー・利用規約・お問い合わせフォーム・求人診断・ブログ記事含む)から置換済み
- **代表者名**: 今井雄馬(確定済み。表記は「今井雄馬」でスペースなしに統一)
- **問い合わせ先メール**: inforecruit58720@gmail.com(確定済み。`pages/company/contact.html` は formsubmit.co 経由の実フォーム、他ページのCTAは `mailto:` または `contact.html` へのリンク)
- **実績・導入事例**: まだ掲載していない(実績が貯まってから追加する方針。Carrariaのような事例セクションは意図的に省略している)
- **本番ドメイン**: 未取得のため、`pages/blog/`配下の全記事・`template-blog-combo.html`のOGPメタタグ(og:url, og:image等)とJSON-LD(mainEntityOfPage, LocalBusinessのurl等)は仮に`https://example.com`をベースURLとして記載している。ドメイン取得後、`https://example.com`を実際のドメインに一括置換すること

## 方針転換の経緯(重要)

当初「19市 × 10業界 = 190本」を**LPとして機械的に量産**する計画だったが、競合(Carraria)を実際に調査した結果、以下が判明:

- Carrariaは地域LPを**都道府県単位で1本のみ**、内容を厚く作り込んでいた(実績数値・選ばれる理由・導入事例3本・導入フロー・FAQ6問)
- 地域×業界の掛け合わせは、LPではなく**ブログ記事として個別に**書かれていた(テンプレート量産ではない)

これを踏まえ、190本の機械的なLP量産は行わず、`assets/blog-plan-190.json` に**記事企画データ**として保持する方針に変更した。各記事は今後、内容のある形で1本ずつ執筆していく想定。

## Claude Codeでの次のタスク候補

1. ~~屋号が決まり次第、全ファイルの「薩摩人事舎」を一括置換~~ → 完了(今井雄馬に統一)
2. `DAILY-BLOG-TASK.md` の手順で、毎日1市ずつブログ記事を追加していく(/scheduleのクラウドルーティンで自動化済み)
3. デプロイ先の決定・公開(完全な静的サイトのため、ConoHa VPS/Nginxより Netlify/Vercel等の静的ホスティングの方が運用が軽い)
4. ~~お問い合わせを `mailto:` リンクではなくフォーム化するか検討~~ → 完了(`pages/company/contact.html` をformsubmit.co経由のフォームとして実装)
5. ドメイン取得後、DNS設定
6. `pages/company/job-diagnosis.html`(無料求人診断)の診断結果を、今後もう少し精緻化するか検討
