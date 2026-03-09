import Image from "next/image";
import Link from "next/link";
import { Car } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchBadge } from "@/components/match-badge";
import type { MatchResult } from "@/lib/matching";

const bodyTypeLabels: Record<string, string> = {
  sedan: "セダン",
  suv: "SUV",
  minivan: "ミニバン",
  compact: "コンパクト",
  wagon: "ワゴン",
  coupe: "クーペ",
  truck: "トラック",
};

const bodyTypeImages: Record<string, string> = {
  sedan: "/images/cars/sedan.jpg",
  suv: "/images/cars/suv.jpg",
  minivan: "/images/cars/minivan.jpg",
  compact: "/images/cars/compact.jpg",
  wagon: "/images/cars/wagon.jpg",
  coupe: "/images/cars/coupe.jpg",
  truck: "/images/cars/truck.jpg",
};

interface VehicleCardProps {
  slug: string;
  name: string;
  makerName: string;
  bodyType: string;
  lengthMm?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  weightKg?: number | null;
  matchResult?: MatchResult;
}

export function VehicleCard({
  slug,
  name,
  makerName,
  bodyType,
  lengthMm,
  widthMm,
  heightMm,
  weightKg,
  matchResult,
}: VehicleCardProps) {
  return (
    <Link href={`/car/${slug}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden">
        <div className="relative h-32 w-full bg-muted/30">
          <Image
            src={bodyTypeImages[bodyType] ?? bodyTypeImages.sedan}
            alt={bodyTypeLabels[bodyType] ?? bodyType}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <CardHeader className="pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{name}</CardTitle>
            {matchResult && <MatchBadge result={matchResult} />}
          </div>
          <CardDescription className="flex items-center gap-2">
            <span>{makerName}</span>
            <Badge variant="outline" className="text-xs">
              {bodyTypeLabels[bodyType] ?? bodyType}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Car className="size-4 shrink-0" />
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {lengthMm != null && <span>全長 {lengthMm.toLocaleString()}mm</span>}
              {widthMm != null && <span>全幅 {widthMm.toLocaleString()}mm</span>}
              {heightMm != null && <span>全高 {heightMm.toLocaleString()}mm</span>}
              {weightKg != null && <span>重量 {weightKg.toLocaleString()}kg</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
