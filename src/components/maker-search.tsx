"use client";

import { useState } from "react";
import { VehicleCard } from "@/components/vehicle-card";

interface Maker {
  id: number;
  name: string;
  slug: string;
}

interface Model {
  id: number;
  name: string;
  slug: string;
  body_type: string;
  maker_id: number;
  maker_name: string;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  weight_kg: number | null;
}

interface MakerSearchProps {
  makers: Maker[];
  models: Model[];
}

export function MakerSearch({ makers, models }: MakerSearchProps) {
  const [selectedMakerId, setSelectedMakerId] = useState<number | null>(null);

  const filteredModels = selectedMakerId
    ? models.filter((m) => m.maker_id === selectedMakerId)
    : [];

  return (
    <div className="space-y-6">
      {/* メーカーチップ */}
      <div className="flex flex-wrap gap-2">
        {makers.map((maker) => (
          <button
            key={maker.id}
            onClick={() =>
              setSelectedMakerId(
                selectedMakerId === maker.id ? null : maker.id
              )
            }
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedMakerId === maker.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {maker.name}
          </button>
        ))}
      </div>

      {/* 車種リスト */}
      {selectedMakerId && (
        <div>
          {filteredModels.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredModels.map((model) => (
                <VehicleCard
                  key={model.id}
                  slug={model.slug}
                  name={model.name}
                  makerName={model.maker_name}
                  bodyType={model.body_type}
                  lengthMm={model.length_mm}
                  widthMm={model.width_mm}
                  heightMm={model.height_mm}
                  weightKg={model.weight_kg}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              このメーカーの車種データはまだ登録されていません。
            </p>
          )}
        </div>
      )}

      {!selectedMakerId && (
        <p className="text-center text-muted-foreground">
          メーカーを選択してください
        </p>
      )}
    </div>
  );
}
