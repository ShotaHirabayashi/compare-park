import { cn } from "@/lib/utils";

interface Limit {
  value: number;
  label: string;
}

interface DimensionVisualizerProps {
  label: string;
  value: number;
  unit?: string;
  limits: Limit[];
  maxScale?: number;
}

export function DimensionVisualizer({
  label,
  value,
  unit = "mm",
  limits,
  maxScale,
}: DimensionVisualizerProps) {
  // スケールの最大値を決定
  const actualMax = Math.max(value, ...limits.map((l) => l.value));
  const scaleMax = maxScale || actualMax * 1.1;

  const valueRatio = (value / scaleMax) * 100;

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-muted-foreground">{label}</h3>
        <div className="text-lg font-bold tabular-nums">
          {value.toLocaleString()}
          <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
        </div>
      </div>

      <div className="relative pt-6 pb-2">
        {/* 背景のベースライン */}
        <div className="h-4 w-full rounded-full bg-muted/50" />

        {/* 制限値のマーカー */}
        {limits.map((limit, idx) => {
          const ratio = (limit.value / scaleMax) * 100;
          const isPassed = value <= limit.value;
          
          return (
            <div
              key={idx}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${ratio}%`, transform: "translateX(-50%)" }}
            >
              <div className={cn(
                "mb-1 text-[10px] font-bold whitespace-nowrap",
                isPassed ? "text-match-ok" : "text-match-ng"
              )}>
                {limit.label}
              </div>
              <div className={cn(
                "h-6 w-0.5",
                isPassed ? "bg-match-ok/40" : "bg-match-ng/40"
              )} />
              <div className="mt-5 text-[9px] text-muted-foreground tabular-nums">
                {limit.value}{unit}
              </div>
            </div>
          );
        })}

        {/* 車の現在の値を示すバー */}
        <div
          className="absolute top-6 h-4 rounded-full bg-primary shadow-sm transition-all duration-1000 ease-out"
          style={{ width: `${valueRatio}%` }}
        >
          <div className="absolute -right-1 -top-1 size-6 rounded-full border-2 border-background bg-primary shadow-sm" />
        </div>
      </div>
    </div>
  );
}
