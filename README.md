# AWS Certified AI Practitioner 模擬試験アプリ

Next.jsで構築されたAWS Certified AI Practitioner向けの模擬試験アプリケーションです。

## 機能

- 10問の模擬試験問題
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

## ライセンス

MIT