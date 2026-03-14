import { readFileSync, writeFileSync } from "fs";

/**
 * リパークCSV + タイムズCSVを結合し、以下の加工を行う:
 * 1. リパークの名前に「リパーク 」プレフィックス付与
 * 2. facility_type カラムを推定付与
 * 3. 1つのCSVとして出力
 *
 * 使い方: npx tsx src/scripts/merge-csv.ts
 */

type FacilityType =
  | "coin_parking"
  | "department_store"
  | "commercial_facility"
  | "office_building"
  | "stadium"
  | "hospital"
  | "station"
  | "residential"
  | "tower_parking"
  | "public_facility"
  | "hotel"
  | "other"
  | "";

interface MatchRule {
  type: FacilityType;
  patterns: string[];
  matchStart?: boolean;
}

const rules: MatchRule[] = [
  { type: "coin_parking", patterns: ["NPC24H", "コインパーク", "コインパーキング"] },
  { type: "coin_parking", patterns: ["リパーク", "タイムズ"], matchStart: true },
  {
    type: "department_store",
    patterns: ["三越", "伊勢丹", "高島屋", "松屋", "大丸", "そごう", "松坂屋", "東急百貨店", "小田急百貨店", "京王百貨店", "西武百貨店", "百貨店"],
  },
  {
    type: "commercial_facility",
    patterns: ["イオン", "アリオ", "ルミネ", "ヒルズ", "ミッドタウン", "GINZA SIX", "パルコ", "マルイ", "サンシャイン", "ソラマチ", "ヒカリエ", "ららぽーと", "ラゾーナ", "コレド", "アトレ", "グランツリー", "ダイバーシティ", "東京ミッドタウン", "六本木ヒルズ", "渋谷スクランブルスクエア", "表参道ヒルズ", "東急プラザ", "ショッピングモール", "ショッピングセンター"],
  },
  { type: "stadium", patterns: ["ドーム", "スタジアム", "アリーナ", "体育館", "武道館", "国技館", "ホール"] },
  { type: "hotel", patterns: ["ホテル", "アパホテル"] },
  { type: "hospital", patterns: ["病院", "クリニック", "医療センター"] },
  { type: "public_facility", patterns: ["区役所", "市役所", "図書館", "シビックセンター", "庁舎"] },
  { type: "residential", patterns: ["コーシャハイム", "団地", "マンション", "レジデンス"] },
  { type: "tower_parking", patterns: ["タワーパーキング", "タワー駐車場"] },
  { type: "office_building", patterns: ["ビルディング", "ビル"] },
];

function detectByName(name: string): FacilityType | "" {
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (rule.matchStart) {
        if (name.startsWith(pattern)) return rule.type;
      } else {
        if (name.includes(pattern)) return rule.type;
      }
    }
  }
  return "";
}

function detectFacilityType(name: string, sourceUrl: string): FacilityType | "" {
  if (sourceUrl.includes("repark.jp") || sourceUrl.includes("times-info.net")) {
    const nameMatch = detectByName(name);
    return nameMatch || "coin_parking";
  }
  return detectByName(name);
}

// シンプルなCSVパース（ダブルクォート対応）
function parseCsvLines(content: string): string[][] {
  const lines: string[][] = [];
  let current = "";
  let inQuotes = false;
  const fields: string[] = [];

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < content.length && content[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && i + 1 < content.length && content[i + 1] === "\n") {
          i++;
        }
        fields.push(current);
        current = "";
        if (fields.some((f) => f.length > 0)) {
          lines.push([...fields]);
        }
        fields.length = 0;
      } else {
        current += ch;
      }
    }
  }
  // 最後の行
  fields.push(current);
  if (fields.some((f) => f.length > 0)) {
    lines.push([...fields]);
  }

  return lines;
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

function main() {
  const reparkPath = "data/repark-parking-full.csv";
  const timesPath = "data/times-parking.csv";
  const outputPath = "data/all-parking.csv";

  // リパーク読み込み
  const reparkContent = readFileSync(reparkPath, "utf-8");
  const reparkLines = parseCsvLines(reparkContent);
  const header = reparkLines[0];
  const reparkData = reparkLines.slice(1);

  // タイムズ読み込み
  const timesContent = readFileSync(timesPath, "utf-8");
  const timesLines = parseCsvLines(timesContent);
  const timesData = timesLines.slice(1); // ヘッダーはスキップ

  console.log(`リパーク: ${reparkData.length}件`);
  console.log(`タイムズ: ${timesData.length}件`);

  const nameIdx = header.indexOf("name");
  const sourceUrlIdx = header.indexOf("source_url");

  // facility_typeカラムを追加した新ヘッダー
  const newHeader = [...header, "facility_type"];

  const outputRows: string[][] = [];

  // リパークデータ: 名前にプレフィックス付与 + facility_type
  for (const row of reparkData) {
    const name = row[nameIdx];
    const prefixedName = name.startsWith("リパーク") ? name : `リパーク ${name}`;
    row[nameIdx] = prefixedName;

    const sourceUrl = row[sourceUrlIdx] || "";
    const facilityType = detectFacilityType(prefixedName, sourceUrl);
    outputRows.push([...row, facilityType]);
  }

  // タイムズデータ: そのまま + facility_type
  for (const row of timesData) {
    const name = row[nameIdx];
    const sourceUrl = row[sourceUrlIdx] || "";
    const facilityType = detectFacilityType(name, sourceUrl);
    outputRows.push([...row, facilityType]);
  }

  // CSV出力
  const csvOutput = [
    newHeader.map(escapeCsvField).join(","),
    ...outputRows.map((row) => row.map(escapeCsvField).join(",")),
  ].join("\n");

  writeFileSync(outputPath, csvOutput, "utf-8");

  // 統計
  const stats: Record<string, number> = {};
  let unclassified = 0;
  for (const row of outputRows) {
    const ft = row[row.length - 1];
    if (ft) {
      stats[ft] = (stats[ft] || 0) + 1;
    } else {
      unclassified++;
    }
  }

  console.log(`\n合計: ${outputRows.length}件 → ${outputPath}`);
  console.log("\n--- 分類結果 ---");
  for (const [type, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}件`);
  }
  console.log(`  未分類: ${unclassified}件`);
}

main();
