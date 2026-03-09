"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOKYO_WARDS } from "@/lib/constants";

interface AreaSearchMiniProps {
  carSlug: string;
}

export function AreaSearchMini({ carSlug }: AreaSearchMiniProps) {
  const router = useRouter();
  const [ward, setWard] = useState("");

  const handleSearch = () => {
    if (ward) {
      router.push(`/area/${ward}/car/${carSlug}`);
    }
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          エリア
        </label>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">区を選択...</option>
          {TOKYO_WARDS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={handleSearch} disabled={!ward} size="default">
        <MapPin className="mr-1.5 size-4" />
        探す
      </Button>
    </div>
  );
}
