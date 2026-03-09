import Link from "next/link";
import { Car, Search, CheckCircle, MapPin } from "lucide-react";
import {
  getMakers,
  getPopularModels,
  getModelsForSearch,
  getParkingLotsForSearch,
  getParkingLotsByWard,
} from "@/lib/queries";
import { MakerSearch } from "@/components/maker-search";
import { VehicleCard } from "@/components/vehicle-card";
import { InstantCheckForm } from "@/components/instant-check-form";
import { db } from "@/db";
import { models, makers, dimensions, trims, phases, generations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TOKYO_WARDS } from "@/lib/constants";

export default async function Home() {
  const [
    makerList,
    popularModels,
    vehiclesForSearch,
    parkingLotsForSearch,
    allModelsWithDims,
  ] = await Promise.all([
    getMakers(),
    getPopularModels(),
    getModelsForSearch(),
    getParkingLotsForSearch(),
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

      {/* 即判定フォーム */}
      <section id="check" className="-mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border bg-background p-6 shadow-lg">
          <h2 className="mb-4 text-center text-lg font-bold text-foreground">
            車種と駐車場を選んで即判定
          </h2>
          <InstantCheckForm
            vehicles={vehiclesForSearch}
            parkingLots={parkingLotsForSearch}
          />
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

      {/* エリアから探す */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          エリアから探す
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          東京23区の駐車場を探す
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TOKYO_WARDS.map((ward) => (
            <Link
              key={ward}
              href={`/area/${ward}`}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/30"
            >
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
              {ward}
            </Link>
          ))}
        </div>
      </section>

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
              上の即判定フォームから車種名を入力。メーカー名でも検索できます。
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Search className="size-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">2. 駐車場を選ぶ</h3>
            <p className="text-sm text-muted-foreground">
              駐車場名や住所で検索。気になる駐車場を見つけましょう。
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
