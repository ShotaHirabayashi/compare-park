"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const FILTER_PRESETS = {
  height: {
    label: "全高",
    options: [
      { value: "1550", label: "1,550mm+" },
      { value: "1800", label: "1,800mm+" },
      { value: "2000", label: "2,000mm+" },
    ],
  },
  width: {
    label: "全幅",
    options: [
      { value: "1850", label: "1,850mm+" },
      { value: "1950", label: "1,950mm+" },
      { value: "2050", label: "2,050mm+" },
    ],
  },
  length: {
    label: "全長",
    options: [
      { value: "5000", label: "5,000mm+" },
      { value: "5300", label: "5,300mm+" },
    ],
  },
} as const;

interface SizeFilterProps {
  currentMinHeight?: string;
  currentMinWidth?: string;
  currentMinLength?: string;
}

export function SizeFilter({
  currentMinHeight,
  currentMinWidth,
  currentMinLength,
}: SizeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && params.get(key) !== value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  const currentValues: Record<string, string | undefined> = {
    minHeight: currentMinHeight,
    minWidth: currentMinWidth,
    minLength: currentMinLength,
  };

  const paramKeys: Record<string, string> = {
    height: "minHeight",
    width: "minWidth",
    length: "minLength",
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h2 className="mb-3 text-sm font-semibold">サイズ条件で絞り込む</h2>
      <div className="space-y-3">
        {(Object.keys(FILTER_PRESETS) as Array<keyof typeof FILTER_PRESETS>).map(
          (dim) => {
            const preset = FILTER_PRESETS[dim];
            const paramKey = paramKeys[dim];
            const currentValue = currentValues[paramKey];

            return (
              <div key={dim}>
                <span className="mb-1 block text-xs text-muted-foreground">
                  {preset.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {preset.options.map((opt) => {
                    const isActive = currentValue === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          updateFilter(
                            paramKey,
                            isActive ? undefined : opt.value
                          )
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
