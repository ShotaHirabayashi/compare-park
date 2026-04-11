/**
 * 差分シードスクリプト: 駐車場データの追加分のみ投入
 *
 * 既存データを削除せず、slugが存在しない駐車場のみ追加する。
 * レートリミットを回避するため、1件ずつ投入し、間にディレイを入れる。
 *
 * 使い方:
 *   npx tsx src/db/seed/add-parking.ts
 *   npx tsx src/db/seed/add-parking.ts --dry-run  (実際には投入しない)
 */
import { config } from "dotenv";
import { resolve } from "path";

// .env.production → .env.local → .env の順で読み込み
config({ path: resolve(process.cwd(), ".env.production") });
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

// DB接続とスキーマは addParking() 内で動的importする

// ============================================================
// 追加駐車場データ
// ============================================================
interface ParkingLotSeed {
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  parkingType: "mechanical" | "self_propelled" | "flat" | "tower";
  totalSpaces: number;
  facilityType?: "coin_parking" | "department_store" | "commercial_facility" | "office_building" | "stadium" | "hospital" | "station" | "residential" | "tower_parking" | "public_facility" | "hotel" | "airport" | "other";
  restrictions: {
    name: string;
    maxLengthMm: number;
    maxWidthMm: number;
    maxHeightMm: number;
    maxWeightKg: number;
    spacesCount: number;
    notes?: string;
  }[];
  fees: {
    feeType: "hourly" | "daily" | "monthly";
    amountYen: number;
    durationMinutes?: number;
    notes?: string;
  }[];
  is24h: boolean;
  openTime?: string;
  closeTime?: string;
}

const newParkingData: ParkingLotSeed[] = [
  // ============================================================
  // Phase 1: 東京駅/丸の内/八重洲エリア
  // ============================================================
  {
    name: "KITTE丸の内駐車場（JPタワー）",
    slug: "kitte-marunouchi-parking",
    address: "東京都千代田区丸の内2-7-2",
    latitude: 35.6798, longitude: 139.7649,
    parkingType: "mechanical", totalSpaces: 260,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "B2自走式", maxLengthMm: 6200, maxWidthMm: 2200, maxHeightMm: 3100, maxWeightKg: 6000, spacesCount: 130 },
      { name: "B3機械式", maxLengthMm: 5300, maxWidthMm: 1950, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 130 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "23:00",
  },
  {
    name: "丸ビル駐車場（丸の内パークイン）",
    slug: "marunouchi-building-parking",
    address: "東京都千代田区丸の内2-4-1",
    latitude: 35.6815, longitude: 139.7636,
    parkingType: "self_propelled", totalSpaces: 350,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6500, maxWidthMm: 2300, maxHeightMm: 3000, maxWeightKg: 3000, spacesCount: 350 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "24:00",
  },
  {
    name: "新丸ビル駐車場（丸の内パークイン）",
    slug: "shin-marunouchi-building-parking",
    address: "東京都千代田区丸の内1-5-1",
    latitude: 35.6822, longitude: 139.7644,
    parkingType: "self_propelled", totalSpaces: 330,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6000, maxWidthMm: 2200, maxHeightMm: 3000, maxWeightKg: 3000, spacesCount: 330 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "東京ビルTOKIA駐車場（丸の内パークイン）",
    slug: "tokyo-building-tokia-parking",
    address: "東京都千代田区丸の内2-7-3",
    latitude: 35.6786, longitude: 139.7650,
    parkingType: "self_propelled", totalSpaces: 225,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6000, maxWidthMm: 2100, maxHeightMm: 3000, maxWeightKg: 3000, spacesCount: 225 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "24:00",
  },
  {
    name: "東京都八重洲駐車場",
    slug: "yaesu-underground-parking",
    address: "東京都中央区八重洲1丁目",
    latitude: 35.6808, longitude: 139.7706,
    parkingType: "self_propelled", totalSpaces: 265,
    facilityType: "public_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5200, maxWidthMm: 2100, maxHeightMm: 2000, maxWeightKg: 2500, spacesCount: 265 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "東京ミッドタウン八重洲駐車場",
    slug: "tokyo-midtown-yaesu-parking",
    address: "東京都中央区八重洲2-2-1",
    latitude: 35.6794, longitude: 139.7689,
    parkingType: "mechanical", totalSpaces: 124,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "普通車", maxLengthMm: 5600, maxWidthMm: 2050, maxHeightMm: 1550, maxWeightKg: 2500, spacesCount: 40 },
      { name: "ミドルルーフ", maxLengthMm: 5600, maxWidthMm: 2050, maxHeightMm: 1850, maxWeightKg: 2500, spacesCount: 40 },
      { name: "ハイルーフ", maxLengthMm: 5600, maxWidthMm: 2050, maxHeightMm: 2000, maxWeightKg: 2500, spacesCount: 44 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "ヤエチカパーキング",
    slug: "yaechika-parking",
    address: "東京都中央区八重洲2-1",
    latitude: 35.6795, longitude: 139.7710,
    parkingType: "self_propelled", totalSpaces: 774,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "自走式", maxLengthMm: 6000, maxWidthMm: 2000, maxHeightMm: 2100, maxWeightKg: 4000, spacesCount: 569 },
      { name: "B3F機械式ノース", maxLengthMm: 5000, maxWidthMm: 1850, maxHeightMm: 1550, maxWeightKg: 1900, spacesCount: 103 },
      { name: "B3F機械式サウス", maxLengthMm: 5000, maxWidthMm: 1800, maxHeightMm: 1550, maxWeightKg: 1900, spacesCount: 102 },
    ],
    fees: [{ feeType: "hourly", amountYen: 760, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "大手町パークビルディング駐車場",
    slug: "otemachi-park-building-parking",
    address: "東京都千代田区大手町1-1-1",
    latitude: 35.6867, longitude: 139.7630,
    parkingType: "self_propelled", totalSpaces: 180,
    facilityType: "office_building",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5250, maxWidthMm: 1900, maxHeightMm: 2050, maxWeightKg: 2500, spacesCount: 180 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "22:00",
  },
  {
    name: "大手町プレイス駐車場",
    slug: "otemachi-place-parking",
    address: "東京都千代田区大手町2-3",
    latitude: 35.6853, longitude: 139.7672,
    parkingType: "mechanical", totalSpaces: 99,
    facilityType: "office_building",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 2000, maxHeightMm: 1550, maxWeightKg: 2500, spacesCount: 50 },
      { name: "ハイルーフ", maxLengthMm: 5300, maxWidthMm: 2000, maxHeightMm: 2050, maxWeightKg: 2500, spacesCount: 49 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "23:00",
  },
  {
    name: "NEWoMan新宿駐車場（JR新宿ミライナタワー）",
    slug: "newoman-shinjuku-parking",
    address: "東京都渋谷区千駄ヶ谷5-24",
    latitude: 35.6886, longitude: 139.7017,
    parkingType: "mechanical", totalSpaces: 152,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5300, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2300, spacesCount: 152 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "08:00", closeTime: "23:30",
  },
  {
    name: "渋谷フクラス駐車場（東急プラザ渋谷）",
    slug: "shibuya-fukuras-parking",
    address: "東京都渋谷区道玄坂1-2-3",
    latitude: 35.6591, longitude: 139.6988,
    parkingType: "mechanical", totalSpaces: 50,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 1930, maxHeightMm: 1550, maxWeightKg: 2400, spacesCount: 50 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "23:00",
  },
  {
    name: "東京タワー地下駐車場",
    slug: "tokyo-tower-underground-parking",
    address: "東京都港区芝公園4-2-8",
    latitude: 35.6586, longitude: 139.7454,
    parkingType: "self_propelled", totalSpaces: 150,
    facilityType: "other",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 150 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "05:30", closeTime: "00:30",
  },
  {
    name: "日比谷駐車場",
    slug: "hibiya-parking",
    address: "東京都千代田区日比谷公園1-6",
    latitude: 35.6739, longitude: 139.7570,
    parkingType: "self_propelled", totalSpaces: 463,
    facilityType: "public_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6500, maxWidthMm: 2500, maxHeightMm: 2200, maxWeightKg: 4000, spacesCount: 463 },
    ],
    fees: [{ feeType: "hourly", amountYen: 720, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "東京国際フォーラム地下駐車場",
    slug: "tokyo-international-forum-parking",
    address: "東京都千代田区丸の内3-5-1",
    latitude: 35.6764, longitude: 139.7636,
    parkingType: "self_propelled", totalSpaces: 417,
    facilityType: "public_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5400, maxWidthMm: 1900, maxHeightMm: 2200, maxWeightKg: 2500, spacesCount: 417 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "23:30",
  },

  // ============================================================
  // Phase 2: 病院
  // ============================================================
  {
    name: "順天堂医院駐車場（1号館機械式）",
    slug: "juntendo-hospital-mechanical-parking",
    address: "東京都文京区本郷3-1-3",
    latitude: 35.7024, longitude: 139.7626,
    parkingType: "mechanical", totalSpaces: 78,
    facilityType: "hospital",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 2050, maxHeightMm: 1550, maxWeightKg: 2300, spacesCount: 78 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "20:00",
  },
  {
    name: "順天堂医院駐車場（B棟機械式）",
    slug: "juntendo-hospital-b-mechanical-parking",
    address: "東京都文京区本郷3-1-3",
    latitude: 35.7024, longitude: 139.7626,
    parkingType: "mechanical", totalSpaces: 110,
    facilityType: "hospital",
    restrictions: [
      { name: "ハイルーフ", maxLengthMm: 5600, maxWidthMm: 1950, maxHeightMm: 2050, maxWeightKg: 2300, spacesCount: 110 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "20:00",
  },
  {
    name: "聖路加国際病院駐車場",
    slug: "st-lukes-hospital-parking",
    address: "東京都中央区明石町9-1",
    latitude: 35.6671, longitude: 139.7775,
    parkingType: "self_propelled", totalSpaces: 136,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 136 },
    ],
    fees: [{ feeType: "hourly", amountYen: 550, durationMinutes: 60 }],
    is24h: false, openTime: "06:30", closeTime: "21:45",
  },
  {
    name: "虎の門病院駐車場",
    slug: "toranomon-hospital-parking",
    address: "東京都港区虎ノ門2-2-2",
    latitude: 35.6653, longitude: 139.7454,
    parkingType: "mechanical", totalSpaces: 190,
    facilityType: "hospital",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 1950, maxHeightMm: 1550, maxWeightKg: 2300, spacesCount: 95 },
      { name: "ハイルーフ", maxLengthMm: 5300, maxWidthMm: 1950, maxHeightMm: 2050, maxWeightKg: 2300, spacesCount: 95 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "20:30",
  },
  {
    name: "国立がん研究センター中央病院駐車場",
    slug: "national-cancer-center-parking",
    address: "東京都中央区築地5-1-1",
    latitude: 35.6653, longitude: 139.7682,
    parkingType: "self_propelled", totalSpaces: 391,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 391 },
    ],
    fees: [{ feeType: "hourly", amountYen: 200, durationMinutes: 60, notes: "患者30分無料" }],
    is24h: true,
  },
  {
    name: "日本医科大学付属病院駐車場",
    slug: "nippon-medical-school-hospital-parking",
    address: "東京都文京区千駄木1-1-5",
    latitude: 35.7209, longitude: 139.7590,
    parkingType: "mechanical", totalSpaces: 163,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5300, maxWidthMm: 1950, maxHeightMm: 2000, maxWeightKg: 2300, spacesCount: 163 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60, notes: "外来患者1時間無料" }],
    is24h: false, openTime: "07:00", closeTime: "21:00",
  },
  {
    name: "東京慈恵会医科大学附属病院駐車場（外来棟）",
    slug: "jikei-hospital-outpatient-parking",
    address: "東京都港区西新橋3-25-8",
    latitude: 35.6624, longitude: 139.7499,
    parkingType: "self_propelled", totalSpaces: 86,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5200, maxWidthMm: 1850, maxHeightMm: 2000, maxWeightKg: 2300, spacesCount: 86 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "21:00",
  },
  {
    name: "東京慈恵会医科大学附属病院駐車場（E棟）",
    slug: "jikei-hospital-e-building-parking",
    address: "東京都港区西新橋3-25-8",
    latitude: 35.6624, longitude: 139.7499,
    parkingType: "mechanical", totalSpaces: 52,
    facilityType: "hospital",
    restrictions: [
      { name: "普通車（小型車限定）", maxLengthMm: 4850, maxWidthMm: 1950, maxHeightMm: 1500, maxWeightKg: 1500, spacesCount: 52, notes: "タイヤ幅1,700mm以内" },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: false, openTime: "08:00", closeTime: "20:00",
  },
  {
    name: "東京医科大学病院駐車場",
    slug: "tokyo-medical-university-hospital-parking",
    address: "東京都新宿区西新宿6-7-1",
    latitude: 35.6934, longitude: 139.6919,
    parkingType: "self_propelled", totalSpaces: 409,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 409 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "日本大学病院駐車場",
    slug: "nihon-university-hospital-parking",
    address: "東京都千代田区神田駿河台2-6",
    latitude: 35.6975, longitude: 139.7624,
    parkingType: "self_propelled", totalSpaces: 214,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 214 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1200, durationMinutes: 60 }],
    is24h: false, openTime: "07:00", closeTime: "23:00",
  },
  {
    name: "昭和大学病院駐車場（A区画）",
    slug: "showa-university-hospital-a-parking",
    address: "東京都品川区旗の台1-5-8",
    latitude: 35.6084, longitude: 139.7036,
    parkingType: "mechanical", totalSpaces: 22,
    facilityType: "hospital",
    restrictions: [
      { name: "ミドルルーフ", maxLengthMm: 5150, maxWidthMm: 2000, maxHeightMm: 1800, maxWeightKg: 2300, spacesCount: 22 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60, notes: "最初30分無料" }],
    is24h: false, openTime: "07:30", closeTime: "20:00",
  },
  {
    name: "昭和大学病院駐車場（B区画）",
    slug: "showa-university-hospital-b-parking",
    address: "東京都品川区旗の台1-5-8",
    latitude: 35.6084, longitude: 139.7036,
    parkingType: "mechanical", totalSpaces: 48,
    facilityType: "hospital",
    restrictions: [
      { name: "普通車（小型車限定）", maxLengthMm: 4700, maxWidthMm: 1700, maxHeightMm: 1550, maxWeightKg: 1500, spacesCount: 48 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60, notes: "最初30分無料" }],
    is24h: false, openTime: "07:30", closeTime: "20:00",
  },
  {
    name: "東京大学医学部附属病院駐車場",
    slug: "todai-hospital-parking",
    address: "東京都文京区本郷7-3-1",
    latitude: 35.7126, longitude: 139.7653,
    parkingType: "self_propelled", totalSpaces: 301,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 301 },
    ],
    fees: [{ feeType: "hourly", amountYen: 300, durationMinutes: 60, notes: "患者30分無料" }],
    is24h: false, openTime: "07:00", closeTime: "20:30",
  },
  {
    name: "NTT東日本関東病院駐車場",
    slug: "ntt-east-kanto-hospital-parking",
    address: "東京都品川区東五反田5-9-22",
    latitude: 35.6275, longitude: 139.7231,
    parkingType: "self_propelled", totalSpaces: 150,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 150 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60 }],
    is24h: true,
  },

  // ============================================================
  // Phase 3: ホテル
  // ============================================================
  {
    name: "帝国ホテル東京駐車場",
    slug: "imperial-hotel-tokyo-parking",
    address: "東京都千代田区内幸町1-1-1",
    latitude: 35.6725, longitude: 139.7584,
    parkingType: "self_propelled", totalSpaces: 425,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6000, maxWidthMm: 1950, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 425 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1200, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "ホテルニューオータニ東京駐車場",
    slug: "hotel-new-otani-tokyo-parking",
    address: "東京都千代田区紀尾井町4-1",
    latitude: 35.6802, longitude: 139.7350,
    parkingType: "self_propelled", totalSpaces: 760,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5500, maxWidthMm: 2200, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 760 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1000, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "The Okura Tokyo駐車場",
    slug: "okura-tokyo-parking",
    address: "東京都港区虎ノ門2-10-4",
    latitude: 35.6656, longitude: 139.7444,
    parkingType: "self_propelled", totalSpaces: 200,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5300, maxWidthMm: 2100, maxHeightMm: 2200, maxWeightKg: 2500, spacesCount: 200 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1000, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "パレスホテル東京駐車場",
    slug: "palace-hotel-tokyo-parking",
    address: "東京都千代田区丸の内1-1-1",
    latitude: 35.6846, longitude: 139.7613,
    parkingType: "self_propelled", totalSpaces: 350,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6500, maxWidthMm: 3000, maxHeightMm: 2500, maxWeightKg: 3000, spacesCount: 350 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1000, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "24:00",
  },
  {
    name: "ザ・ペニンシュラ東京駐車場",
    slug: "peninsula-tokyo-parking",
    address: "東京都千代田区有楽町1-8-1",
    latitude: 35.6749, longitude: 139.7602,
    parkingType: "tower", totalSpaces: 120,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5300, maxWidthMm: 1900, maxHeightMm: 2700, maxWeightKg: 2500, spacesCount: 120 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1200, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "コンラッド東京駐車場",
    slug: "conrad-tokyo-parking",
    address: "東京都港区東新橋1-9-1",
    latitude: 35.6630, longitude: 139.7612,
    parkingType: "self_propelled", totalSpaces: 80,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5800, maxWidthMm: 1900, maxHeightMm: 2200, maxWeightKg: 2500, spacesCount: 80 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "ウェスティンホテル東京駐車場",
    slug: "westin-tokyo-parking",
    address: "東京都目黒区三田1-4-1",
    latitude: 35.6415, longitude: 139.7154,
    parkingType: "self_propelled", totalSpaces: 200,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5800, maxWidthMm: 2300, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 200 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1200, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "シャングリ・ラ東京駐車場（丸の内トラストタワー）",
    slug: "shangri-la-tokyo-parking",
    address: "東京都千代田区丸の内1-8-3",
    latitude: 35.6824, longitude: 139.7693,
    parkingType: "self_propelled", totalSpaces: 80,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6000, maxWidthMm: 2300, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 80 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "ANAインターコンチネンタルホテル東京駐車場",
    slug: "ana-intercontinental-tokyo-parking",
    address: "東京都港区赤坂1-12-33",
    latitude: 35.6681, longitude: 139.7409,
    parkingType: "self_propelled", totalSpaces: 500,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 6000, maxWidthMm: 2500, maxHeightMm: 2100, maxWeightKg: 3000, spacesCount: 500 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1200, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "ホテル椿山荘東京駐車場",
    slug: "chinzanso-tokyo-parking",
    address: "東京都文京区関口2-10-8",
    latitude: 35.7121, longitude: 139.7262,
    parkingType: "self_propelled", totalSpaces: 500,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5500, maxWidthMm: 2200, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 500 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1000, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "フォーシーズンズホテル東京大手町駐車場",
    slug: "four-seasons-otemachi-parking",
    address: "東京都千代田区大手町1-2-1",
    latitude: 35.6881, longitude: 139.7634,
    parkingType: "mechanical", totalSpaces: 80,
    facilityType: "hotel",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 2000, maxHeightMm: 1500, maxWeightKg: 2500, spacesCount: 80 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "00:30",
  },

  // ============================================================
  // Phase 4: 羽田空港
  // ============================================================
  {
    name: "羽田空港 P1駐車場（第1ターミナル）",
    slug: "haneda-airport-p1-parking",
    address: "東京都大田区羽田空港3-3-3",
    latitude: 35.5490, longitude: 139.7818,
    parkingType: "self_propelled", totalSpaces: 2351,
    facilityType: "airport",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5700, maxWidthMm: 2100, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 2351 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60, notes: "最初30分無料、24h上限2,800円" }],
    is24h: true,
  },
  {
    name: "羽田空港 P2駐車場（第1ターミナル）",
    slug: "haneda-airport-p2-parking",
    address: "東京都大田区羽田空港3-3-5",
    latitude: 35.5505, longitude: 139.7835,
    parkingType: "self_propelled", totalSpaces: 2315,
    facilityType: "airport",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5700, maxWidthMm: 2100, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 2315 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60, notes: "最初30分無料、24h上限2,800円" }],
    is24h: true,
  },
  {
    name: "羽田空港 P3駐車場（第2ターミナル）",
    slug: "haneda-airport-p3-parking",
    address: "東京都大田区羽田空港3-4-4",
    latitude: 35.5467, longitude: 139.7907,
    parkingType: "self_propelled", totalSpaces: 2449,
    facilityType: "airport",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5700, maxWidthMm: 2100, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 2449 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60, notes: "最初30分無料、24h上限2,800円" }],
    is24h: true,
  },
  {
    name: "羽田空港 P4駐車場（第2ターミナル）",
    slug: "haneda-airport-p4-parking",
    address: "東京都大田区羽田空港3-4-5",
    latitude: 35.5483, longitude: 139.7925,
    parkingType: "self_propelled", totalSpaces: 3087,
    facilityType: "airport",
    restrictions: [
      { name: "立体普通車", maxLengthMm: 5700, maxWidthMm: 2100, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 2407 },
      { name: "平面ハイルーフ", maxLengthMm: 7000, maxWidthMm: 2500, maxHeightMm: 3100, maxWeightKg: 3500, spacesCount: 16, notes: "マイクロバス対応" },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60, notes: "最初30分無料、24h上限2,800円" }],
    is24h: true,
  },
  {
    name: "羽田空港 P5駐車場（第3ターミナル/国際線）",
    slug: "haneda-airport-p5-parking",
    address: "東京都大田区羽田空港2-6-5",
    latitude: 35.5450, longitude: 139.7750,
    parkingType: "self_propelled", totalSpaces: 3000,
    facilityType: "airport",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5700, maxWidthMm: 2100, maxHeightMm: 2300, maxWeightKg: 2500, spacesCount: 3000 },
    ],
    fees: [{ feeType: "hourly", amountYen: 400, durationMinutes: 60, notes: "最初30分無料、24h上限2,800円" }],
    is24h: true,
  },
  {
    name: "羽田イノベーションシティ駐車場",
    slug: "haneda-innovation-city-parking",
    address: "東京都大田区羽田空港1-1-4",
    latitude: 35.5530, longitude: 139.7700,
    parkingType: "self_propelled", totalSpaces: 245,
    facilityType: "airport",
    restrictions: [
      { name: "P1平面", maxLengthMm: 7790, maxWidthMm: 2240, maxHeightMm: 2000, maxWeightKg: 2500, spacesCount: 190 },
      { name: "P2機械式", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2000, maxWeightKg: 2500, spacesCount: 55 },
    ],
    fees: [{ feeType: "hourly", amountYen: 440, durationMinutes: 60, notes: "最初30分無料" }],
    is24h: true,
  },

  // ============================================================
  // Phase 5: お台場/レジャー施設
  // ============================================================
  {
    name: "アクアシティお台場駐車場",
    slug: "aqua-city-odaiba-parking",
    address: "東京都港区台場1-7-1",
    latitude: 35.6290, longitude: 139.7753,
    parkingType: "self_propelled", totalSpaces: 900,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 2300, maxHeightMm: 2200, maxWeightKg: 2500, spacesCount: 900 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "ダイバーシティ東京プラザ駐車場",
    slug: "divercity-tokyo-plaza-parking",
    address: "東京都江東区青海1-1-10",
    latitude: 35.6254, longitude: 139.7751,
    parkingType: "self_propelled", totalSpaces: 1307,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2300, maxWeightKg: 2000, spacesCount: 1307 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "デックス東京ビーチ駐車場",
    slug: "decks-tokyo-beach-parking",
    address: "東京都港区台場1-6-1",
    latitude: 35.6291, longitude: 139.7760,
    parkingType: "self_propelled", totalSpaces: 523,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 523 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "有明ガーデン駐車場",
    slug: "ariake-garden-parking",
    address: "東京都江東区有明2-1-8",
    latitude: 35.6350, longitude: 139.7920,
    parkingType: "self_propelled", totalSpaces: 1800,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 2300, maxHeightMm: 2100, maxWeightKg: 2000, spacesCount: 1800, notes: "入庫後1時間無料" },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "東京ビッグサイト東棟地下駐車場",
    slug: "tokyo-big-sight-east-parking",
    address: "東京都江東区有明3-11-1",
    latitude: 35.6315, longitude: 139.7960,
    parkingType: "self_propelled", totalSpaces: 189,
    facilityType: "stadium",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5300, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 189 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60, notes: "最大2,000円/日" }],
    is24h: false, openTime: "08:00", closeTime: "22:00",
  },
  {
    name: "東京ビッグサイト南棟立体駐車場",
    slug: "tokyo-big-sight-south-parking",
    address: "東京都江東区有明3-11-24",
    latitude: 35.6295, longitude: 139.7945,
    parkingType: "self_propelled", totalSpaces: 349,
    facilityType: "stadium",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 349 },
    ],
    fees: [{ feeType: "hourly", amountYen: 500, durationMinutes: 60, notes: "最大2,000円/日" }],
    is24h: false, openTime: "08:00", closeTime: "22:00",
  },
  {
    name: "北の丸公園第一駐車場（日本武道館）",
    slug: "kitanomaru-park-parking",
    address: "東京都千代田区北の丸公園2",
    latitude: 35.6930, longitude: 139.7500,
    parkingType: "self_propelled", totalSpaces: 143,
    facilityType: "public_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 143 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60, notes: "最大3,000円/日" }],
    is24h: false, openTime: "08:30", closeTime: "22:00",
  },
  {
    name: "明治神宮外苑青山駐車場",
    slug: "meiji-jingu-gaien-aoyama-parking",
    address: "東京都港区北青山2-1",
    latitude: 35.6730, longitude: 139.7200,
    parkingType: "self_propelled", totalSpaces: 132,
    facilityType: "public_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 4790, maxWidthMm: 1790, maxHeightMm: 2000, maxWeightKg: 2500, spacesCount: 132 },
    ],
    fees: [{ feeType: "hourly", amountYen: 540, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "24:00",
  },
  {
    name: "豊洲千客万来パーキング",
    slug: "toyosu-senkyakubanrai-parking",
    address: "東京都江東区豊洲6丁目",
    latitude: 35.6455, longitude: 139.7835,
    parkingType: "self_propelled", totalSpaces: 458,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 458 },
    ],
    fees: [{ feeType: "hourly", amountYen: 900, durationMinutes: 60, notes: "千客万来2,000円利用で2h無料" }],
    is24h: true,
  },

  // ============================================================
  // Phase 2 追加: 病院（制限値判明分）
  // ============================================================
  {
    name: "慶應義塾大学病院駐車場",
    slug: "keio-university-hospital-parking",
    address: "東京都新宿区信濃町35",
    latitude: 35.6815, longitude: 139.7181,
    parkingType: "self_propelled", totalSpaces: 246,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 1900, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 246 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1000, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "杏林大学医学部付属病院駐車場",
    slug: "kyorin-university-hospital-parking",
    address: "東京都三鷹市新川6-20-2",
    latitude: 35.6776, longitude: 139.5665,
    parkingType: "self_propelled", totalSpaces: 315,
    facilityType: "hospital",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5000, maxWidthMm: 2000, maxHeightMm: 2100, maxWeightKg: 2500, spacesCount: 315 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1100, durationMinutes: 60 }],
    is24h: true,
  },

  // ============================================================
  // Phase 3 追加: ホテル（制限値判明分）
  // ============================================================
  {
    name: "マンダリンオリエンタル東京駐車場（日本橋三井タワー）",
    slug: "mandarin-oriental-tokyo-parking",
    address: "東京都中央区日本橋室町2-1-1",
    latitude: 35.6869, longitude: 139.7731,
    parkingType: "mechanical", totalSpaces: 50,
    facilityType: "hotel",
    restrictions: [
      { name: "全車共通", maxLengthMm: 5300, maxWidthMm: 2050, maxHeightMm: 2050, maxWeightKg: 2500, spacesCount: 50 },
    ],
    fees: [{ feeType: "hourly", amountYen: 1000, durationMinutes: 60 }],
    is24h: true,
  },
  {
    name: "東京ミッドタウン六本木駐車場（機械式）",
    slug: "tokyo-midtown-roppongi-mechanical-parking",
    address: "東京都港区赤坂9-7-1",
    latitude: 35.6657, longitude: 139.7310,
    parkingType: "mechanical", totalSpaces: 210,
    facilityType: "commercial_facility",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 2000, maxHeightMm: 1550, maxWeightKg: 2300, spacesCount: 105 },
      { name: "ハイルーフ", maxLengthMm: 5300, maxWidthMm: 2000, maxHeightMm: 2050, maxWeightKg: 2500, spacesCount: 105 },
    ],
    fees: [{ feeType: "hourly", amountYen: 800, durationMinutes: 60 }],
    is24h: false, openTime: "09:00", closeTime: "20:00",
  },
  {
    name: "アマン東京駐車場（大手町タワー）",
    slug: "aman-tokyo-parking",
    address: "東京都千代田区大手町1-5-6",
    latitude: 35.6855, longitude: 139.7654,
    parkingType: "mechanical", totalSpaces: 73,
    facilityType: "hotel",
    restrictions: [
      { name: "普通車", maxLengthMm: 5300, maxWidthMm: 2050, maxHeightMm: 1550, maxWeightKg: 2300, spacesCount: 37 },
      { name: "ハイルーフ", maxLengthMm: 5300, maxWidthMm: 2050, maxHeightMm: 2050, maxWeightKg: 2500, spacesCount: 36 },
    ],
    fees: [{ feeType: "hourly", amountYen: 600, durationMinutes: 60 }],
    is24h: false, openTime: "06:00", closeTime: "00:30",
  },

  // ============================================================
  // Phase 5 追加: レジャー施設
  // ============================================================
  {
    name: "明治神宮外苑絵画館駐車場",
    slug: "meiji-jingu-gaien-kaigakan-parking",
    address: "東京都新宿区霞ヶ丘町1",
    latitude: 35.6797, longitude: 139.7175,
    parkingType: "flat", totalSpaces: 396,
    facilityType: "public_facility",
    restrictions: [
      { name: "全車共通", maxLengthMm: 4790, maxWidthMm: 1790, maxHeightMm: 9999, maxWeightKg: 9999, spacesCount: 396, notes: "平面駐車場のため高さ・重量制限なし" },
    ],
    fees: [{ feeType: "daily", amountYen: 1600, notes: "1日定額制" }],
    is24h: false, openTime: "05:30", closeTime: "21:00",
  },
];

// ============================================================
// 差分投入ロジック
// ============================================================
const DELAY_MS = 100; // レートリミット対策のディレイ

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addParking() {
  const isDryRun = process.argv.includes("--dry-run");

  // dotenv読み込み後にDB接続を動的import
  const { db } = await import("../index");
  const { parkingLots, vehicleRestrictions, parkingFees, operatingHours } = await import("../schema");

  console.log(`--- 駐車場データ差分投入${isDryRun ? "（dry-run）" : ""} ---`);
  console.log(`対象データ: ${newParkingData.length}件`);

  // 既存slugを取得
  const existingSlugs = new Set(
    (await db.select({ slug: parkingLots.slug }).from(parkingLots)).map(
      (r) => r.slug
    )
  );
  console.log(`既存駐車場: ${existingSlugs.size}件`);

  let added = 0;
  let skipped = 0;

  for (const parking of newParkingData) {
    if (existingSlugs.has(parking.slug)) {
      console.log(`  スキップ（既存）: ${parking.name}`);
      skipped++;
      continue;
    }

    if (isDryRun) {
      console.log(`  [dry-run] 追加予定: ${parking.name} (${parking.slug})`);
      added++;
      continue;
    }

    // parking_lot
    const lot = await db
      .insert(parkingLots)
      .values({
        name: parking.name,
        slug: parking.slug,
        address: parking.address,
        latitude: parking.latitude,
        longitude: parking.longitude,
        parking_type: parking.parkingType,
        total_spaces: parking.totalSpaces,
        facility_type: parking.facilityType,
      })
      .returning({ id: parkingLots.id })
      .get();

    // vehicle_restrictions
    for (const r of parking.restrictions) {
      await db
        .insert(vehicleRestrictions)
        .values({
          parking_lot_id: lot.id,
          restriction_name: r.name,
          max_length_mm: r.maxLengthMm,
          max_width_mm: r.maxWidthMm,
          max_height_mm: r.maxHeightMm,
          max_weight_kg: r.maxWeightKg,
          spaces_count: r.spacesCount,
          notes: r.notes,
        })
        .run();
    }

    // parking_fees
    for (const f of parking.fees) {
      await db
        .insert(parkingFees)
        .values({
          parking_lot_id: lot.id,
          fee_type: f.feeType,
          amount_yen: f.amountYen,
          duration_minutes: f.durationMinutes,
          notes: f.notes,
        })
        .run();
    }

    // operating_hours (全曜日分)
    for (let day = 0; day <= 6; day++) {
      await db
        .insert(operatingHours)
        .values({
          parking_lot_id: lot.id,
          day_of_week: day,
          is_24h: parking.is24h,
          open_time: parking.is24h ? undefined : parking.openTime,
          close_time: parking.is24h ? undefined : parking.closeTime,
        })
        .run();
    }

    console.log(
      `  追加: ${parking.name} (${parking.restrictions.length}制限, ${parking.fees.length}料金)`
    );
    added++;

    // レートリミット対策
    await sleep(DELAY_MS);
  }

  console.log(`\n--- 完了 ---`);
  console.log(`追加: ${added}件, スキップ: ${skipped}件`);
  console.log(`合計: ${existingSlugs.size + added}件`);
}

// 実行
try {
  addParking();
} catch (error) {
  console.error("エラー:", error);
  process.exit(1);
}
