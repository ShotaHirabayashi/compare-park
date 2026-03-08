# Compare Park - 車種×駐車場マッチングメディア 実装計画

## Context
都内（23区内）で「この車種がこの駐車場に停められるか」を判定できる検索型メディアサイトを構築する。
車種の寸法データと駐車場の制限寸法データをDB化し、マッチング判定を行う。
ターゲットユーザーは「車の購入検討者」と「駐車場を探す人」の両方。

---

## 決定事項（ヒアリング結果）
- **サイト名**: Compare Park
- **対象車種**: 国産＋主要輸入車（Lexus, BMW, Mercedes, Audi, Volvo等）
- **対象エリア**: 東京23区内
- **車種データ**: グーネット（goo-net.com）カタログからスクレイピング
- **駐車場データ**: 手動入力から開始（機械式駐車場を優先）
- **MVP形態**: 検索型メディア（車種選択→停められる駐車場一覧＋地図）
- **リポジトリ**: `/Users/hirabayashi/Repositories/compare-park`

---

## 技術スタック
| カテゴリ | 選定 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4 + shadcn/ui |
| DB | Supabase (PostgreSQL + PostGIS) |
| ORM | Drizzle ORM |
| 地図 | Mapbox GL JS (react-map-gl) |
| デプロイ | Vercel |
| CRON | Vercel Cron Jobs |
| CI/CD | GitHub → Vercel 自動デプロイ |

---

## DB設計

### 車種側（6階層）
```
makers（メーカー）
  └─ models（車種: ヤリス, RX等）
       └─ generations（世代: フルモデルチェンジ単位）
            └─ phases（フェーズ: マイナーチェンジ前期/後期）
                 └─ trims（グレード: Z 2WD CVT等）
                      └─ dimensions（寸法: 全長/全幅/全高/重量）
```

### 駐車場側
```
parking_lots（駐車場）
  ├─ vehicle_restrictions（制限: 標準/ハイルーフ等の複数パターン）
  ├─ parking_fees（料金）
  └─ operating_hours（営業時間）
```

### マッチングロジック
```sql
car.width_mm <= restriction.max_width_mm
AND car.height_mm <= restriction.max_height_mm
AND car.length_mm <= restriction.max_length_mm
AND car.weight_kg <= restriction.max_weight_kg
```

---

## ページ構成・レンダリング戦略
| パス | 内容 | レンダリング |
|------|------|-------------|
| `/` | トップ（車種検索UI） | SSG |
| `/car/[slug]` | 車種詳細＋停められる駐車場一覧＋記事コンテンツ | SSG |
| `/car/[slug]/article` | 車種ごとの詳細記事（駐車場事情、おすすめ等） | SSG |
| `/parking/[id]` | 駐車場詳細＋停められる車種一覧 | ISR (24h) |
| `/search` | 検索結果（車種×エリア） | SSR + Streaming |
| `/area/[ward]` | エリア別駐車場一覧（23区別） | SSG |
| `/articles` | 記事一覧ページ | SSG |

### 記事コンテンツ機能
各車種モデルごとに記事を作成・公開できる仕組みを用意する。
- **管理方法**: MDXファイルをリポジトリ内 `content/cars/` に配置（CMS不要でGit管理）
- **記事作成**: AI（Claude等）で下書き生成→自分で監修・編集→Git push で公開
- **記事内容例**: 「Lexus RXの駐車場事情」「アルファードが入る機械式駐車場まとめ」
- **SEO効果**: ロングテールキーワードでの流入を狙う記事コンテンツ
- **MDX構成**: frontmatterでメタデータ（車種slug、公開日、タグ等）を管理

### SEO対策
- `generateMetadata()` で車種名・駐車場名入りのタイトル/description
- 構造化データ: Vehicle, ParkingFacility, BreadcrumbList
- 動的サイトマップ (`app/sitemap.ts`)
- ロングテールキーワード: 「アルファード 駐車場 入らない」「レクサスRX 機械式」等

---

## UX/UIデザイン設計

### ペルソナ
- **A: 車購入検討者**（PC中心）: ディーラーで気になる車を見つけ、自宅マンションの駐車場に入るか確認したい
- **B: 駐車場を探す人**（モバイル100%）: 外出先で停められる駐車場を探したい

### デザインシステム
- **ブランドカラー**: ブルー系（Primary `#1B65A6` / Secondary `#3B82F6` / Accent `#F59E0B`）
  - OK/NG判定色（赤/緑）との混同を避けるため、意図的にブルーを選定
- **判定色（4層表現: 色+アイコン+テキスト+ボーダーパターン）**:
  - OK: 緑`#16A34A` + CircleCheck + 「駐車可能」+ 実線ボーダー
  - NG: 赤`#DC2626` + CircleX + 「駐車不可」+ 破線ボーダー
  - 注意: 黄`#D97706` + TriangleAlert + 「要確認」+ 点線ボーダー
- **フォント**: Inter（数値表示）+ Noto Sans JP（日本語）
- **グリッド**: PC 12カラム(max-w-7xl) / Tab 8カラム / SP 4カラム
- **shadcn/uiカスタム**: Badge に match-ok/match-ng/match-caution バリアント追加

### 3段階マッチング判定
| 判定 | 条件 | 表示 |
|------|------|------|
| OK（余裕あり） | 全寸法が制限の95%以下 | 「余裕をもって駐車できます」 |
| ギリギリ（注意） | いずれかが制限の95-100% | 「駐車可能ですが余裕が少ないです」 |
| NG（不適合） | いずれかが制限を超過 | 「この駐車場には入りません」+ 超過量表示 |

### 車種選択UI
**ハイブリッド方式**: オートコンプリート検索 + メーカードリルダウン + 人気車種ショートカット
- 上部: 車種名でインクリメンタル検索（shadcn/ui Command）
- 中部: メーカーチップ選択→車種リスト（寸法プレビュー付き）
- 下部: 人気車種4件のカード

### 検索結果レイアウト
- **PC**: 左リスト + 右地図の分割表示（SUUMO方式）
- **モバイル**: ボトムシート + 地図のハイブリッド（Google Maps方式）
  - 初期: 地図上半分 + ボトムシート下半分
  - スワイプアップでリスト全体表示
- **地図ピン色分け**: OK=緑丸 / ギリギリ=黄三角 / NG=赤バツ

### 寸法比較ビジュアル
バーゲージ方式で車の寸法 vs 駐車場制限を表示:
```
全幅  ████████████████████░░  1,855mm
      ├───── 制限: 1,900mm ─────┤ +45mm ✅
```

### NG時の離脱防止設計（重要）
- NG表示の直下に「近くのOK駐車場」を自動提案
- 幅超過時はミラー折畳み寸法での再判定を表示
- 購入検討者向け:「このサイズ感で停められる車種はこちら」

### 主要コンポーネント
| コンポーネント | 概要 |
|--------------|------|
| VehicleCard | 車画像+車名+寸法サマリー、カテゴリ色ボーダー |
| ParkingCard | 駐車場名+種別+制限値+料金+判定バッジ、判定色の左ボーダー |
| MatchBadge | OK/NG/注意の判定バッジ（4層表現） |
| DimensionCompare | バーゲージ方式の寸法比較 |
| VehicleSearchForm | メーカー→車種→年式カスケード選択 |

### アクセシビリティ
- 全判定色 WCAG 2.1 AA コントラスト比達成
- 色覚多様性対応: 色+アイコン+テキスト+ボーダーパターンの4層
- `prefers-reduced-motion: reduce` でアニメーション無効化
- キーボードナビゲーション対応

---

## 実装ステップ

### Step 1: プロジェクト初期化 + デザインシステム
- `create-next-app` でNext.js 15プロジェクト作成
- Tailwind CSS, shadcn/ui, Drizzle ORM セットアップ
- Supabaseプロジェクト作成・接続
- デザインシステム設定: カラー変数(`@theme`)、フォント(Inter + Noto Sans JP)、shadcn/uiカスタムバリアント
- **対象ファイル**: `package.json`, `next.config.ts`, `drizzle.config.ts`, `app/globals.css`, `app/layout.tsx`

### Step 2: DB スキーマ定義・マイグレーション
- Drizzle ORMでスキーマ定義（上記6階層＋駐車場テーブル）
- Supabaseへマイグレーション実行
- **対象ファイル**: `src/db/schema/` 配下

### Step 3: シードデータ投入
- 車種データ: 人気車種50台程度を手動＋グーネットから取得
  - 国産: アルファード, ヴォクシー, ハリアー, RAV4, ヤリス, プリウス, CX-5, CX-60 等
  - 輸入車: Lexus RX/NX, BMW X3/X5, Mercedes GLC 等
- 駐車場データ: 23区内の主要機械式駐車場20-30件を手動入力
  - 一般的な制限パターン（標準: 155cm, ハイルーフ: 200cm等）
- **対象ファイル**: `src/db/seed/` 配下, スクレイピングスクリプト

### Step 4: 検索UI・フロントエンド実装
- トップページ: メーカー→車種→エリア選択UI
- 車種詳細ページ: 寸法表示＋停められる駐車場リスト＋記事コンテンツ
- 駐車場詳細ページ: 制限値＋対応車種リスト
- 地図表示: Mapbox GL JSで駐車場位置をピン表示
- マッチング判定: OK/NG＋不適合理由（「幅が30mm超過」等）
- 記事一覧・記事詳細ページ: MDXレンダリング（next-mdx-remote）
- **対象ファイル**: `src/app/` 配下, `content/cars/` 配下

### Step 5: デプロイ・公開
- Vercelへデプロイ
- ドメイン設定
- Google Analytics 4, Google Search Console 設定

### Step 6: データ拡充（公開後）
- グーネットスクレイピングの自動化（Vercel Cron）
- 駐車場データの段階的追加
- ユーザーフィードバック機能（「この駐車場の情報が違う」等）

---

## 収益化ロードマップ
1. **Phase 1 (0-6ヶ月)**: Google AdSense
2. **Phase 2 (6-12ヶ月)**: 駐車場予約アフィリエイト（akippa/特P/タイムズB）
3. **Phase 3 (12ヶ月〜)**: 駐車場運営会社への有料掲載枠

---

## 検証方法
1. `npm run dev` でローカル開発サーバー起動、全ページの表示確認
2. 車種選択→マッチング結果が正しく表示されることを確認
3. Lighthouse でパフォーマンス・SEO スコアを確認
4. Vercel Preview デプロイで本番環境に近い状態で動作確認
5. 実際の車種寸法と駐車場制限値で判定結果の正確性を検証
