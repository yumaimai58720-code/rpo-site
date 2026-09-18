# LINE自動通知 セットアップ手順

`send_line.py` を使ってorchestratorが完全自動でLINEに通知できるようにするための手順です。
**この設定はローカルのClaude Code環境(あなたのPC)で行ってください。**
(LINE Notifyは2025年3月末に終了しているため、後継のLINE Messaging APIを使用します)

## 1. 配置場所

`rpo-site` リポジトリ直下に `scripts/send_line.py` を配置してください。

```
C:\Users\yumai\rpo-site\scripts\send_line.py
```

## 2. LINE公式アカウントを作成

1. https://entry.line.biz/start/jp/ にアクセスし、LINE公式アカウントを作成(無料)
2. 作成したアカウントの管理画面(LINE Official Account Manager)にログイン

## 3. Messaging APIを有効化

1. LINE Official Account Managerの「設定」→「Messaging API」を開く
2. 「Messaging APIを利用する」を選択
3. LINE Developersコンソール(https://developers.line.biz/) と連携される
4. 対象のプロバイダー・チャネルを選択し、Messaging APIチャネルの管理画面に入る

## 4. チャネルアクセストークンを発行

1. LINE Developersコンソールで対象チャネルを開く
2. 「Messaging API設定」タブ内の「チャネルアクセストークン(長期)」で「発行」をクリック
3. 発行されたトークンをコピーしておく(後で使用)

## 5. 通知を受け取るLINEアカウントを友だち追加

1. 同じ「Messaging API設定」タブに表示されるQRコードを、通知を受け取りたいLINEアカウント(自分のLINE)で読み取り、友だち追加する
2. 応答メッセージ・あいさつメッセージなどはOFFにしておくと通知専用として使いやすい(「Messaging API設定」または管理画面の「応答設定」で変更可能)

## 6. 自分のuserIdを取得

userIdの取得方法はいくつかありますが、簡単な方法は以下です。

1. LINE Developersコンソールの「Messaging API設定」タブ下部にある「Webhook URL」設定と「Webhookの利用」をONにする
2. 簡易的な方法として、LINE公式アカウントに何かメッセージを送った際にWebhookで届くイベントの中の `source.userId` を確認する
   - Webhook受信用の簡単なサーバーが必要なため、難しい場合は下記の代替手段を使う

**代替手段(Webhookサーバーを用意しなくてよい方法):**
LINE Developersコンソールの「Messaging API設定」タブにある「あなたのユーザーID」という項目に、
**あなた自身(公式アカウントの管理者)のuserId**が表示されている場合があります。まずはそちらを確認してください。

## 7. line_config.jsonを作成

`scripts/send_line.py` と同じフォルダに `line_config.json` を作成し、以下の内容を記入:

```json
{
  "channel_access_token": "手順4で発行したトークン",
  "to_user_id": "手順6で取得したuserId"
}
```

## 8. テスト送信

```
python scripts/send_line.py --message "セットアップ完了確認"
```

自分のLINEに通知が届けば成功です。

## 注意事項

- `line_config.json` は**通知送信権限そのもの**なので、`.gitignore` に追加してGitリポジトリにコミットしないでください

```
# .gitignore に追記
scripts/line_config.json
```

- 無料枠は月200通まで(送信人数×メッセージ数でカウント)。1人宛の通知のみなら、日次の運用で十分収まる想定です
- チャネルアクセストークン(長期)は無期限ですが、LINE Developersコンソールでいつでも再発行・無効化できます
