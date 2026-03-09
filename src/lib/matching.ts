export type MatchResult = "ok" | "caution" | "ng";

export interface DimensionDetail {
  dimension: string;
  label: string;
  value: number;
  limit: number;
  ratio: number;
}

export interface MatchDetail {
  result: MatchResult;
  details: DimensionDetail[];
}

/**
 * 車の寸法と駐車場の制限値を比較し、マッチング判定を行う。
 *
 * - 全寸法が制限の 95% 以下 -> OK
 * - いずれかが 95-100% -> CAUTION
 * - いずれかが超過 -> NG
 */
export function calculateMatch(
  dimension: {
    length_mm: number | null;
    width_mm: number | null;
    height_mm: number | null;
    weight_kg: number | null;
  },
  restriction: {
    max_length_mm: number | null;
    max_width_mm: number | null;
    max_height_mm: number | null;
    max_weight_kg: number | null;
  }
): MatchDetail {
  const checks: {
    dimension: string;
    label: string;
    value: number | null;
    limit: number | null;
    unit: string;
  }[] = [
    {
      dimension: "length",
      label: "全長",
      value: dimension.length_mm,
      limit: restriction.max_length_mm,
      unit: "mm",
    },
    {
      dimension: "width",
      label: "全幅",
      value: dimension.width_mm,
      limit: restriction.max_width_mm,
      unit: "mm",
    },
    {
      dimension: "height",
      label: "全高",
      value: dimension.height_mm,
      limit: restriction.max_height_mm,
      unit: "mm",
    },
    {
      dimension: "weight",
      label: "重量",
      value: dimension.weight_kg,
      limit: restriction.max_weight_kg,
      unit: "kg",
    },
  ];

  const details: DimensionDetail[] = [];
  let overallResult: MatchResult = "ok";

  for (const check of checks) {
    if (check.value == null || check.limit == null) continue;

    const ratio = check.value / check.limit;
    details.push({
      dimension: check.dimension,
      label: check.label,
      value: check.value,
      limit: check.limit,
      ratio,
    });

    if (ratio > 1.0) {
      overallResult = "ng";
    } else if (ratio > 0.95 && overallResult !== "ng") {
      overallResult = "caution";
    }
  }

  return { result: overallResult, details };
}

/**
 * CAUTION/NG の理由を1行テキストで返す。
 * 最も危険（ratioが大きい）な項目を優先表示。
 */
export function formatMatchReason(details: DimensionDetail[]): string | null {
  // ratio が大きい順にソート
  const sorted = [...details].sort((a, b) => b.ratio - a.ratio);
  const worst = sorted[0];
  if (!worst) return null;

  const unit = worst.dimension === "weight" ? "kg" : "mm";

  if (worst.ratio > 1.0) {
    const diff = Math.round(worst.value - worst.limit);
    return `${worst.label} ${diff}${unit}超過`;
  }
  if (worst.ratio > 0.95) {
    const diff = Math.round(worst.limit - worst.value);
    return `${worst.label}あと${diff}${unit}`;
  }
  return null;
}

/** マッチング結果のソート順 (OK -> CAUTION -> NG) */
export function matchSortOrder(result: MatchResult): number {
  switch (result) {
    case "ok":
      return 0;
    case "caution":
      return 1;
    case "ng":
      return 2;
  }
}
