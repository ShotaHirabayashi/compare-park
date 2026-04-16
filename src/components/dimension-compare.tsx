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
    ng: "text-match-ng font-bold",
  }[status];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className={cn("px-2 py-0.5 rounded-full text-xs", 
          status === "ok" ? "bg-match-ok/10 text-match-ok" :
          status === "caution" ? "bg-match-caution/10 text-match-caution" :
          "bg-match-ng/10 text-match-ng font-bold"
        )}>
          {diff >= 0 ? `あと ${diff}${unit}` : `${Math.abs(diff)}${unit} 超過`}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${ratio}%` }}
          />
        </div>
        <span className="min-w-[85px] text-right text-xs text-muted-foreground tabular-nums">
          <span className={cn(status === "ng" && "text-match-ng font-bold")}>{value}</span>
          <span className="mx-0.5">/</span>
          {limit}{unit}
        </span>
      </div>
    </div>
  );
}
