import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type MatchResult = "ok" | "ng" | "caution";

interface MatchBadgeProps {
  result: MatchResult;
  className?: string;
}

const config: Record<
  MatchResult,
  {
    icon: React.ElementType;
    label: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  ok: {
    icon: CircleCheck,
    label: "駐車可能",
    bg: "bg-match-ok/10",
    text: "text-match-ok",
    border: "border-match-ok border-solid",
  },
  ng: {
    icon: CircleX,
    label: "駐車不可",
    bg: "bg-match-ng/10",
    text: "text-match-ng",
    border: "border-match-ng border-dashed",
  },
  caution: {
    icon: TriangleAlert,
    label: "要確認",
    bg: "bg-match-caution/10",
    text: "text-match-caution",
    border: "border-match-caution border-dotted",
  },
};

export function MatchBadge({ result, className }: MatchBadgeProps) {
  const { icon: Icon, label, bg, text, border } = config[result];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        bg,
        text,
        border,
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </span>
  );
}
