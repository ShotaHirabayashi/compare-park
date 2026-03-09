# トメピタ (Tomepita) — CLAUDE.md

## プロジェクト概要

車種×駐車場マッチングメディア。車種の実寸法と駐車場の制限サイズを比較し「停められるか」を3段階（OK/ギリギリ/NG）で判定する。

- **本番URL**: https://www.tomepita.com
- **リポジトリ**: compare-park

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 + shadcn/ui (base-ui) |
| DB | Turso (libSQL) + Drizzle ORM |
| 記事基盤 | MDX (next-mdx-remote v6 + gray-matter + remark-gfm) |
| デプロイ | Vercel |
| 分析 | Google Analytics (G-Z9J1ERR28F) |

## ディレクトリ構造

```
src/
  app/              # App Router ページ
    articles/       # コラム一覧 + [...slug] 個別記事
    car/[slug]      # 車種ページ
    area/[ward]     # エリアページ
    parking/[slug]  # 駐車場ページ
    maker/[slug]    # メーカーページ
    check/          # 判定ページ
    search/         # 検索
  components/       # UIコンポーネント
  db/
    schema/         # Drizzle スキーマ定義
    seed/           # シードデータ
  lib/
    articles.ts     # MDX記事ユーティリティ
    constants.ts    # 定数（TOKYO_WARDS等）
    matching.ts     # サイズ判定ロジック
    queries.ts      # DBクエリ
    utils.ts        # ユーティリティ
content/            # MDX記事ファイル（Git管理）
  cars/             # 車種別ガイド
  knowledge/        # 知識・ハウツー
  size-guide/       # サイズ規格別
  area/             # エリア別（未使用）
  compare/          # 車種比較（未使用）
```

## DB スキーマ（6階層）

makers → models → generations → phases → trims → dimensions

駐車場: parking_lots → vehicle_restrictions (1:N)

## コマンド

```bash
npm run dev          # 開発サーバー
npm run build        # ビルド（npx next build）
npm run lint         # ESLint
npm run db:generate  # Drizzle マイグレーション生成
npm run db:migrate   # マイグレーション実行
npm run db:push      # スキーマ push
npm run db:studio    # Drizzle Studio
npm run db:seed      # シードデータ投入
vercel --prod        # 本番デプロイ
```

## デザインルール

- **ブランドカラー**: ブルー系 (#1B65A6 / oklch(0.48 0.12 250))
- **判定色**: OK=緑(#16A34A) / NG=赤(#DC2626) / ギリギリ=黄(#D97706)
- **フォント**: Inter + Noto Sans JP
- **角丸**: 0.625rem ベース

---

## コラム記事の書き方

### 記事の追加方法

1. `content/<category>/` にMDXファイルを作成
2. ビルド・デプロイすれば自動で一覧・個別ページ・サイトマップに反映

### カテゴリ一覧

| カテゴリ | ディレクトリ | 説明 |
|---------|-------------|------|
| 車種別ガイド | `content/cars/` | 車種ごとの駐車場適合ガイド |
| サイズ規格別 | `content/size-guide/` | 特定サイズ制限に入る車種まとめ |
| エリア別 | `content/area/` | エリアの駐車場サイズまとめ |
| 知識・ハウツー | `content/knowledge/` | 機械式駐車場の基礎知識 |
| 車種比較 | `content/compare/` | 2車種の駐車場サイズ比較 |

### フロントマター仕様

```yaml
---
title: "記事タイトル（SEO用、50〜60文字目安）"
description: "meta description（120文字以内）"
category: "cars"           # cars / size-guide / area / knowledge / compare
carSlug: "alphard"         # 車種ページへのリンク用（任意、carsカテゴリ推奨）
date: "2026-03-09"         # 公開日 YYYY-MM-DD
updatedAt: "2026-03-09"    # 更新日 YYYY-MM-DD（任意）
tags: ["アルファード", "トヨタ"]  # タグ（任意）
---
```

### slug の決まり方

ファイルパスから自動生成: `content/cars/alphard.mdx` → `/articles/cars/alphard`

### MDX記述ルール

- **テーブル**: Markdownのパイプ記法がそのまま使える（remark-gfm有効）
- **内部リンク**: `[リンクテキスト](/car/alphard)` の形式で記述
- **太字・強調**: `**太字**` が使える
- **絵文字**: ✅ ❌ ⚠️ などそのまま使用可能
- **見出し**: h2(`##`)から開始。h1は記事タイトルが自動設定されるため使わない

### 車種記事テンプレート

```mdx
---
title: "〇〇は機械式駐車場に入る？サイズ制限と対応駐車場ガイド"
description: "..."
category: "cars"
carSlug: "model-slug"
date: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
tags: ["車種名", "メーカー", "ボディタイプ", "機械式駐車場"]
---

## 〇〇の寸法スペック

（車種の紹介文）

### 現行モデルの寸法

| 項目 | サイズ |
|------|--------|
| 全長 | X,XXXmm |
| 全幅 | X,XXXmm |
| 全高 | X,XXXmm |

## 機械式駐車場に入るか？

（結論を先に述べる）

### 各サイズ制限での判定

| 制限 | 全長 | 全幅 | 全高 | 判定 |
|------|------|------|------|------|
| 普通車（1550mm） | ... | ... | ... | ❌ NG |
| ハイルーフ（1800mm） | ... | ... | ... | ⚠️ 要確認 |
| 大型車（2000mm） | ... | ... | ... | ✅ OK |

## 〇〇が入る駐車場の条件

（必要な制限値リスト）

## トメピタで駐車場適合を確認

[〇〇の駐車場適合を確認する →](/car/model-slug)

## まとめ

（箇条書きで要点）
```

## SEO対応状況

- canonical URL 全ページ設定済み
- Article JSON-LD（コラム記事）
- BreadcrumbList JSON-LD（全ページ）
- WebSite JSON-LD（トップ）
- sitemap.xml 動的生成（車種・駐車場・エリア・メーカー・記事）
- robots.txt 設定済み
- セキュリティヘッダー（CSP以外）設定済み
- OGP / Twitter Card 対応
- ISR: 記事=24h, 車種=24h, 駐車場=1w, エリア=24h
