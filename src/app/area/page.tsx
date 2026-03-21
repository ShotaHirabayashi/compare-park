import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/breadcrumb";
import { getParkingLots } from "@/lib/queries";
import { TOKYO_WARD_MAP } from "@/lib/constants";

export const metadata: Metadata = {
  title: "エリアから駐車場を探す | トメピタ",
  description:
    "東京23区からエリアを選んで機械式・立体駐車場を検索。各区の駐車場数やサイズ制限も一覧表示します。",
  alternates: { canonical: "/area" },
};

export default async function AreaPage() {
  const lots = await getParkingLots();

  // 各区の駐車場数をカウント
  const wardCounts = new Map<string, number>();
  for (const w of TOKYO_WARD_MAP) {
    wardCounts.set(w.name, 0);
  }
  for (const lot of lots) {
    if (!lot.address) continue;
    for (const w of TOKYO_WARD_MAP) {
      if (lot.address.includes(w.name)) {
        wardCounts.set(w.name, (wardCounts.get(w.name) ?? 0) + 1);
        break;
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "エリアから探す" },
        ]}
        currentPath="/area"
      />

      <h1 className="mb-8 text-3xl font-bold">エリアから駐車場を探す</h1>
      <p className="mb-8 text-muted-foreground">
        東京23区のエリアを選択して、駐車場の制限サイズと車種適合を確認できます。
      </p>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {TOKYO_WARD_MAP.map((w) => {
          const count = wardCounts.get(w.name) ?? 0;
          return (
            <Link key={w.slug} href={`/area/${w.slug}`}>
              <Card className="h-full transition-transform hover:scale-[1.02]">
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <span className="font-medium">{w.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {count}件
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
