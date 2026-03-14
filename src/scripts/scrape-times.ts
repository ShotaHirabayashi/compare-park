/**
 * タイムズ駐車場スクレイピング → CSV出力
 *
 * 使い方: npx tsx src/scripts/scrape-times.ts [--ward=CODE] [--limit=N] [--output=FILE]
 *
 * 東京23区のタイムズ駐車場データ（寸法制限付き）を収集しCSVに出力する。
 * 各レコードにsource_urlを付与してトレーサビリティを確保。
 */

import { writeFileSync } from "fs";

const BASE_URL = "https://times-info.net";

// 東京23区のエリアコード（times-info.netのCコード）
const WARD_CODES: Record<string, string> = {
  chiyoda: "C101",
  chuo: "C102",
  minato: "C103",
  shinjuku: "C104",
  bunkyo: "C105",
  taito: "C106",
  sumida: "C107",
  koto: "C108",
  shinagawa: "C109",
  meguro: "C110",
  ota: "C111",
  setagaya: "C112",
  shibuya: "C113",
  nakano: "C114",
  suginami: "C115",
  toshima: "C116",
  kita: "C117",
  arakawa: "C118",
  itabashi: "C119",
  nerima: "C120",
  adachi: "C121",
  katsushika: "C122",
  edogawa: "C123",
};

interface TimesParking {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalSpaces: number;
  maxLength: number;  // mm
  maxWidth: number;   // mm
  maxHeight: number;  // mm
  maxWeight: number;  // kg
  is24h: boolean;
  openTime?: string;
  closeTime?: string;
  feeInfo: string;
  sourceUrl: string;
  parkingId: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(name: string, parkingId: string): string {
  // parkingIDベースでslugを生成（一意性を保証）
  return `times-${parkingId.toLowerCase()}`;
}

/**
 * HTML文字列からテキストを取得するシンプルなヘルパー
 */
function extractText(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  return match ? match[1].replace(/<[^>]*>/g, "").trim() : "";
}

function parseMeters(text: string): number {
  // "5m" → 5000, "1.9m" → 1900, "2.1m" → 2100
  const match = text.match(/([\d.]+)\s*m/);
  if (match) return Math.round(parseFloat(match[1]) * 1000);
  return 0;
}

function parseTons(text: string): number {
  // "2.5t" → 2500
  const match = text.match(/([\d.]+)\s*t/);
  if (match) return Math.round(parseFloat(match[1]) * 1000);
  return 0;
}

/**
 * エリア一覧ページから駐車場詳細ページのURLリストを取得
 * HTMLソース内にはJSテンプレートとして全ページ分のpark-detail IDが含まれている
 */
async function fetchParkingListUrls(wardCode: string): Promise<string[]> {
  const listUrl = `${BASE_URL}/P13-tokyo/${wardCode}/`;
  console.log(`  一覧ページ取得中: ${listUrl}`);

  const res = await fetch(listUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    console.error(`  ⚠️ HTTP ${res.status}: ${listUrl}`);
    return [];
  }

  const html = await res.text();

  // HTMLソース全体からpark-detail IDを抽出（JSテンプレート内も含む）
  const idPattern = /park-detail-([A-Z0-9]+)/g;
  const ids = new Set<string>();
  let match;
  while ((match = idPattern.exec(html)) !== null) {
    ids.add(match[1]);
  }

  // 該当区のURLに変換（重複排除済み）
  const urls = Array.from(ids).map(
    (id) => `${BASE_URL}/P13-tokyo/${wardCode}/park-detail-${id}/`
  );

  console.log(`  → ${urls.length}件の駐車場を検出`);
  return urls;
}

/**
 * 駐車場詳細ページからデータを取得
 */
async function fetchParkingDetail(url: string): Promise<TimesParking | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TomepitaBot/1.0; parking research)",
      },
    });

    if (!res.ok) {
      console.error(`  ⚠️ HTTP ${res.status}: ${url}`);
      return null;
    }

    const html = await res.text();

    // 駐車場ID
    const idMatch = url.match(/park-detail-([A-Z0-9]+)/);
    const parkingId = idMatch ? idMatch[1] : "";

    // 駐車場名
    const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : "";

    // 住所（東京都...の部分のみ抽出、括弧やサフィックスを除去）
    const addressMatch = html.match(/東京都[^<"）)]+/);
    let address = addressMatch ? addressMatch[0].trim() : "";
    address = address.replace(/の時間貸駐車場.*$/, "").replace(/[（(][\s\S]*/, "").trim();

    // 座標を各種パターンで抽出
    let latitude = 0;
    let longitude = 0;
    // パターン1: JSON {"lat":35.xxx,"lon":139.xxx}
    const jsonLatLon = html.match(/"lat"\s*:\s*(3[456]\.\d+)\s*,\s*"lon"\s*:\s*(13[89]\.\d+)/);
    if (jsonLatLon) {
      latitude = parseFloat(jsonLatLon[1]);
      longitude = parseFloat(jsonLatLon[2]);
    }
    // パターン2: lat:35.xxx (クォートなし)
    if (!latitude) {
      const latMatch2 = html.match(/lat\s*:\s*(3[456]\.\d+)/);
      if (latMatch2) latitude = parseFloat(latMatch2[1]);
    }
    if (!longitude) {
      const lonMatch2 = html.match(/lon\s*:\s*(13[89]\.\d+)/);
      if (lonMatch2) longitude = parseFloat(lonMatch2[1]);
    }
    // パターン3: LatLng(35.xxx, 139.xxx)
    if (!latitude || !longitude) {
      const latlngMatch = html.match(/LatLng\(\s*(3[456]\.\d+)\s*,\s*(13[89]\.\d+)\s*\)/);
      if (latlngMatch) {
        latitude = parseFloat(latlngMatch[1]);
        longitude = parseFloat(latlngMatch[2]);
      }
    }
    // パターン4: 数値の直接マッチ（35.6x ~ 35.7x, 139.6x ~ 139.8x）
    if (!latitude || !longitude) {
      const allLats = html.match(/3[56]\.\d{4,}/g);
      const allLons = html.match(/13[89]\.\d{4,}/g);
      if (allLats && allLats.length > 0) latitude = parseFloat(allLats[0]);
      if (allLons && allLons.length > 0) longitude = parseFloat(allLons[0]);
    }

    // 台数
    const spacesMatch = html.match(/(\d+)\s*台/);
    const totalSpaces = spacesMatch ? parseInt(spacesMatch[1]) : 0;

    // 車両制限
    // パターン: 「全長5m、 全幅1.9m、 全高2.1m、 重量2.5t」
    const restrictionText = html.match(/全長[\s\S]{0,200}重量[^<]*/)?.[0] || "";
    const maxLength = parseMeters(restrictionText.match(/全長([\d.]+\s*m)/)?.[1] || "");
    const maxWidth = parseMeters(restrictionText.match(/全幅([\d.]+\s*m)/)?.[1] || "");
    const maxHeight = parseMeters(restrictionText.match(/全高([\d.]+\s*m)/)?.[1] || "");
    const maxWeight = parseTons(restrictionText.match(/重量([\d.]+\s*t)/)?.[1] || "");

    // 営業時間
    const hoursMatch = html.match(/入出庫可能時間[^<]*?(\d{2}:\d{2})[^<]*?(\d{2}:\d{2})/);
    let is24h = false;
    let openTime: string | undefined;
    let closeTime: string | undefined;

    if (html.includes("24時間") || html.includes("24h")) {
      is24h = true;
    } else if (hoursMatch) {
      openTime = hoursMatch[1];
      closeTime = hoursMatch[2];
    }

    // 料金情報（テキスト抽出）
    const feeMatch = html.match(/(\d+)分\s*(\d+)円/);
    const feeInfo = feeMatch ? `${feeMatch[1]}分${feeMatch[2]}円` : "";

    if (!name || maxLength === 0) {
      console.log(`  ⏭️  スキップ (データ不足): ${url}`);
      return null;
    }

    return {
      name,
      address,
      latitude,
      longitude,
      totalSpaces,
      maxLength,
      maxWidth,
      maxHeight,
      maxWeight,
      is24h,
      openTime,
      closeTime,
      feeInfo,
      sourceUrl: url,
      parkingId,
    };
  } catch (error) {
    console.error(`  ❌ エラー: ${url} - ${(error as Error).message}`);
    return null;
  }
}

/**
 * 寸法制限から駐車場タイプを推定
 */
function estimateParkingType(height: number): string {
  if (height <= 1550) return "mechanical";
  if (height <= 2000) return "tower";
  if (height <= 2500) return "self_propelled";
  return "flat";
}

/**
 * 寸法制限から制限名を推定
 */
function estimateRestrictionName(height: number): string {
  if (height <= 1550) return "普通車";
  if (height <= 2000) return "ハイルーフ";
  return "一般";
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvRow(parking: TimesParking): string {
  const slug = slugify(parking.name, parking.parkingId);
  const parkingType = estimateParkingType(parking.maxHeight);
  const restrictionName = estimateRestrictionName(parking.maxHeight);
  const feeType = "hourly";
  const feeMatch = parking.feeInfo.match(/(\d+)分(\d+)円/);
  const durationMinutes = feeMatch ? feeMatch[1] : "";
  const amountYen = feeMatch ? feeMatch[2] : "";

  return [
    escapeCsvField(parking.name),
    slug,
    escapeCsvField(parking.address),
    parking.latitude.toString(),
    parking.longitude.toString(),
    parkingType,
    parking.totalSpaces.toString(),
    parking.is24h ? "TRUE" : "FALSE",
    parking.openTime || "",
    parking.closeTime || "",
    feeType,
    amountYen,
    durationMinutes,
    "",
    restrictionName,
    parking.maxLength.toString(),
    parking.maxWidth.toString(),
    parking.maxHeight.toString(),
    parking.maxWeight.toString(),
    parking.totalSpaces.toString(),
    "",
    parking.sourceUrl,
  ].join(",");
}

const CSV_HEADER =
  "name,slug,address,latitude,longitude,parking_type,total_spaces,is_24h,open_time,close_time,fee_type,amount_yen,duration_minutes,fee_notes,restriction_name,max_length_mm,max_width_mm,max_height_mm,max_weight_kg,spaces_count,restriction_notes,source_url";

async function main() {
  const args = process.argv.slice(2);
  const wardArg = args.find((a) => a.startsWith("--ward="))?.split("=")[1];
  const limitArg = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] || "0");
  const outputArg = args.find((a) => a.startsWith("--output="))?.split("=")[1] || "data/times-parking.csv";

  const wardCodes = wardArg
    ? { [wardArg]: WARD_CODES[wardArg] || wardArg }
    : WARD_CODES;

  console.log(`🅿️  タイムズ駐車場スクレイピング開始`);
  console.log(`対象区: ${Object.keys(wardCodes).join(", ")}`);
  if (limitArg) console.log(`制限: ${limitArg}件`);
  console.log("");

  const allParkings: TimesParking[] = [];

  for (const [ward, code] of Object.entries(wardCodes)) {
    console.log(`📍 ${ward} (${code}):`);

    const urls = await fetchParkingListUrls(code);
    console.log(`  詳細ページ: ${urls.length}件`);

    for (const url of urls) {
      if (limitArg && allParkings.length >= limitArg) break;

      await sleep(2000 + Math.random() * 3000);
      const parking = await fetchParkingDetail(url);

      if (parking) {
        allParkings.push(parking);
        console.log(`  ✅ ${parking.name} (${parking.maxLength}x${parking.maxWidth}x${parking.maxHeight}mm)`);
      }
    }

    if (limitArg && allParkings.length >= limitArg) break;

    // 区間のインターバル
    await sleep(5000);
  }

  // CSV出力
  const csvLines = [CSV_HEADER, ...allParkings.map(toCsvRow)];
  writeFileSync(outputArg, csvLines.join("\n"), "utf-8");

  console.log(`\n🎉 完了! ${allParkings.length}件 → ${outputArg}`);
}

main().catch((error) => {
  console.error("エラー:", error);
  process.exit(1);
});
