import { readFileSync } from "fs";

export interface CsvParkingRow {
  name: string;
  slug: string;
  address: string;
  latitude: string;
  longitude: string;
  parking_type: string;
  total_spaces: string;
  is_24h: string;
  open_time: string;
  close_time: string;
  fee_type: string;
  amount_yen: string;
  duration_minutes: string;
  fee_notes: string;
  restriction_name: string;
  max_length_mm: string;
  max_width_mm: string;
  max_height_mm: string;
  max_weight_kg: string;
  spaces_count: string;
  restriction_notes: string;
  source_url: string;
}

export interface ParsedParkingLot {
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  parkingType: "mechanical" | "self_propelled" | "flat" | "tower";
  totalSpaces: number;
  is24h: boolean;
  openTime?: string;
  closeTime?: string;
  sourceUrl?: string;
  restrictions: {
    name: string;
    maxLengthMm: number;
    maxWidthMm: number;
    maxHeightMm: number;
    maxWeightKg: number;
    spacesCount: number;
    notes?: string;
  }[];
  fees: {
    feeType: "hourly" | "daily" | "monthly";
    amountYen: number;
    durationMinutes?: number;
    notes?: string;
  }[];
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

export function parseCsvFile(filePath: string): ParsedParkingLot[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim() !== "");

  if (lines.length < 2) {
    throw new Error("CSVファイルにデータ行がありません");
  }

  const headers = parseCsvLine(lines[0]);
  const expectedHeaders = [
    "name", "slug", "address", "latitude", "longitude",
    "parking_type", "total_spaces", "is_24h", "open_time", "close_time",
    "fee_type", "amount_yen", "duration_minutes", "fee_notes",
    "restriction_name", "max_length_mm", "max_width_mm", "max_height_mm",
    "max_weight_kg", "spaces_count", "restriction_notes", "source_url",
  ];

  // ヘッダー検証
  for (const h of expectedHeaders) {
    if (!headers.includes(h)) {
      throw new Error(`必須ヘッダー「${h}」が見つかりません。ヘッダー: ${headers.join(", ")}`);
    }
  }

  const headerIndex = new Map<string, number>();
  headers.forEach((h, i) => headerIndex.set(h, i));

  const getField = (fields: string[], key: string): string => {
    const idx = headerIndex.get(key);
    return idx !== undefined && idx < fields.length ? fields[idx] : "";
  };

  // 行をパース→駐車場ごとにグルーピング
  const lots: ParsedParkingLot[] = [];
  let currentLot: ParsedParkingLot | null = null;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const slug = getField(fields, "slug");
    const name = getField(fields, "name");

    // slugがある行 = 新しい駐車場の開始
    if (slug) {
      if (currentLot) {
        lots.push(currentLot);
      }

      const is24hRaw = getField(fields, "is_24h").toUpperCase();
      const parkingType = getField(fields, "parking_type") as ParsedParkingLot["parkingType"];
      const sourceUrl = getField(fields, "source_url");

      currentLot = {
        name,
        slug,
        address: getField(fields, "address"),
        latitude: parseFloat(getField(fields, "latitude")) || 0,
        longitude: parseFloat(getField(fields, "longitude")) || 0,
        parkingType,
        totalSpaces: parseInt(getField(fields, "total_spaces")) || 0,
        is24h: is24hRaw === "TRUE" || is24hRaw === "1" || is24hRaw === "YES",
        openTime: getField(fields, "open_time") || undefined,
        closeTime: getField(fields, "close_time") || undefined,
        sourceUrl: sourceUrl || undefined,
        restrictions: [],
        fees: [],
      };

      // 料金データ
      const feeType = getField(fields, "fee_type");
      const amountYen = getField(fields, "amount_yen");
      if (feeType && amountYen) {
        currentLot.fees.push({
          feeType: feeType as "hourly" | "daily" | "monthly",
          amountYen: parseInt(amountYen),
          durationMinutes: parseInt(getField(fields, "duration_minutes")) || undefined,
          notes: getField(fields, "fee_notes") || undefined,
        });
      }
    }

    // 制限データ（全行で処理）
    if (currentLot) {
      const restrictionName = getField(fields, "restriction_name");
      if (restrictionName) {
        currentLot.restrictions.push({
          name: restrictionName,
          maxLengthMm: parseInt(getField(fields, "max_length_mm")) || 0,
          maxWidthMm: parseInt(getField(fields, "max_width_mm")) || 0,
          maxHeightMm: parseInt(getField(fields, "max_height_mm")) || 0,
          maxWeightKg: parseInt(getField(fields, "max_weight_kg")) || 0,
          spacesCount: parseInt(getField(fields, "spaces_count")) || 0,
          notes: getField(fields, "restriction_notes") || undefined,
        });
      }
    }
  }

  // 最後の駐車場を追加
  if (currentLot) {
    lots.push(currentLot);
  }

  return lots;
}
