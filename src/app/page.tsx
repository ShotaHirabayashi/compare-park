import Link from "next/link";
import { Search, Car, MapPin, CheckCircle } from "lucide-react";
import { getMakers, getPopularModels, getAllDimensions } from "@/lib/queries";
import { MakerSearch } from "@/components/maker-search";
import { VehicleCard } from "@/components/vehicle-card";
import { db } from "@/db";
import { models, makers, dimensions, trims, phases, generations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TOKYO_WARDS } from "@/lib/constants";

export default async function Home() {
  const [makerList, popularModels, allModelsWithDims] = await Promise.all([
    getMakers(),
    getPopularModels(),
    // モデル一覧と代表寸法を結合して取得
    db
      .select({
        id: models.id,
        name: models.name,
        slug: models.slug,
        body_type: models.body_type,
        maker_id: models.maker_id,
        maker_name: makers.name,
        length_mm: dimensions.length_mm,
        width_mm: dimensions.width_mm,
        height_mm: dimensions.height_mm,
        weight_kg: dimensions.weight_kg,
      })
      .from(models)
      .innerJoin(makers, eq(models.maker_id, makers.id))
      .leftJoin(generations, eq(generations.model_id, models.id))
      .leftJoin(phases, eq(phases.generation_id, generations.id))
      .leftJoin(trims, eq(trims.phase_id, phases.id))
      .leftJoin(dimensions, eq(dimensions.trim_id, trims.id)),
  ]);

  // 車種ごとに最初の寸法のみ保持（重複排除）
  const modelMap = new Map<
    number,
    {
      id: number;
      name: string;
      slug: string;
      body_type: string;
      maker_id: number;
      maker_name: string;
      length_mm: number | null;
      width_mm: number | null;
      height_mm: number | null;
      weight_kg: number | null;
    }
  >();
  for (const row of allModelsWithDims) {
    if (!modelMap.has(row.id)) {
      modelMap.set(row.id, row);
    }
  }
  const uniqueModels = Array.from(modelMap.values());

  // 人気車種の寸法情報を取得
  const popularWithDims = popularModels.map((pm) => {
    const withDim = uniqueModels.find((m) => m.id === pm.id);
    return {
      ...pm,
      length_mm: withDim?.length_mm ?? null,
      width_mm: withDim?.width_mm ?? null,
      height_mm: withDim?.height_mm ?? null,
      weight_kg: withDim?.weight_kg ?? null,
    };
  });

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            あなたの車、その駐車場に停められる？
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            車種の寸法と駐車場の制限サイズを比較して、停められるかどうかを瞬時に判定。
            東京23区内の機械式駐車場を中心にデータを収録しています。
          </p>
        </div>
      </section>

      {/* 車種検索セクション */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          メーカーから車種を探す
        </h2>
        <MakerSearch
          makers={makerList.map((m) => ({
            id: m.id,
            name: m.name,
            slug: m.slug,
          }))}
          models={uniqueModels}
        />
      </section>

      {/* 人気車種セクション */}
      {popularWithDims.length > 0 && (
        <section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              人気の車種
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularWithDims.map((model) => (
                <VehicleCard
                  key={model.id}
                  slug={model.slug}
                  name={model.name}
                  makerName={model.maker_name}
                  bodyType={model.body_type}
                  lengthMm={model.length_mm}
                  widthMm={model.width_mm}
                  heightMm={model.height_mm}
                  weightKg={model.weight_kg}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* エリア×車種セクション */}
      {popularWithDims.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            エリア×車種で駐車場を探す
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            エリアと車種を選んで、停められる駐車場をチェック
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                    エリア
                  </th>
                  {popularWithDims.map((m) => (
                    <th
                      key={m.id}
                      className="px-3 py-2 text-center font-medium text-muted-foreground"
                    >
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOKYO_WARDS.map((ward) => (
                  <tr key={ward} className="border-b last:border-b-0">
                    <td className="px-3 py-2">
                      <Link
                        href={`/area/${ward}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {ward}
                      </Link>
                    </td>
                    {popularWithDims.map((m) => (
                      <td key={m.id} className="px-3 py-2 text-center">
                        <Link
                          href={`/area/${ward}/car/${m.slug}`}
                          className="inline-block rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          判定
                        </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 使い方セクション */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground">
          使い方
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">1. 車種を選ぶ</h3>
            <p className="text-sm text-muted-foreground">
              メーカーから車種を選択。車の寸法データが自動で読み込まれます。
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Search className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">2. 駐車場を検索</h3>
            <p className="text-sm text-muted-foreground">
              エリアや駐車場名から、気になる駐車場を見つけましょう。
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">3. 判定を確認</h3>
            <p className="text-sm text-muted-foreground">
              OK・ギリギリ・NGの3段階で、停められるかどうかが一目瞭然。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
