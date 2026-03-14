import { db } from "../db";
import { parkingLots } from "../db/schema";
import { eq, isNull } from "drizzle-orm";

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
  | "other";

interface MatchRule {
  type: FacilityType;
  patterns: string[];
  matchStart?: boolean; // trueなら名前の先頭一致
}

const rules: MatchRule[] = [
  {
    type: "coin_parking",
    patterns: ["NPC24H", "コインパーク", "コインパーキング"],
  },
  {
    type: "coin_parking",
    patterns: ["リパーク", "タイムズ"],
    matchStart: true,
  },
  {
    type: "department_store",
    patterns: [
      "三越",
      "伊勢丹",
      "高島屋",
      "松屋",
      "大丸",
      "そごう",
      "松坂屋",
      "東急百貨店",
      "小田急百貨店",
      "京王百貨店",
      "西武百貨店",
      "百貨店",
    ],
  },
  {
    type: "commercial_facility",
    patterns: [
      "イオン",
      "アリオ",
      "ルミネ",
      "ヒルズ",
      "ミッドタウン",
      "GINZA SIX",
      "パルコ",
      "マルイ",
      "サンシャイン",
      "ソラマチ",
      "ヒカリエ",
      "ららぽーと",
      "ラゾーナ",
      "コレド",
      "アトレ",
      "グランツリー",
      "ダイバーシティ",
      "東京ミッドタウン",
      "六本木ヒルズ",
      "渋谷スクランブルスクエア",
      "表参道ヒルズ",
      "東急プラザ",
      "ショッピングモール",
      "ショッピングセンター",
    ],
  },
  {
    type: "stadium",
    patterns: [
      "ドーム",
      "スタジアム",
      "アリーナ",
      "体育館",
      "武道館",
      "国技館",
      "ホール",
    ],
  },
  {
    type: "hotel",
    patterns: ["ホテル", "アパホテル"],
  },
  {
    type: "hospital",
    patterns: ["病院", "クリニック", "医療センター"],
  },
  {
    type: "public_facility",
    patterns: ["区役所", "市役所", "図書館", "シビックセンター", "庁舎"],
  },
  {
    type: "residential",
    patterns: ["コーシャハイム", "団地", "マンション", "レジデンス"],
  },
  {
    type: "tower_parking",
    patterns: ["タワーパーキング", "タワー駐車場"],
  },
  {
    type: "office_building",
    patterns: ["ビルディング", "ビル"],
  },
];

function detectFacilityType(
  name: string,
  sourceUrl: string | null
): FacilityType | null {
  // source_urlベースの判定（スクレイピング元で確実に分類できるもの）
  if (sourceUrl) {
    if (
      sourceUrl.includes("repark.jp") ||
      sourceUrl.includes("times-info.net")
    ) {
      // リパーク/タイムズ由来は名前ベースで施設判定を試み、
      // マッチしなければcoin_parkingとして分類
      const nameMatch = detectByName(name);
      return nameMatch ?? "coin_parking";
    }
  }

  return detectByName(name);
}

function detectByName(name: string): FacilityType | null {
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (rule.matchStart) {
        if (name.startsWith(pattern)) return rule.type;
      } else {
        if (name.includes(pattern)) return rule.type;
      }
    }
  }
  return null;
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log(isDryRun ? "=== DRY RUN ===" : "=== 実行モード ===");
  console.log("");

  const allLots = await db
    .select({
      id: parkingLots.id,
      name: parkingLots.name,
      source_url: parkingLots.source_url,
    })
    .from(parkingLots)
    .all();

  console.log(`対象駐車場: ${allLots.length}件`);
  console.log("");

  const stats: Record<string, number> = {};
  const unclassified: string[] = [];
  let updateCount = 0;

  for (const lot of allLots) {
    const facilityType = detectFacilityType(lot.name, lot.source_url);

    if (facilityType) {
      stats[facilityType] = (stats[facilityType] || 0) + 1;

      if (!isDryRun) {
        await db
          .update(parkingLots)
          .set({ facility_type: facilityType })
          .where(eq(parkingLots.id, lot.id))
          .run();
        updateCount++;
      }
    } else {
      unclassified.push(lot.name);
    }
  }

  // 結果サマリー
  console.log("--- 分類結果 ---");
  const typeLabels: Record<string, string> = {
    coin_parking: "コインパーキング",
    department_store: "百貨店",
    commercial_facility: "商業施設",
    office_building: "オフィスビル",
    stadium: "スタジアム・ホール",
    hospital: "病院",
    station: "駅",
    residential: "住宅",
    tower_parking: "タワーパーキング",
    public_facility: "公共施設",
    hotel: "ホテル",
    other: "その他",
  };

  for (const [type, count] of Object.entries(stats).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${typeLabels[type] || type}: ${count}件`);
  }

  console.log(`  未分類: ${unclassified.length}件`);
  console.log("");

  if (unclassified.length > 0 && unclassified.length <= 50) {
    console.log("--- 未分類の駐車場 ---");
    for (const name of unclassified) {
      console.log(`  - ${name}`);
    }
    console.log("");
  } else if (unclassified.length > 50) {
    console.log("--- 未分類の駐車場（先頭50件） ---");
    for (const name of unclassified.slice(0, 50)) {
      console.log(`  - ${name}`);
    }
    console.log(`  ... 他${unclassified.length - 50}件`);
    console.log("");
  }

  if (!isDryRun) {
    console.log(`${updateCount}件を更新しました。`);
  } else {
    console.log(
      "dry-runモードのため更新は行いません。実行するには --dry-run を外してください。"
    );
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
