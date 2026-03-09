import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { MatchBadge } from "@/components/match-badge";
import { DimensionCompare } from "@/components/dimension-compare";
import {
  getModelBySlug,
  getDimensionsByModelId,
  getParkingLotBySlug,
  getRestrictionsByParkingLotId,
} from "@/lib/queries";
import { calculateMatch } from "@/lib/matching";

interface Props {
  searchParams: Promise<{ car?: string; parking?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { car, parking } = await searchParams;
  if (!car || !parking) return { title: "判定結果 | トメピタ" };

  const [model, lot] = await Promise.all([
    getModelBySlug(car),
    getParkingLotBySlug(parking),
  ]);

  if (!model || !lot) return { title: "判定結果 | トメピタ" };

  return {
    title: `${model.maker_name} ${model.name}は${lot.name}に停められる？ | トメピタ`,
    description: `${model.maker_name} ${model.name}の寸法と${lot.name}の制限サイズを比較。駐車可能かどうかを判定します。`,
  };
}

function extractWard(address: string | null): string | null {
  if (!address) return null;
  const match = address.match(/([\u4e00-\u9fa5]+区)/);
  return match ? match[1] : null;
}

export default async function CheckPage({ searchParams }: Props) {
  const { car, parking } = await searchParams;
  if (!car || !parking) notFound();

  const [model, lot] = await Promise.all([
    getModelBySlug(car),
    getParkingLotBySlug(parking),
  ]);
  if (!model || !lot) notFound();

  const [dimension, restrictions] = await Promise.all([
    getDimensionsByModelId(model.id),
    getRestrictionsByParkingLotId(lot.id),
  ]);

  const ward = extractWard(lot.address);

  // 全制限でマッチング、最良結果を選択
  let bestMatch = dimension && restrictions.length > 0
    ? calculateMatch(
        {
          length_mm: dimension.length_mm,
          width_mm: dimension.width_mm,
          height_mm: dimension.height_mm,
          weight_kg: dimension.weight_kg,
        },
        {
          max_length_mm: restrictions[0].max_length_mm,
          max_width_mm: restrictions[0].max_width_mm,
          max_height_mm: restrictions[0].max_height_mm,
          max_weight_kg: restrictions[0].max_weight_kg,
        }
      )
    : null;

  if (dimension && restrictions.length > 1) {
    for (let i = 1; i < restrictions.length; i++) {
      const match = calculateMatch(
        {
          length_mm: dimension.length_mm,
          width_mm: dimension.width_mm,
          height_mm: dimension.height_mm,
          weight_kg: dimension.weight_kg,
        },
        {
          max_length_mm: restrictions[i].max_length_mm,
          max_width_mm: restrictions[i].max_width_mm,
          max_height_mm: restrictions[i].max_height_mm,
          max_weight_kg: restrictions[i].max_weight_kg,
        }
      );
      if (
        bestMatch &&
        (match.result === "ok" ||
          (match.result === "caution" && bestMatch.result === "ng"))
      ) {
        bestMatch = match;
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }, { label: "判定結果" }]}
      />

      {/* メインカード */}
      <Card className="mb-8">
        <CardContent className="p-6 text-center sm:p-8">
          <h1 className="text-xl font-bold sm:text-2xl">
            {model.maker_name} {model.name}
          </h1>
          <p className="my-2 text-2xl text-muted-foreground">&times;</p>
          <p className="text-lg font-semibold">{lot.name}</p>
          {lot.parking_type && (
            <p className="mt-1 text-sm text-muted-foreground">
              ({lot.parking_type === "mechanical"
                ? "機械式"
                : lot.parking_type === "self_propelled"
                  ? "自走式"
                  : lot.parking_type === "flat"
                    ? "平面"
                    : lot.parking_type === "tower"
                      ? "タワー式"
                      : lot.parking_type})
            </p>
          )}

          <div className="mt-6 flex justify-center">
            {bestMatch ? (
              <MatchBadge result={bestMatch.result} className="text-lg px-6 py-2" />
            ) : (
              <p className="text-muted-foreground">
                {!dimension
                  ? "寸法データがないため判定できません"
                  : "制限データがないため判定できません"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 寸法比較テーブル */}
      {bestMatch && bestMatch.details.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold">寸法比較</h2>

          {/* テーブル表示 */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                    項目
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    車のサイズ
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    制限値
                  </th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                    余裕
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">
                    判定
                  </th>
                </tr>
              </thead>
              <tbody>
                {bestMatch.details.map((d) => {
                  const diff = d.limit - d.value;
                  const unit = d.dimension === "weight" ? "kg" : "mm";
                  const status =
                    d.ratio <= 0.95
                      ? "ok"
                      : d.ratio <= 1.0
                        ? "caution"
                        : "ng";
                  return (
                    <tr key={d.dimension} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-medium">{d.label}</td>
                      <td className="px-3 py-2 text-right">
                        {d.value.toLocaleString()}
                        {unit}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {d.limit.toLocaleString()}
                        {unit}
                      </td>
                      <td
                        className={`px-3 py-2 text-right font-medium ${
                          status === "ok"
                            ? "text-match-ok"
                            : status === "caution"
                              ? "text-match-caution"
                              : "text-match-ng"
                        }`}
                      >
                        {diff >= 0 ? `+${diff}` : diff}
                        {unit}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <MatchBadge result={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* バー表示 */}
          <div className="space-y-4">
            {bestMatch.details.map((d) => (
              <DimensionCompare
                key={d.dimension}
                label={d.label}
                value={d.value}
                limit={d.limit}
                unit={d.dimension === "weight" ? "kg" : "mm"}
              />
            ))}
          </div>
        </section>
      )}

      {/* 次のアクション */}
      <section>
        <h2 className="mb-4 text-lg font-bold">次のアクション</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/car/${model.slug}`}
            className="rounded-lg border border-border p-4 text-sm transition-colors hover:bg-muted"
          >
            <p className="font-medium">この車で他の駐車場も探す</p>
            <p className="mt-1 text-muted-foreground">
              {model.maker_name} {model.name} の詳細ページへ
            </p>
          </Link>
          <Link
            href={`/parking/${lot.slug}`}
            className="rounded-lg border border-border p-4 text-sm transition-colors hover:bg-muted"
          >
            <p className="font-medium">この駐車場に入る車種を見る</p>
            <p className="mt-1 text-muted-foreground">{lot.name} の詳細ページへ</p>
          </Link>
          {ward && (
            <Link
              href={`/area/${ward}/car/${model.slug}`}
              className="rounded-lg border border-border p-4 text-sm transition-colors hover:bg-muted"
            >
              <p className="font-medium">{ward}で他の駐車場を探す</p>
              <p className="mt-1 text-muted-foreground">
                {ward}エリアで{model.name}の適合を確認
              </p>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
