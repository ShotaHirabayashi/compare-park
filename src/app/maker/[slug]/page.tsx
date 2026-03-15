import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { getMakers, getMakerBySlug, getModelsByMakerSlug } from "@/lib/queries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allMakers = await getMakers();
  return allMakers.map((m) => ({ slug: m.slug }));
}

export const revalidate = 604800; // 7d

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const maker = await getMakerBySlug(slug);
  if (!maker) return { title: "メーカーが見つかりません" };

  return {
    title: `${maker.name}の車種一覧 — 駐車場サイズ適合 | トメピタ`,
    description: `${maker.name}の車種一覧。各車種の寸法と機械式・立体駐車場への適合判定を確認できます。`,
    alternates: { canonical: `/maker/${slug}` },
  };
}

export default async function MakerPage({ params }: Props) {
  const { slug } = await params;
  const maker = await getMakerBySlug(slug);
  if (!maker) notFound();

  const rawModels = await getModelsByMakerSlug(slug);

  // 重複排除（LEFT JOINで複数行になる場合）
  const modelMap = new Map<number, (typeof rawModels)[number]>();
  for (const row of rawModels) {
    if (!modelMap.has(row.id)) {
      modelMap.set(row.id, row);
    }
  }
  const models = Array.from(modelMap.values());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "車種一覧", href: "/car" },
          { label: maker.name },
        ]}
        currentPath={`/maker/${maker.slug}`}
      />

      <h1 className="mb-2 text-3xl font-bold">{maker.name}の車種一覧</h1>
      <p className="mb-8 text-muted-foreground">
        {maker.name}の車種 ({models.length}件)
      </p>

      {models.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              {model.length_mm != null && model.width_mm != null && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {model.length_mm.toLocaleString()}mm ×{" "}
                  {model.width_mm.toLocaleString()}mm
                  {model.height_mm != null &&
                    ` × ${model.height_mm.toLocaleString()}mm`}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/30 py-12 text-center">
          <p className="text-muted-foreground">
            車種データはまだ登録されていません。
          </p>
        </div>
      )}
    </div>
  );
}
