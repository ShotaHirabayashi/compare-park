import { cn } from "@/lib/utils";

interface DimensionCompareProps {
  label: string;
  value: number;
  limit: number;
  unit?: string;
}

export function DimensionCompare({
  label,
  value,
  limit,
  unit = "mm",
}: DimensionCompareProps) {
  const ratio = Math.min((value / limit) * 100, 100);
  const diff = limit - value;
  const percentage = value / limit;

  // OK: value <= 95% of limit, CAUTION: 95-100%, NG: over 100%
  const status: "ok" | "caution" | "ng" =
    percentage <= 0.95 ? "ok" : percentage <= 1.0 ? "caution" : "ng";

  const barColor = {
    ok: "bg-match-ok",
    caution: "bg-match-caution",
    ng: "bg-match-ng",
  }[status];

  const textColor = {
    ok: "text-match-ok",
    caution: "text-match-caution",
    ng: "text-match-ng",
  }[status];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className={cn("font-medium", textColor)}>
          {diff >= 0 ? `+${diff}${unit}` : `${diff}${unit}`}{" "}
          {diff >= 0 ? "\u2705" : "\u274C"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${ratio}%` }}
          />
        </div>
        <span className="min-w-[80px] text-right text-xs text-muted-foreground">
          {value} / {limit}
          {unit}
        </span>
      </div>
    </div>
  );
}
