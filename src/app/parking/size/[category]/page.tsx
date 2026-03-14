import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ParkingCard } from "@/components/parking-card";
import { Pagination } from "@/components/pagination";
import { JsonLd } from "@/components/json-ld";
import { SIZE_CATEGORIES, getSizeCategoryBySlug } from "@/lib/constants";
import { getParkingLotsBySizeCondition } from "@/lib/queries";

const PER_PAGE = 50;

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export function generateStaticParams() {
  return SIZE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getSizeCategoryBySlug(category);
  if (!cat) return {};

  return {
    title: `${cat.seoTitle} | トメピタ`,
    description: cat.description,
    alternates: { canonical: `/parking/size/${cat.slug}` },
  };
}

export default async function SizeCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const cat = getSizeCategoryBySlug(category);

  if (!cat) {
    notFound();
  }

  const allLots = await getParkingLotsBySizeCondition(cat.dimension, cat.thresholdMm);
  const totalCount = allLots.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const lots = allLots.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // 条件を緩められるカテゴリを計算
  const sameDimensionCategories = SIZE_CATEGORIES.filter(
    (c) => c.dimension === cat.dimension && c.slug !== cat.slug
  );

  // JSON-LDは現在のページの駐車場のみ
  const offset = (currentPage - 1) * PER_PAGE;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "サイズ条件で探す", href: "/parking/size" },
          { label: cat.shortLabel },
        ]}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: cat.seoTitle,
          description: cat.description,
          numberOfItems: totalCount,
          itemListElement: lots.map((lot, index) => ({
            "@type": "ListItem",
            position: offset + index + 1,
            name: lot.name,
            url: `https://www.tomepita.com/parking/${lot.slug}`,
          })),
        }}
      />

      <h1 className="mb-2 text-3xl font-bold">{cat.seoTitle}</h1>
      <p className="mb-8 text-muted-foreground">
        {cat.description}（{totalCount.toLocaleString()}件）
      </p>

      {lots.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((lot) => (
              <ParkingCard
                key={lot.id}
                slug={lot.slug}
                name={lot.name}
                address={lot.address}
                parkingType={lot.parking_type}
                maxLengthMm={lot.max_length_mm}
                maxWidthMm={lot.max_width_mm}
                maxHeightMm={lot.max_height_mm}
                maxWeightKg={lot.max_weight_kg}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/parking/size/${cat.slug}`}
            />
          )}
        </>
      ) : (
        <div className="rounded-lg border bg-muted/30 py-12 text-center">
          <p className="mb-4 text-muted-foreground">
            該当する駐車場が見つかりませんでした。
          </p>
          {sameDimensionCategories.length > 0 && (
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                条件を変えて探してみませんか？
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {sameDimensionCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/parking/size/${c.slug}`}
                    className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {c.shortLabel}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
