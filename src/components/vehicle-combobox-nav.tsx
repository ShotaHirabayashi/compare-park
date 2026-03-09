"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Car } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return vehicles.slice(0, 20);
    const q = search.toLowerCase();
    return vehicles
      .filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.makerName.toLowerCase().includes(q) ||
          `${v.makerName} ${v.name}`.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [vehicles, search]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
      >
        <Car className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">車種を選択...</span>
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
                {filtered.map((v) => (
                  <CommandItem
                    key={v.slug}
                    value={v.slug}
                    onSelect={() => {
                      setOpen(false);
                      setSearch("");
                      router.push(`${basePath}/${v.slug}`);
                    }}
                  >
                    <span className="truncate">
                      {v.makerName} {v.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
