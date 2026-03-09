"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CircleCheck, CircleX, TriangleAlert, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MatchBadge } from "@/components/match-badge";
import type { MatchResult } from "@/lib/matching";

const PAGE_SIZE = 20;

type FilterType = "all" | MatchResult;

const filterConfig: {
  key: FilterType;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    key: "ok",
    label: "OK",
    icon: CircleCheck,
    color: "text-match-ok",
    bg: "bg-match-ok/10",
    border: "border-match-ok",
  },
  {
    key: "caution",
    label: "注意",
    icon: TriangleAlert,
    color: "text-match-caution",
    bg: "bg-match-caution/10",
    border: "border-match-caution",
  },
  {
    key: "ng",
    label: "NG",
    icon: CircleX,
    color: "text-match-ng",
    bg: "bg-match-ng/10",
    border: "border-match-ng",
  },
];

export interface VehicleMatchItem {
  modelId: number;
  modelName: string;
  modelSlug: string;
  makerName: string;
  result: MatchResult;
}

interface VehicleMatchListProps {
  items: VehicleMatchItem[];
}

export function VehicleMatchList({ items }: VehicleMatchListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    const c = { ok: 0, caution: 0, ng: 0 };
    for (const item of items) {
      c[item.result]++;
    }
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;

    if (activeFilter !== "all") {
      result = result.filter((item) => item.result === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.modelName.toLowerCase().includes(q) ||
          item.makerName.toLowerCase().includes(q) ||
          `${item.makerName} ${item.modelName}`.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, activeFilter, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="space-y-4">
      {/* テキスト検索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="車種名・メーカー名で検索..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="pl-9"
        />
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3">
        {filterConfig.map(({ key, label, icon: Icon, color, bg, border }) => {
          const count = counts[key as MatchResult];
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() =>
                handleFilterChange(isActive ? "all" : key)
              }
              className={`rounded-lg border-2 p-3 text-center transition-all ${bg} ${
                isActive
                  ? `${border} ring-2 ring-offset-1 ring-current ${color}`
                  : "border-transparent"
              }`}
            >
              <Icon className={`mx-auto size-5 ${color}`} />
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </button>
          );
        })}
      </div>

      {/* フィルタタブ */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => handleFilterChange("all")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          すべて ({items.length})
        </button>
        {filterConfig.map(({ key, label }) => {
          const count = counts[key as MatchResult];
          return (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* リスト */}
      {visible.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            {visible.map((item) => (
              <div
                key={item.modelId}
                className="border-b border-border last:border-b-0"
              >
                <Link
                  href={`/car/${item.modelSlug}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.modelName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.makerName}
                    </p>
                  </div>
                  <MatchBadge result={item.result} className="shrink-0" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            該当する車種はありません。
          </CardContent>
        </Card>
      )}

      {/* もっと見る */}
      {remaining > 0 && (
        <button
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="w-full rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          もっと見る（残り{remaining}件）
        </button>
      )}
    </div>
  );
}
