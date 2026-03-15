import type { Metadata } from "next";
import Link from "next/link";
import { Ruler, ArrowUpDown, MoveHorizontal } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { SIZE_CATEGORIES } from "@/lib/constants";
import { getSizeConditionCounts } from "@/lib/queries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "サイズ条件で駐車場を探す | トメピタ",
  description:
    "ハイルーフ対応・全幅1,950mm以上・全長5,000mm以上など、サイズ条件から停められる機械式・立体駐車場を探せます。",
  alternates: { canonical: "/parking/size" },
};

const dimensionGroups = [
  {
    key: "height" as const,
    title: "全高（高さ）で探す",
    icon: ArrowUpDown,
    description: "SUV・ミニバン・ハイルーフ車向け",
  },
  {
    key: "width" as const,
    title: "全幅（横幅）で探す",
    icon: MoveHorizontal,
    description: "大型SUV・輸入車向け",
  },
  {
    key: "length" as const,
    title: "全長（長さ）で探す",
    icon: Ruler,
    description: "大型セダン・ミニバン向け",
  },
];

export default async function SizeIndexPage() {
  const counts = await getSizeConditionCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "サイズ条件で探す" },
        ]}
        currentPath="/parking/size"
      />

      <h1 className="mb-2 text-3xl font-bold">サイズ条件で駐車場を探す</h1>
      <p className="mb-8 text-muted-foreground">
        車のサイズに合った駐車場を、制限寸法の条件から絞り込めます。
      </p>

      <div className="space-y-10">
        {dimensionGroups.map((group) => {
          const categories = SIZE_CATEGORIES.filter(
            (c) => c.dimension === group.key
          );
          const Icon = group.icon;

          return (
            <section key={group.key}>
              <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
                <Icon className="size-5 text-muted-foreground" />
                {group.title}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {group.description}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const count = counts[`${cat.dimension}-${cat.thresholdMm}`] ?? 0;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/parking/size/${cat.slug}`}
                      className="block transition-transform hover:scale-[1.02]"
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-base font-semibold">
                            {cat.shortLabel}
                          </CardTitle>
                          <CardDescription>
                            {cat.label}
                          </CardDescription>
                          <p className="mt-1 text-sm font-medium text-primary">
                            {count}件の駐車場
                          </p>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
