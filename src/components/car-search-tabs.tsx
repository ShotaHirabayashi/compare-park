"use client";

import { useState } from "react";
import { VehicleCard } from "@/components/vehicle-card";
import { MakerSearch } from "@/components/maker-search";

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

interface PopularModel {
  id: number;
  name: string;
  slug: string;
  body_type: string;
  maker_name: string;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  weight_kg: number | null;
}

interface CarSearchTabsProps {
  makers: Maker[];
  models: Model[];
  popularWithDims: PopularModel[];
}

export function CarSearchTabs({ makers, models, popularWithDims }: CarSearchTabsProps) {
  const [activeTab, setActiveTab] = useState<"popular" | "maker">("popular");

  return (
    <div className="space-y-6">
      {/* Pill タブ */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-muted p-1">
          <button
            onClick={() => setActiveTab("popular")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === "popular"
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            人気の車種
          </button>
          <button
            onClick={() => setActiveTab("maker")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === "maker"
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            メーカーから探す
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === "popular" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularWithDims.map((model) => (
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
        <MakerSearch makers={makers} models={models} />
      )}
    </div>
  );
}
