import { db } from "../db";
import { parkingLots } from "../db/schema";
import { eq, like, and, not } from "drizzle-orm";

/**
 * リパーク/タイムズ由来の駐車場名にブランド名プレフィックスを付与する
 *
 * 例: 「神田神保町第２０」→「リパーク 神田神保町第２０」
 *     「西新宿８丁目」→「タイムズ 西新宿８丁目」
 */

interface BrandRule {
  brand: string;
  sourcePattern: string; // source_urlに含まれるパターン
  namePrefix: string; // 既にこのプレフィックスがあればスキップ
}

const brandRules: BrandRule[] = [
  {
    brand: "リパーク",
    sourcePattern: "repark.jp",
    namePrefix: "リパーク",
  },
  {
    brand: "タイムズ",
    sourcePattern: "times-info.net",
    namePrefix: "タイムズ",
  },
];

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

  console.log(`全駐車場: ${allLots.length}件`);
  console.log("");

  let totalUpdated = 0;

  for (const rule of brandRules) {
    const targets = allLots.filter(
      (lot) =>
        lot.source_url?.includes(rule.sourcePattern) &&
        !lot.name.startsWith(rule.namePrefix)
    );

    const alreadyPrefixed = allLots.filter(
      (lot) =>
        lot.source_url?.includes(rule.sourcePattern) &&
        lot.name.startsWith(rule.namePrefix)
    );

    console.log(`--- ${rule.brand} ---`);
    console.log(`  既にプレフィックスあり: ${alreadyPrefixed.length}件`);
    console.log(`  プレフィックス追加対象: ${targets.length}件`);

    if (targets.length > 0 && isDryRun) {
      console.log(`  サンプル:`);
      for (const lot of targets.slice(0, 5)) {
        console.log(`    「${lot.name}」→「${rule.brand} ${lot.name}」`);
      }
    }

    if (!isDryRun) {
      for (const lot of targets) {
        const newName = `${rule.brand} ${lot.name}`;
        await db
          .update(parkingLots)
          .set({ name: newName })
          .where(eq(parkingLots.id, lot.id))
          .run();
      }
      console.log(`  ${targets.length}件を更新しました。`);
    }

    totalUpdated += targets.length;
    console.log("");
  }

  if (isDryRun) {
    console.log(
      `合計${totalUpdated}件が更新対象です。実行するには --dry-run を外してください。`
    );
  } else {
    console.log(`合計${totalUpdated}件を更新しました。`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
