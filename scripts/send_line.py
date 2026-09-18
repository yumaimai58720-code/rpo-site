#!/usr/bin/env python3
"""
RPOサイト通知用 LINE自動送信スクリプト(LINE Messaging API使用)

LINE Notifyは2025年3月末にサービス終了しているため、後継の
LINE Messaging API(LINE公式アカウント経由のpushメッセージ)を使用する。
月200通まで無料。

使い方:
  python send_line.py --message "本文"
  echo "本文をパイプで渡すことも可能" | python send_line.py --message-stdin

事前準備:
  1. LINE公式アカウントを作成し、Messaging APIを有効化
  2. チャネルアクセストークン(長期)を発行
  3. 通知を受け取りたいLINEアカウントの userId を取得
  4. line_config.json に channel_access_token と to_user_id を設定
  詳細は SETUP_LINE.md を参照
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(SCRIPT_DIR, "line_config.json")

LINE_PUSH_ENDPOINT = "https://api.line.me/v2/bot/message/push"

# LINEメッセージは1通あたり最大5000文字程度が安全な目安
MAX_MESSAGE_LENGTH = 4900


def load_config() -> dict:
    if not os.path.exists(CONFIG_PATH):
        print(
            f"エラー: {CONFIG_PATH} が見つかりません。"
            "SETUP_LINE.mdの手順に従い、channel_access_tokenとto_user_idを設定してください。",
            file=sys.stderr,
        )
        sys.exit(1)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def send_line_message(message: str) -> None:
    config = load_config()
    token = config.get("channel_access_token")
    to_user_id = config.get("to_user_id")

    if not token or not to_user_id:
        print(
            "エラー: line_config.json に channel_access_token または to_user_id が"
            "設定されていません。",
            file=sys.stderr,
        )
        sys.exit(1)

    if len(message) > MAX_MESSAGE_LENGTH:
        message = message[:MAX_MESSAGE_LENGTH] + "\n…(以下省略)"

    payload = {
        "to": to_user_id,
        "messages": [{"type": "text", "text": message}],
    }

    req = urllib.request.Request(
        LINE_PUSH_ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            print(f"送信完了: status = {resp.status}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"送信失敗: status = {e.code}, response = {body}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="RPOサイト通知LINE自動送信")
    parser.add_argument("--message", help="通知メッセージ(直接指定)")
    parser.add_argument(
        "--message-stdin",
        action="store_true",
        help="メッセージを標準入力から読み込む(長文の場合に使用)",
    )
    args = parser.parse_args()

    if args.message_stdin:
        message = sys.stdin.read()
    elif args.message:
        message = args.message
    else:
        print("エラー: --message か --message-stdin のどちらかを指定してください。", file=sys.stderr)
        sys.exit(1)

    send_line_message(message)


if __name__ == "__main__":
    main()
