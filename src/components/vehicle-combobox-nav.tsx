"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Car, Star } from "lucide-react";
import { useMyCar } from "@/hooks/use-my-car";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface Vehicle {
  slug: string;
  name: string;
  makerName: string;
}

interface VehicleComboboxNavProps {
  vehicles: Vehicle[];
  basePath: string;
}

export function VehicleComboboxNav({
  vehicles,
  basePath,
}: VehicleComboboxNavProps) {
  const router = useRouter();
  const { myCar } = useMyCar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = vehicles;
    if (search) {
      const q = search.toLowerCase();
      result = vehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.makerName.toLowerCase().includes(q) ||
          `${v.makerName} ${v.name}`.toLowerCase().includes(q)
      );
    }

    // マイカーがあれば先頭に持ってくる（検索していない時）
    if (!search && myCar) {
      const myCarIndex = result.findIndex(v => v.slug === myCar.slug);
      if (myCarIndex !== -1) {
        const found = result[myCarIndex];
        const others = result.filter((_, i) => i !== myCarIndex);
        return [found, ...others].slice(0, 20);
      }
    }

    return result.slice(0, 20);
  }, [vehicles, search, myCar]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
      >
        <Car className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">
          {myCar ? `マイカー: ${myCar.name}` : "車種を選択..."}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="車種名で検索..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>車種が見つかりません</CommandEmpty>
              <CommandGroup>
                {filtered.map((v) => {
                  const isMyCar = myCar?.slug === v.slug;
                  return (
                    <CommandItem
                      key={v.slug}
                      value={v.slug}
                      onSelect={() => {
                        setOpen(false);
                        setSearch("");
                        router.push(`${basePath}/${v.slug}`);
                      }}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">
                        {v.makerName} {v.name}
                      </span>
                      {isMyCar && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                          <Star className="size-3 fill-current" />
                          マイカー
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
