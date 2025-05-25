# AWS Certified AI Practitioner 模擬試験アプリ

Next.js で構築された AWS Certified AI Practitioner 向けの模擬試験アプリケーションです。

## 機能

- 10 問の模擬試験問題
- ランダムな順序での問題出題
- 解答選択と採点機能
- 結果画面での解説と正答率の表示

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- マークダウンによる問題データ管理

## 開発方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm run start
```

## 問題データ

問題データは `src/data/questions` ディレクトリ内のマークダウンファイルで管理されています。各ファイルには問題文、選択肢、正解、解説が含まれています。

## 開発について

このアプリケーションは、Amazon Q（AWS 公式の AI アシスタント）を使用した Vibe Coding で開発されました。Amazon Q は、コード生成、問題解決、AWS 関連の質問への回答など、開発プロセス全体をサポートしました。

## ライセンス

MIT
