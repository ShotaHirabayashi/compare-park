"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Car } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Vehicle {
  slug: string;
  name: string;
  makerName: string;
}

interface HeaderSearchProps {
  vehicles: Vehicle[];
  className?: string;
}

export function HeaderSearch({ vehicles, className }: HeaderSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // クリック外で閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return vehicles.slice(0, 10);
    const q = search.toLowerCase();
    return vehicles
      .filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.makerName.toLowerCase().includes(q) ||
          `${v.makerName} ${v.name}`.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [vehicles, search]);

  return (
    <div className={cn("relative w-full max-w-[300px]", className)} ref={containerRef}>
      <div 
        className={cn(
          "flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 transition-all focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20",
          open && "bg-background ring-2 ring-primary/20"
        )}
      >
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="車種を検索..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 top-full z-[60] mt-2 w-full min-w-[280px] rounded-xl border bg-popover shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <Command shouldFilter={false} className="rounded-xl">
            <CommandList>
              <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
                車種が見つかりません
              </CommandEmpty>
              <CommandGroup heading="おすすめの車種" className="p-2">
                {filtered.map((v) => (
                  <CommandItem
                    key={v.slug}
                    value={v.slug}
                    onSelect={() => {
                      setOpen(false);
                      setSearch("");
                      router.push(`/car/${v.slug}`);
                    }}
                    className="flex items-center gap-2 rounded-lg p-2"
                  >
                    <Car className="size-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{v.name}</span>
                      <span className="text-[10px] text-muted-foreground">{v.makerName}</span>
                    </div>
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
