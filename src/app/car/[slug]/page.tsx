import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Weight, MoveHorizontal, MoveVertical, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { ParkingMatchList } from "@/components/parking-match-list";
import type { ParkingMatchItem } from "@/components/parking-match-row";
import { TrimSelector } from "@/components/trim-selector";
import { AreaSearchMini } from "@/components/area-search-mini";
import {
  getModelBySlug,
  getAllTrimsWithDimensions,
  getAllRestrictions,
} from "@/lib/queries";
import { calculateMatch, matchSortOrder, formatMatchReason } from "@/lib/matching";
import { TOKYO_WARDS } from "@/lib/constants";

const bodyTypeLabels: Record<string, string> = {
  sedan: "セダン",
  suv: "SUV",
  minivan: "ミニバン",
  compact: "コンパクト",
  wagon: "ワゴン",
  coupe: "クーペ",
  truck: "トラック",
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ gen?: string; trim?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);
  if (!model) return { title: "車種が見つかりません" };

  return {
    title: `${model.name} (${model.maker_name}) の寸法と駐車場適合 | トメピタ`,
    description: `${model.maker_name} ${model.name}の全長・全幅・全高・重量を一覧表示。東京23区内の駐車場への適合判定も確認できます。`,
  };
}

export default async function CarDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { gen, trim: trimParam } = await searchParams;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const [allTrims, restrictions] = await Promise.all([
    getAllTrimsWithDimensions(model.id),
    getAllRestrictions(),
  ]);

  // 選択中のトリムを決定
  const genId = gen ? Number(gen) : null;
  const trimId = trimParam ? Number(trimParam) : null;

  let selectedTrim = allTrims.length > 0 ? allTrims[0] : null;

  if (genId != null && trimId != null) {
    // クエリパラメータで指定されたトリムを検索
    const found = allTrims.find(
      (t) => t.generationId === genId && t.trimId === trimId
    );
    if (found) selectedTrim = found;
  } else if (genId != null) {
    // 世代だけ指定された場合、その世代の最初のトリム
    const found = allTrims.find((t) => t.generationId === genId);
    if (found) selectedTrim = found;
  }

  // 寸法データ（選択中トリムから）
  const dimension = selectedTrim
    ? {
        length_mm: selectedTrim.lengthMm,
        width_mm: selectedTrim.widthMm,
        height_mm: selectedTrim.heightMm,
        weight_kg: selectedTrim.weightKg,
      }
    : null;

  // TrimSelector 用のデータを整形（phaseをまたいだフラットなリスト）
  const trimSelectorData = allTrims.map((t) => ({
    generationId: t.generationId,
    generationName: t.generationName,
    startYear: t.startYear,
    endYear: t.endYear,
    trimId: t.trimId,
    trimName: t.trimName,
    driveType: t.driveType,
    transmission: t.transmission,
    dimensionId: t.dimensionId,
    lengthMm: t.lengthMm,
    widthMm: t.widthMm,
    heightMm: t.heightMm,
    weightKg: t.weightKg,
  }));

  // 各駐車場制限とのマッチング判定
  const matchResults = dimension
    ? restrictions.map((r) => {
        const match = calculateMatch(
          {
            length_mm: dimension.length_mm,
            width_mm: dimension.width_mm,
            height_mm: dimension.height_mm,
            weight_kg: dimension.weight_kg,
          },
          {
            max_length_mm: r.max_length_mm,
            max_width_mm: r.max_width_mm,
            max_height_mm: r.max_height_mm,
            max_weight_kg: r.max_weight_kg,
          }
        );
        return { restriction: r, match };
      })
    : [];

  // OK -> CAUTION -> NG の順でソート
  matchResults.sort(
    (a, b) => matchSortOrder(a.match.result) - matchSortOrder(b.match.result)
  );

  // 同一駐車場で複数制限がある場合、最良の結果のみ表示するためにグループ化
  const parkingResultMap = new Map<
    number,
    (typeof matchResults)[number]
  >();
  for (const mr of matchResults) {
    const existing = parkingResultMap.get(mr.restriction.parking_lot_id);
    if (!existing || matchSortOrder(mr.match.result) < matchSortOrder(existing.match.result)) {
      parkingResultMap.set(mr.restriction.parking_lot_id, mr);
    }
  }
  const uniqueParkingResults = Array.from(parkingResultMap.values()).sort(
    (a, b) => matchSortOrder(a.match.result) - matchSortOrder(b.match.result)
  );

  // ParkingMatchList に渡すデータを整形
  const parkingMatchItems: ParkingMatchItem[] = uniqueParkingResults.map((item) => ({
    restrictionId: item.restriction.id,
    parkingLotName: item.restriction.parking_lot_name,
    parkingLotSlug: item.restriction.parking_lot_slug,
    parkingLotAddress: item.restriction.parking_lot_address ?? "",
    parkingType: item.restriction.parking_type ?? "",
    result: item.match.result,
    details: item.match.details,
    reason: formatMatchReason(item.match.details),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: model.maker_name },
          { label: model.name },
        ]}
      />

      {/* 車種基本情報 */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{model.name}</h1>
          <Badge variant="outline">
            {bodyTypeLabels[model.body_type] ?? model.body_type}
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground">{model.maker_name}</p>
      </div>

      {/* 世代・グレード選択 */}
      {allTrims.length > 0 && selectedTrim && (
        <TrimSelector
          trims={trimSelectorData}
          selectedGenerationId={selectedTrim.generationId}
          selectedTrimId={selectedTrim.trimId}
          carSlug={slug}
        />
      )}

      {/* 寸法サマリーカード */}
      {dimension && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dimension.length_mm != null && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-2">
                <MoveHorizontal className="size-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">全長</p>
                  <p className="text-2xl font-bold">
                    {dimension.length_mm.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">mm</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {dimension.width_mm != null && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-2">
                <MoveVertical className="size-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">全幅</p>
                  <p className="text-2xl font-bold">
                    {dimension.width_mm.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">mm</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {dimension.height_mm != null && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-2">
                <ArrowUpDown className="size-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">全高</p>
                  <p className="text-2xl font-bold">
                    {dimension.height_mm.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">mm</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {dimension.weight_kg != null && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-2">
                <Weight className="size-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">重量</p>
                  <p className="text-2xl font-bold">
                    {dimension.weight_kg.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">kg</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!dimension && (
        <Card className="mb-10">
          <CardContent className="py-8 text-center text-muted-foreground">
            この車種の寸法データはまだ登録されていません。
          </CardContent>
        </Card>
      )}

      {/* エリア検索ミニフォーム */}
      <div className="mb-10 rounded-lg border bg-muted/30 p-4">
        <h3 className="mb-3 text-sm font-semibold">この車で駐車場を探す</h3>
        <AreaSearchMini carSlug={slug} />
      </div>

      {/* 停められる駐車場一覧 */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">駐車場との適合判定</h2>
        {parkingMatchItems.length > 0 ? (
          <ParkingMatchList items={parkingMatchItems} showAreaFilter />
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {dimension
                ? "駐車場データがまだ登録されていません。"
                : "寸法データがないため判定できません。"}
            </CardContent>
          </Card>
        )}
      </section>

      {/* エリア別に見る */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">エリア別に{model.name}の適合を見る</h2>
        <div className="flex flex-wrap gap-2">
          {TOKYO_WARDS.map((w) => (
            <Link
              key={w}
              href={`/area/${w}/car/${slug}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              {w}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
