import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { ParkingMatchList } from "@/components/parking-match-list";
import type { ParkingMatchItem } from "@/components/parking-match-row";
import {
  getModelBySlug,
  getAllTrimsWithDimensions,
  getRestrictionsByWard,
  getModelsWithMaker,
} from "@/lib/queries";
import { calculateMatch, matchSortOrder, formatMatchReason } from "@/lib/matching";
import { TOKYO_WARDS } from "@/lib/constants";

interface Props {
  params: Promise<{ ward: string; slug: string }>;
  searchParams: Promise<{ gen?: string; trim?: string }>;
}

export async function generateStaticParams() {
  const allModels = await getModelsWithMaker();
  return TOKYO_WARDS.flatMap((ward) =>
    allModels.map((m) => ({ ward, slug: m.slug }))
  );
}

export const revalidate = 604800; // 7d

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward, slug } = await params;
  const decodedWard = decodeURIComponent(ward);
  const model = await getModelBySlug(slug);
  if (!model) return { title: "車種が見つかりません" };

  return {
    title: `${decodedWard}で${model.maker_name} ${model.name}が停められる駐車場 | トメピタ`,
    description: `${decodedWard}エリアの駐車場で${model.maker_name} ${model.name}が駐車可能かを判定。全長・全幅・全高・重量と駐車場の制限寸法を比較し、停められるかを一目で確認できます。`,
    alternates: { canonical: `/area/${encodeURIComponent(decodedWard)}/car/${slug}` },
  };
}

export default async function AreaCarPage({ params, searchParams }: Props) {
  const { ward, slug } = await params;
  const { gen, trim: trimParam } = await searchParams;
  const decodedWard = decodeURIComponent(ward);

  if (!TOKYO_WARDS.includes(decodedWard as (typeof TOKYO_WARDS)[number])) {
    notFound();
  }

  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const [allTrims, restrictions] = await Promise.all([
    getAllTrimsWithDimensions(model.id),
    getRestrictionsByWard(decodedWard),
  ]);

  // 選択中のトリムを決定
  const genId = gen ? Number(gen) : null;
  const trimId = trimParam ? Number(trimParam) : null;

  let selectedTrim = allTrims.length > 0 ? allTrims[0] : null;

  if (genId != null && trimId != null) {
    const found = allTrims.find(
      (t) => t.generationId === genId && t.trimId === trimId
    );
    if (found) selectedTrim = found;
  } else if (genId != null) {
    const found = allTrims.find((t) => t.generationId === genId);
    if (found) selectedTrim = found;
  }

  const dimension = selectedTrim
    ? {
        length_mm: selectedTrim.lengthMm,
        width_mm: selectedTrim.widthMm,
        height_mm: selectedTrim.heightMm,
        weight_kg: selectedTrim.weightKg,
      }
    : null;

  // マッチング判定
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

  matchResults.sort(
    (a, b) => matchSortOrder(a.match.result) - matchSortOrder(b.match.result)
  );

  // 同一駐車場で複数制限がある場合、最良の結果のみ表示
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

  const okCount = parkingMatchItems.filter((i) => i.result === "ok").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "エリアから探す", href: "/area" },
          { label: decodedWard, href: `/area/${ward}` },
          { label: model.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {decodedWard}で{model.name}が停められる駐車場
        </h1>
        <p className="mt-2 text-muted-foreground">
          {decodedWard}エリアの駐車場 {parkingMatchItems.length}件中、
          <span className="font-medium text-match-ok">{okCount}件が駐車可能</span>
          です。
        </p>
      </div>

      {/* 車種情報サマリー */}
      {dimension && (
        <Card className="mb-6">
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{model.maker_name}</Badge>
              <Link
                href={`/car/${slug}`}
                className="font-medium text-primary hover:underline"
              >
                {model.name}の詳細
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {dimension.length_mm != null && (
                <span>全長 {dimension.length_mm.toLocaleString()}mm</span>
              )}
              {dimension.width_mm != null && (
                <span>全幅 {dimension.width_mm.toLocaleString()}mm</span>
              )}
              {dimension.height_mm != null && (
                <span>全高 {dimension.height_mm.toLocaleString()}mm</span>
              )}
              {dimension.weight_kg != null && (
                <span>重量 {dimension.weight_kg.toLocaleString()}kg</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!dimension && (
        <Card className="mb-6">
          <CardContent className="py-8 text-center text-muted-foreground">
            この車種の寸法データはまだ登録されていません。
          </CardContent>
        </Card>
      )}

      {/* 判定リスト */}
      <section>
        <h2 className="mb-4 text-xl font-bold">
          {decodedWard}の駐車場 適合判定
        </h2>
        {parkingMatchItems.length > 0 ? (
          <ParkingMatchList items={parkingMatchItems} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {dimension
                ? `${decodedWard}の駐車場データはまだ登録されていません。`
                : "寸法データがないため判定できません。"}
            </CardContent>
          </Card>
        )}
      </section>

      {/* 関連リンク */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">関連ページ</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/car/${slug}`}
            className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            {model.name}の全エリア判定を見る
          </Link>
          <Link
            href={`/area/${ward}`}
            className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            {decodedWard}の駐車場一覧
          </Link>
        </div>
      </section>
    </div>
  );
}
