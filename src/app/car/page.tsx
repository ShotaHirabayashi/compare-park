import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { getMakers, getModelsWithMaker } from "@/lib/queries";

export const revalidate = 86400; // 24h

export const metadata: Metadata = {
  title: "車種一覧 — サイズ・駐車場適合を確認 | トメピタ",
  description:
    "国産車・輸入車の車種一覧。各車種の寸法（全長・全幅・全高・重量）と機械式・立体駐車場への適合判定を確認できます。",
  alternates: { canonical: "/car" },
};

export default async function CarListPage() {
  const [makerList, allModels] = await Promise.all([
    getMakers(),
    getModelsWithMaker(),
  ]);

  // メーカー別にグルーピング
  const modelsByMaker = new Map<string, typeof allModels>();
  for (const model of allModels) {
    const key = model.maker_slug;
    if (!modelsByMaker.has(key)) {
      modelsByMaker.set(key, []);
    }
    modelsByMaker.get(key)!.push(model);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "車種一覧 — サイズ・駐車場適合を確認 | トメピタ",
          description: "国産車・輸入車の車種一覧。各車種の寸法（全長・全幅・全高・重量）と機械式・立体駐車場への適合判定を確認できます。",
          url: "https://www.tomepita.com/car",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: allModels.length,
            itemListElement: allModels.slice(0, 50).map((model, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://www.tomepita.com/car/${model.slug}`,
              name: `${model.maker_name} ${model.name}`,
            })),
          },
        }}
      />
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }, { label: "車種一覧" }]}
        currentPath="/car"
      />

      <h1 className="mb-2 text-3xl font-bold">車種一覧</h1>
      <p className="mb-8 text-muted-foreground">
        車種のサイズと駐車場への適合を確認できます
      </p>

      {/* メーカー クイックジャンプ */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        {makerList.map((maker) => (
          <a
            key={maker.slug}
            href={`#maker-${maker.slug}`}
            className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {maker.name}
          </a>
        ))}
      </div>

      {/* メーカー別グリッド */}
      {makerList.map((maker) => {
        const models = modelsByMaker.get(maker.slug);
        if (!models || models.length === 0) return null;

        return (
          <section key={maker.slug} id={`maker-${maker.slug}`} className="mb-8">
            <h2 className="mb-2 text-lg font-bold">
              <Link
                href={`/maker/${maker.slug}`}
                className="transition-colors hover:text-primary"
              >
                {maker.name}
              </Link>
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {models.map((model) => (
                <Link
                  key={model.slug}
                  href={`/car/${model.slug}`}
                  className="rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <p className="font-medium">{model.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {model.body_type}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
