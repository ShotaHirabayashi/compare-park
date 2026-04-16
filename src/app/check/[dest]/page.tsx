import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Info, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { VehicleComboboxNav } from "@/components/vehicle-combobox-nav";
import { JsonLd } from "@/components/json-ld";
import { getDestinationBySlug, getAllDestinations, categoryLabels } from "@/lib/destinations";
import { getModelsForSearch, getNearbyParkingLots } from "@/lib/queries";
import { ParkingCard } from "@/components/parking-card";

interface Props {
  params: Promise<{ dest: string }>;
}

export async function generateStaticParams() {
  const destinations = getAllDestinations();
  return destinations.map((d) => ({ dest: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dest } = await params;
  const destination = getDestinationBySlug(dest);
  if (!destination) return {};

  const title = `${destination.name}周辺の駐車場 | あなたの車は停められる？ | トメピタ`;
  const description = `${destination.name}にお出かけですか？公式駐車場のサイズ制限(${destination.max_height_mm ? `高さ${destination.max_height_mm}mm` : "詳細"})と、周辺の停められる駐車場を車種別に判定します。`;

  return {
    title,
    description,
    alternates: { canonical: `/check/${dest}` },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { dest } = await params;
  const destination = getDestinationBySlug(dest);
  if (!destination) notFound();

  const [vehicles, nearbyLots] = await Promise.all([
    getModelsForSearch(),
    getNearbyParkingLots(destination.latitude, destination.longitude, 0.8),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${destination.name}周辺の駐車場サイズ判定`,
          description: `${destination.name}周辺で、お持ちの車が停められる駐車場を探せます。`,
        }}
      />
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "目的地から探す", href: "/check" },
          { label: destination.name },
        ]}
        currentPath={`/check/${dest}`}
      />

      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <MapPin className="size-4" />
          {categoryLabels[destination.category]}
        </div>
        <h1 className="mt-1 text-3xl font-bold">{destination.name}周辺の駐車場</h1>
        <p className="mt-2 text-muted-foreground">
          {destination.name}にお出かけの際、駐車場サイズが心配な方はこちらでチェック。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* 公式駐車場情報 */}
          <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="size-5 text-primary" />
                公式駐車場のサイズ制限
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-muted-foreground">駐車場名</p>
                  <p className="text-lg font-bold">{destination.official_parking_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">高さ制限</p>
                    <p className="text-xl font-bold text-primary">
                      {destination.max_height_mm ? `${destination.max_height_mm}mm` : "詳細はお問い合わせ"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">全幅制限</p>
                    <p className="text-xl font-bold">
                      {destination.max_width_mm ? `${destination.max_width_mm}mm` : "-"}
                    </p>
                  </div>
                </div>
                {destination.notes && (
                  <p className="text-sm bg-background/50 p-3 rounded-lg border border-primary/10 italic">
                    {destination.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 車種選択 */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">あなたの車で判定する</h2>
            <div className="rounded-xl border bg-muted/30 p-6 shadow-inner">
              <p className="mb-4 text-sm text-muted-foreground">
                お持ちの車種を選択してください。{destination.name}公式駐車場および周辺駐車場の適合を一括で判定します。
              </p>
              <VehicleComboboxNav
                vehicles={vehicles}
                basePath={`/check/${dest}`}
              />
            </div>
          </section>

          {/* 周辺駐車場一覧（プレビュー） */}
          <section>
            <h2 className="mb-4 text-xl font-bold">{destination.name}周辺の駐車場 ({nearbyLots.length}件)</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {nearbyLots.map((lot) => (
                <ParkingCard
                  key={lot.id}
                  slug={lot.slug}
                  name={lot.name}
                  address={lot.address}
                  parkingType={lot.parking_type}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          {/* サイドバー: 他の目的地 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground font-bold">他の人気の目的地</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {getAllDestinations()
                  .filter((d) => d.slug !== dest)
                  .slice(0, 8)
                  .map((d) => (
                    <Link
                      key={d.slug}
                      href={`/check/${d.slug}`}
                      className="group flex items-center gap-3 rounded-lg border p-2 transition-colors hover:bg-muted"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                        <MapPin className="size-4" />
                      </div>
                      <span className="text-sm font-medium group-hover:text-primary truncate">{d.name}</span>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
