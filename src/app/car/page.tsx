import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { getMakers, getModelsWithMaker } from "@/lib/queries";

export const revalidate = 86400; // 24h

export const metadata: Metadata = {
  title: "車種一覧 — サイズ・駐車場適合を確認 | トメピタ",
  description:
    "国産車・輸入車の車種一覧。各車種の寸法（全長・全幅・全高・重量）と駐車場への適合判定を確認できます。",
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
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }, { label: "車種一覧" }]}
      />

      <h1 className="mb-2 text-3xl font-bold">車種一覧</h1>
      <p className="mb-8 text-muted-foreground">
        車種のサイズと駐車場への適合を確認できます
      </p>

      {/* メーカー クイックジャンプ */}
      <div className="mb-10 flex flex-wrap gap-2">
        {makerList.map((maker) => (
          <a
            key={maker.slug}
            href={`#maker-${maker.slug}`}
            className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
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
          <section key={maker.slug} id={`maker-${maker.slug}`} className="mb-12">
            <h2 className="mb-4 text-xl font-bold">
              <Link
                href={`/maker/${maker.slug}`}
                className="transition-colors hover:text-primary"
              >
                {maker.name}
              </Link>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {models.map((model) => (
                <Link
                  key={model.slug}
                  href={`/car/${model.slug}`}
                  className="rounded-lg border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <p className="font-medium">{model.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
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
