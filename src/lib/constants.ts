/** 東京23区（slug付き） */
export const TOKYO_WARD_MAP = [
  { name: "千代田区", slug: "chiyoda", lat: 35.694, lng: 139.753 },
  { name: "中央区", slug: "chuo", lat: 35.670, lng: 139.771 },
  { name: "港区", slug: "minato", lat: 35.658, lng: 139.751 },
  { name: "新宿区", slug: "shinjuku", lat: 35.693, lng: 139.703 },
  { name: "文京区", slug: "bunkyo", lat: 35.707, lng: 139.752 },
  { name: "台東区", slug: "taito", lat: 35.712, lng: 139.779 },
  { name: "墨田区", slug: "sumida", lat: 35.710, lng: 139.817 },
  { name: "江東区", slug: "koto", lat: 35.672, lng: 139.817 },
  { name: "品川区", slug: "shinagawa", lat: 35.609, lng: 139.730 },
  { name: "目黒区", slug: "meguro", lat: 35.641, lng: 139.698 },
  { name: "大田区", slug: "ota", lat: 35.561, lng: 139.716 },
  { name: "世田谷区", slug: "setagaya", lat: 35.646, lng: 139.653 },
  { name: "渋谷区", slug: "shibuya", lat: 35.661, lng: 139.702 },
  { name: "中野区", slug: "nakano", lat: 35.707, lng: 139.663 },
  { name: "杉並区", slug: "suginami", lat: 35.699, lng: 139.636 },
  { name: "豊島区", slug: "toshima", lat: 35.733, lng: 139.719 },
  { name: "北区", slug: "kita", lat: 35.752, lng: 139.734 },
  { name: "荒川区", slug: "arakawa", lat: 35.735, lng: 139.783 },
  { name: "板橋区", slug: "itabashi", lat: 35.751, lng: 139.684 },
  { name: "練馬区", slug: "nerima", lat: 35.735, lng: 139.651 },
  { name: "足立区", slug: "adachi", lat: 35.775, lng: 139.804 },
  { name: "葛飾区", slug: "katsushika", lat: 35.743, lng: 139.851 },
  { name: "江戸川区", slug: "edogawa", lat: 35.683, lng: 139.865 },
] as const;

/** 後方互換: 区名の配列 */
export const TOKYO_WARDS = TOKYO_WARD_MAP.map((w) => w.name);

export type TokyoWard = (typeof TOKYO_WARD_MAP)[number]["name"];

/** slugから区名を取得 */
export function getWardBySlug(slug: string) {
  return TOKYO_WARD_MAP.find((w) => w.slug === slug);
}

/** 区名からslugを取得 */
export function getWardSlug(name: string) {
  return TOKYO_WARD_MAP.find((w) => w.name === name)?.slug;
}

/** サイズカテゴリ型定義 */
export interface SizeCategory {
  slug: string;
  dimension: "height" | "width" | "length";
  thresholdMm: number;
  label: string;
  shortLabel: string;
  description: string;
  seoTitle: string;
}

/** サイズカテゴリ一覧 */
export const SIZE_CATEGORIES: SizeCategory[] = [
  {
    slug: "height-1550",
    dimension: "height",
    thresholdMm: 1550,
    label: "全高1,550mm以上OK（普通車対応）",
    shortLabel: "普通車対応",
    description:
      "全高制限1,550mm以上の駐車場一覧。セダンやコンパクトカーが停められる駐車場を探せます。",
    seoTitle: "全高1,550mm以上OKの駐車場一覧（普通車対応）",
  },
  {
    slug: "height-1800",
    dimension: "height",
    thresholdMm: 1800,
    label: "全高1,800mm以上OK（ハイルーフ対応）",
    shortLabel: "ハイルーフ対応",
    description:
      "全高制限1,800mm以上の駐車場一覧。SUVやミニバンなどハイルーフ車が停められる駐車場を探せます。",
    seoTitle: "全高1,800mm以上OKの駐車場一覧（ハイルーフ対応）",
  },
  {
    slug: "height-2000",
    dimension: "height",
    thresholdMm: 2000,
    label: "全高2,000mm以上OK（大型車対応）",
    shortLabel: "大型車対応",
    description:
      "全高制限2,000mm以上の駐車場一覧。アルファードやハイエースなど大型車が停められる駐車場を探せます。",
    seoTitle: "全高2,000mm以上OKの駐車場一覧（大型車対応）",
  },
  {
    slug: "width-1850",
    dimension: "width",
    thresholdMm: 1850,
    label: "全幅1,850mm以上OK",
    shortLabel: "全幅1,850mm以上",
    description:
      "全幅制限1,850mm以上の駐車場一覧。幅広の車が停められる駐車場を探せます。",
    seoTitle: "全幅1,850mm以上OKの駐車場一覧",
  },
  {
    slug: "width-1900",
    dimension: "width",
    thresholdMm: 1900,
    label: "全幅1,900mm以上OK",
    shortLabel: "全幅1,900mm以上",
    description:
      "全幅制限1,900mm以上の駐車場一覧。ワイドボディのSUVや輸入車が停められる駐車場を探せます。",
    seoTitle: "全幅1,900mm以上OKの駐車場一覧",
  },
  {
    slug: "width-1950",
    dimension: "width",
    thresholdMm: 1950,
    label: "全幅1,950mm以上OK",
    shortLabel: "全幅1,950mm以上",
    description:
      "全幅制限1,950mm以上の駐車場一覧。大型SUVや輸入車が停められる駐車場を探せます。",
    seoTitle: "全幅1,950mm以上OKの駐車場一覧",
  },
  {
    slug: "width-2050",
    dimension: "width",
    thresholdMm: 2050,
    label: "全幅2,050mm以上OK",
    shortLabel: "全幅2,050mm以上",
    description:
      "全幅制限2,050mm以上の駐車場一覧。大型輸入車やフルサイズSUVが停められる駐車場を探せます。",
    seoTitle: "全幅2,050mm以上OKの駐車場一覧",
  },
  {
    slug: "length-5000",
    dimension: "length",
    thresholdMm: 5000,
    label: "全長5,000mm以上OK",
    shortLabel: "全長5,000mm以上",
    description:
      "全長制限5,000mm以上の駐車場一覧。大型セダンやミニバンが停められる駐車場を探せます。",
    seoTitle: "全長5,000mm以上OKの駐車場一覧",
  },
  {
    slug: "length-5300",
    dimension: "length",
    thresholdMm: 5300,
    label: "全長5,300mm以上OK",
    shortLabel: "全長5,300mm以上",
    description:
      "全長制限5,300mm以上の駐車場一覧。フルサイズSUVや大型ミニバンが停められる駐車場を探せます。",
    seoTitle: "全長5,300mm以上OKの駐車場一覧",
  },
] as const;

/** slugからサイズカテゴリを取得 */
export function getSizeCategoryBySlug(slug: string): SizeCategory | undefined {
  return SIZE_CATEGORIES.find((c) => c.slug === slug);
}

/** FAQ項目 */
export const FAQ_ITEMS = [
  {
    question: "トメピタとはどんなサービスですか？",
    answer:
      "トメピタは、お持ちの車が特定の駐車場に停められるかどうかを瞬時に判定するサービスです。車種の寸法（全長・全幅・全高・重量）と駐車場の制限サイズを比較し、OK・ギリギリ・NGの3段階で結果を表示します。",
  },
  {
    question: "対応エリアはどこですか？",
    answer:
      "現在は東京23区内の駐車場を中心にデータを登録しています。今後、対応エリアを順次拡大していく予定です。",
  },
  {
    question: "利用料金はかかりますか？",
    answer:
      "トメピタは完全無料でご利用いただけます。会員登録も不要です。",
  },
] as const;
