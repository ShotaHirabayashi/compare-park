import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { MatchBadge } from "@/components/match-badge";
import { DimensionCompare } from "@/components/dimension-compare";
import {
  getParkingLotBySlug,
  getRestrictionsByParkingLotId,
  getFeesByParkingLotId,
  getOperatingHoursByParkingLotId,
  getAllDimensions,
} from "@/lib/queries";
import { calculateMatch, matchSortOrder, type MatchResult } from "@/lib/matching";
import Link from "next/link";

const parkingTypeLabels: Record<string, string> = {
  mechanical: "機械式",
  self_propelled: "自走式",
  flat: "平面",
  tower: "タワー式",
};

const feeTypeLabels: Record<string, string> = {
  hourly: "時間料金",
  daily: "日額料金",
  monthly: "月額料金",
};

const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lot = await getParkingLotBySlug(slug);
  if (!lot) return { title: "駐車場が見つかりません" };

  return {
    title: `${lot.name} の制限寸法と対応車種 | Compare Park`,
    description: `${lot.name}(${lot.address ?? ""})の制限寸法を確認。対応する車種の一覧と適合判定も表示します。`,
  };
}

function extractWard(address: string | null): string | null {
  if (!address) return null;
  const match = address.match(/([\u4e00-\u9fa5]+区)/);
  return match ? match[1] : null;
}

export default async function ParkingDetailPage({ params }: Props) {
  const { slug } = await params;
  const lot = await getParkingLotBySlug(slug);
  if (!lot) notFound();

  const [restrictions, fees, hours, allDims] = await Promise.all([
    getRestrictionsByParkingLotId(lot.id),
    getFeesByParkingLotId(lot.id),
    getOperatingHoursByParkingLotId(lot.id),
    getAllDimensions(),
  ]);

  const ward = extractWard(lot.address);

  // 車種ごとに最良の制限でマッチング判定
  type VehicleMatch = {
    model_id: number;
    model_name: string;
    model_slug: string;
    body_type: string;
    maker_name: string;
    result: MatchResult;
    length_mm: number | null;
    width_mm: number | null;
    height_mm: number | null;
    weight_kg: number | null;
  };

  const vehicleMap = new Map<number, VehicleMatch>();

  // model_idで重複排除しつつ最初の寸法を使う
  const uniqueDims = new Map<number, (typeof allDims)[number]>();
  for (const d of allDims) {
    if (!uniqueDims.has(d.model_id)) {
      uniqueDims.set(d.model_id, d);
    }
  }

  for (const dim of uniqueDims.values()) {
    let bestResult: MatchResult = "ng";

    for (const r of restrictions) {
      const match = calculateMatch(
        {
          length_mm: dim.length_mm,
          width_mm: dim.width_mm,
          height_mm: dim.height_mm,
          weight_kg: dim.weight_kg,
        },
        {
          max_length_mm: r.max_length_mm,
          max_width_mm: r.max_width_mm,
          max_height_mm: r.max_height_mm,
          max_weight_kg: r.max_weight_kg,
        }
      );
      if (matchSortOrder(match.result) < matchSortOrder(bestResult)) {
        bestResult = match.result;
      }
    }

    vehicleMap.set(dim.model_id, {
      model_id: dim.model_id,
      model_name: dim.model_name,
      model_slug: dim.model_slug,
      body_type: dim.body_type,
      maker_name: dim.maker_name,
      result: bestResult,
      length_mm: dim.length_mm,
      width_mm: dim.width_mm,
      height_mm: dim.height_mm,
      weight_kg: dim.weight_kg,
    });
  }

  const vehicleResults = Array.from(vehicleMap.values()).sort(
    (a, b) => matchSortOrder(a.result) - matchSortOrder(b.result)
  );

  const okVehicles = vehicleResults.filter((v) => v.result === "ok");
  const cautionVehicles = vehicleResults.filter((v) => v.result === "caution");
  const ngVehicles = vehicleResults.filter((v) => v.result === "ng");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          ...(ward ? [{ label: ward, href: `/area/${ward}` }] : []),
          { label: lot.name },
        ]}
      />

      {/* 駐車場基本情報 */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{lot.name}</h1>
          {lot.parking_type && (
            <Badge variant="outline">
              {parkingTypeLabels[lot.parking_type] ?? lot.parking_type}
            </Badge>
          )}
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          {lot.address && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              {lot.address}
            </p>
          )}
          {lot.phone && (
            <p className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              {lot.phone}
            </p>
          )}
          {lot.url && (
            <p className="flex items-center gap-2">
              <ExternalLink className="size-4 shrink-0" />
              <a
                href={lot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                公式サイト
              </a>
            </p>
          )}
          {lot.total_spaces != null && (
            <p>総台数: {lot.total_spaces}台</p>
          )}
          {lot.notes && <p>{lot.notes}</p>}
        </div>
      </div>

      {/* 営業時間 */}
      {hours.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="size-5" />
              営業時間
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1 text-sm">
              {hours.map((h) => (
                <div key={h.id} className="flex gap-4">
                  <span className="w-8 font-medium">
                    {dayLabels[h.day_of_week]}
                  </span>
                  <span>
                    {h.is_24h
                      ? "24時間"
                      : `${h.open_time ?? "-"} - ${h.close_time ?? "-"}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 料金情報 */}
      {fees.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">料金</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {fees.map((f) => (
                <div key={f.id} className="flex items-center justify-between">
                  <span>{feeTypeLabels[f.fee_type] ?? f.fee_type}</span>
                  <span className="font-medium">
                    {f.amount_yen.toLocaleString()}円
                    {f.duration_minutes
                      ? ` / ${f.duration_minutes}分`
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 制限値一覧 */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-bold">制限サイズ</h2>
        {restrictions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restrictions.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="text-base">{r.restriction_name}</CardTitle>
                  {r.spaces_count != null && (
                    <p className="text-sm text-muted-foreground">{r.spaces_count}台</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  {r.max_length_mm != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">全長</span>
                      <span className="font-medium">{r.max_length_mm.toLocaleString()}mm</span>
                    </div>
                  )}
                  {r.max_width_mm != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">全幅</span>
                      <span className="font-medium">{r.max_width_mm.toLocaleString()}mm</span>
                    </div>
                  )}
                  {r.max_height_mm != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">全高</span>
                      <span className="font-medium">{r.max_height_mm.toLocaleString()}mm</span>
                    </div>
                  )}
                  {r.max_weight_kg != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">重量</span>
                      <span className="font-medium">{r.max_weight_kg.toLocaleString()}kg</span>
                    </div>
                  )}
                  {r.monthly_fee_yen != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">月額</span>
                      <span className="font-medium">{r.monthly_fee_yen.toLocaleString()}円</span>
                    </div>
                  )}
                  {r.notes && (
                    <p className="pt-1 text-xs text-muted-foreground">{r.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              制限サイズデータがまだ登録されていません。
            </CardContent>
          </Card>
        )}
      </section>

      {/* 停められる車種一覧 */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">車種との適合判定</h2>

        {vehicleResults.length > 0 ? (
          <div className="space-y-8">
            {/* OK */}
            {okVehicles.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <MatchBadge result="ok" />
                  <span>{okVehicles.length}車種</span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {okVehicles.map((v) => (
                    <Link key={v.model_id} href={`/car/${v.model_slug}`} className="block">
                      <Card className="h-full transition-transform hover:scale-[1.02]" size="sm">
                        <CardContent className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{v.model_name}</p>
                            <p className="text-xs text-muted-foreground">{v.maker_name}</p>
                          </div>
                          <MatchBadge result="ok" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CAUTION */}
            {cautionVehicles.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <MatchBadge result="caution" />
                  <span>{cautionVehicles.length}車種</span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cautionVehicles.map((v) => (
                    <Link key={v.model_id} href={`/car/${v.model_slug}`} className="block">
                      <Card className="h-full transition-transform hover:scale-[1.02]" size="sm">
                        <CardContent className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{v.model_name}</p>
                            <p className="text-xs text-muted-foreground">{v.maker_name}</p>
                          </div>
                          <MatchBadge result="caution" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* NG */}
            {ngVehicles.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <MatchBadge result="ng" />
                  <span>{ngVehicles.length}車種</span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ngVehicles.map((v) => (
                    <Link key={v.model_id} href={`/car/${v.model_slug}`} className="block">
                      <Card className="h-full transition-transform hover:scale-[1.02]" size="sm">
                        <CardContent className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{v.model_name}</p>
                            <p className="text-xs text-muted-foreground">{v.maker_name}</p>
                          </div>
                          <MatchBadge result="ng" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              車種データがまだ登録されていません。
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
