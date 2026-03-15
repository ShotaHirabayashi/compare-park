# サイト構造・URL階層設計

**現状 + 推奨拡張の統合設計**

---

## 1. 現在のURL階層

```
tomepita.com/
│
├── /                              # ホーム（判定フォーム + 人気車種）
├── /car                           # 車種一覧（メーカー別グループ）
│   └── /car/[slug]                # 車種詳細（寸法 + 適合判定）
│       例: /car/alphard
│
├── /maker/[slug]                  # メーカー別車種一覧
│   例: /maker/toyota
│
├── /area                          # エリア一覧（東京23区）
│   └── /area/[ward]               # エリア別駐車場一覧
│       └── /area/[ward]/car/[slug] # エリア×車種 マッチング結果
│           例: /area/minato/car/alphard
│
├── /parking/[slug]                # 駐車場詳細
│   例: /parking/times-minato-xxx
├── /parking/size                  # サイズ条件インデックス
│   └── /parking/size/[category]   # サイズ条件別駐車場一覧
│       例: /parking/size/height-1550
│
├── /articles                      # コラム一覧
│   └── /articles/[...slug]        # コラム個別記事
│       例: /articles/cars/alphard
│       例: /articles/knowledge/mechanical-parking-size-guide
│
├── /check                         # 即判定ページ（?car=X&parking=Y）
├── /search                        # 検索結果（?car=X&ward=Y）
├── /about                         # サイト概要
├── /terms                         # 利用規約
└── /privacy                       # プライバシーポリシー
```

---

## 2. ページ数の推定

| ページタイプ | URL | 推定ページ数 | 増加方向 |
|------------|-----|------------|---------|
| ホーム | / | 1 | 固定 |
| 車種一覧 | /car | 1 | 固定 |
| 車種詳細 | /car/[slug] | 204 | 車種追加で増加 |
| メーカー別 | /maker/[slug] | 38 | メーカー追加で増加 |
| エリア一覧 | /area | 1 | 固定 |
| エリア別 | /area/[ward] | 23 | エリア拡大で増加 |
| エリア×車種 | /area/[ward]/car/[slug] | 4,692 | 車種×エリアで増加 |
| 駐車場詳細 | /parking/[slug] | 数百〜数千 | データ追加で増加 |
| サイズ条件 | /parking/size/[category] | 9 | カテゴリ追加で増加 |
| コラム記事 | /articles/[...slug] | 14→165目標 | 記事追加で増加 |
| 静的ページ | /about, /terms, /privacy等 | 5 | 固定 |
| **合計** | | **約5,000+** | |

---

## 3. 推奨拡張: 新規ページタイプ

### 3-1. ボディタイプ別一覧ページ（推奨）

```
/car/type/[bodyType]
  例: /car/type/suv
      /car/type/minivan
      /car/type/sedan
      /car/type/kei
      /car/type/imported
```

**目的**: 「SUV 機械式駐車場」等のボディタイプ検索をキャッチ
**実装**: サイズガイド記事（content/size-guide/）で対応可能。専用ルートは将来検討。

### 3-2. 比較ページ（content/compare/で対応）

```
/articles/compare/[slug]
  例: /articles/compare/harrier-vs-rav4
      /articles/compare/voxy-vs-serena-vs-stepwgn
```

**目的**: 「ハリアー RAV4 比較 サイズ」等の比較検索をキャッチ

### 3-3. 著者ページ（将来検討）

```
/authors/[slug]
  例: /authors/tomepita-editor
```

**目的**: E-E-A-T強化。Person スキーマで著者の専門性を明示。

---

## 4. 構造化データマッピング

| ページタイプ | 実装済みJSON-LD | 追加推奨 |
|------------|----------------|---------|
| ホーム | WebSite, FAQPage, SearchAction | Organization |
| 車種詳細 | Car, FAQPage | Product（適合判定サービスとして） |
| 駐車場詳細 | ParkingFacility, FAQPage, OpeningHoursSpec | — |
| エリア別 | (なし) | **CollectionPage, ItemList** |
| コラム一覧 | CollectionPage, ItemList | — |
| コラム記事 | Article | **Person（著者）** |
| 車種一覧 | CollectionPage, ItemList | — |
| メーカー別 | (なし) | CollectionPage |
| サイズ別 | ItemList | — |
| About | Organization | — |
| 即判定 | WebPage | — |

---

## 5. 内部リンクフロー設計

### ユーザージャーニー別の導線

```
■ ジャーニー1: 車種名で検索して来たユーザー
Google検索「アルファード 機械式駐車場」
  → /articles/cars/alphard（記事）
    → /car/alphard（車種ページで詳細確認）
      → /area/minato/car/alphard（エリア別で実際の駐車場を探す）
        → /parking/xxx（駐車場詳細で料金・アクセス確認）

■ ジャーニー2: 知識を求めて来たユーザー
Google検索「機械式駐車場 高さ制限」
  → /articles/knowledge/mechanical-parking-size-guide
    → /parking/size/height-1550（該当する駐車場を探す）
    → /car/yaris-cross（入る車種を確認）

■ ジャーニー3: エリアで探すユーザー
Google検索「港区 駐車場 サイズ制限」
  → /area/minato
    → /area/minato/car/alphard（自分の車で停められるか確認）
    → /parking/xxx（具体的な駐車場へ）

■ ジャーニー4: 比較検討ユーザー
Google検索「ハリアー RAV4 サイズ比較」
  → /articles/compare/harrier-vs-rav4
    → /car/harrier, /car/rav4（各車種の詳細へ）
```

### リンク密度の目標

| リンク元 → リンク先 | 目標リンク数/ページ |
|-------------------|-----------------|
| 車種記事 → 車種ページ | 1（carSlug） |
| 車種記事 → 判定ツール | 1 |
| 車種記事 → 関連車種記事 | 2-3 |
| 車種記事 → 知識記事 | 1-2 |
| 知識記事 → 車種ページ群 | 5-10 |
| 知識記事 → サイズ別ページ | 2-3 |
| 比較記事 → 両車種ページ | 2 |
| 車種ページ → 車種記事 | 1（該当記事がある場合） |
| エリアページ → エリア記事 | 1（該当記事がある場合） |

---

## 6. サイトマップ構成（現状維持 + 拡張）

```xml
<!-- sitemap.xml（動的生成） -->
<!-- 優先度・更新頻度の設定方針 -->

priority 1.0: / （ホーム）
priority 0.8: /car, /area, /articles, /parking/size
priority 0.7: /car/[slug], /parking/[slug], /articles/[...slug]
priority 0.6: /maker/[slug], /area/[ward], /parking/size/[category]
priority 0.5: /area/[ward]/car/[slug]
priority 0.2: /about, /terms, /privacy
```

**将来検討**: ページ数が1万を超えた場合、サイトマップインデックス分割を検討
