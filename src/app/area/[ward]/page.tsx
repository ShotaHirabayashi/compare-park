import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ParkingCard } from "@/components/parking-card";
import { getParkingLotsByWard, getRestrictionsByParkingLotId, getPopularModels } from "@/lib/queries";
import { TOKYO_WARDS } from "@/lib/constants";

interface Props {
  params: Promise<{ ward: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ward } = await params;
  const decodedWard = decodeURIComponent(ward);

  return {
    title: `${decodedWard}の駐車場一覧 | Compare Park`,
    description: `${decodedWard}エリアの駐車場を一覧表示。制限寸法や車種適合も確認できます。`,
  };
}

export default async function WardPage({ params }: Props) {
  const { ward } = await params;
  const decodedWard = decodeURIComponent(ward);

  // 有効な区名かチェック
  if (!TOKYO_WARDS.includes(decodedWard as typeof TOKYO_WARDS[number])) {
    notFound();
  }

  const [lots, popularModels] = await Promise.all([
    getParkingLotsByWard(decodedWard),
    getPopularModels(),
  ]);

  // 各駐車場の代表制限値を取得
  const lotsWithRestrictions = await Promise.all(
    lots.map(async (lot) => {
      const restrictions = await getRestrictionsByParkingLotId(lot.id);
      const firstRestriction = restrictions[0] ?? null;
      return { lot, restriction: firstRestriction };
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "エリアから探す", href: "/area" },
          { label: decodedWard },
        ]}
      />

      <h1 className="mb-2 text-3xl font-bold">{decodedWard}の駐車場</h1>
      <p className="mb-8 text-muted-foreground">
        {decodedWard}エリアの駐車場一覧 ({lots.length}件)
      </p>

      {lotsWithRestrictions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lotsWithRestrictions.map(({ lot, restriction }) => (
            <ParkingCard
              key={lot.id}
              slug={lot.slug}
              name={lot.name}
              address={lot.address}
              parkingType={lot.parking_type}
              maxLengthMm={restriction?.max_length_mm}
              maxWidthMm={restriction?.max_width_mm}
              maxHeightMm={restriction?.max_height_mm}
              maxWeightKg={restriction?.max_weight_kg}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/30 py-12 text-center">
          <p className="text-muted-foreground">
            {decodedWard}の駐車場データはまだ登録されていません。
          </p>
        </div>
      )}

      {/* 車種別の適合判定リンク */}
      {popularModels.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">
            {decodedWard}で車種別に適合を確認
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularModels.map((m) => (
              <Link
                key={m.id}
                href={`/area/${ward}/car/${m.slug}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                {m.maker_name} {m.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
