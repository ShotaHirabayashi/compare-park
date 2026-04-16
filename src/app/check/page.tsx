import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { getAllDestinations, categoryLabels } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "目的地から駐車場を探す | トメピタ",
  description: "主要な百貨店、ホテル、病院、空港などの周辺で、お持ちの車が停められる駐車場をサイズ判定付きで探せます。",
};

export default async function CheckIndexPage() {
  const destinations = getAllDestinations();

  // カテゴリごとにグルーピング
  const grouped = destinations.reduce((acc, d) => {
    if (!acc[d.category]) acc[d.category] = [];
    acc[d.category].push(d);
    return acc;
  }, {} as Record<string, typeof destinations>);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }, { label: "目的地から探す" }]}
        currentPath="/check"
      />

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">目的地から駐車場を探す</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          お出かけ先の公式駐車場に車が入るか不安ですか？<br className="hidden sm:block" />
          目的地を選んで、あなたの車に最適な駐車場を1秒判定。
        </p>
      </div>

      <div className="grid gap-10">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold border-b pb-2">
              <MapPin className="size-5 text-primary" />
              {categoryLabels[category] ?? category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/check/${dest.slug}`}
                  className="group block rounded-xl border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        {dest.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground truncate max-w-[200px]">
                        {dest.address}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      公式: {dest.max_height_mm ? `高さ${dest.max_height_mm}mm` : "詳細あり"}
                    </span>
                    {dest.max_width_mm && (
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        幅{dest.max_width_mm}mm
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 検索で見つからない場合への導線 */}
      <div className="mt-16 rounded-2xl bg-muted/30 p-8 text-center border border-dashed">
        <h3 className="text-lg font-bold">目的地が見つかりませんか？</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          地名や駅名、車種名から直接検索することも可能です。
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/area" className="text-sm font-bold text-primary hover:underline">エリアから探す</Link>
          <Link href="/car" className="text-sm font-bold text-primary hover:underline">車種から探す</Link>
        </div>
      </div>
    </div>
  );
}
