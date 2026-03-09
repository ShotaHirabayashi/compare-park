"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Car, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ParkingLot {
  slug: string;
  name: string;
  address: string | null;
}

interface InstantCheckFormProps {
  vehicles: Vehicle[];
  parkingLots: ParkingLot[];
}

export function InstantCheckForm({
  vehicles,
  parkingLots,
}: InstantCheckFormProps) {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(
    null
  );
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [parkingOpen, setParkingOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [parkingSearch, setParkingSearch] = useState("");

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch) return vehicles.slice(0, 20);
    const q = vehicleSearch.toLowerCase();
    return vehicles
      .filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.makerName.toLowerCase().includes(q) ||
          `${v.makerName} ${v.name}`.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [vehicles, vehicleSearch]);

  const filteredParkingLots = useMemo(() => {
    if (!parkingSearch) return parkingLots.slice(0, 20);
    const q = parkingSearch.toLowerCase();
    return parkingLots
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.address && p.address.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }, [parkingLots, parkingSearch]);

  const handleCheck = () => {
    if (!selectedVehicle) return;
    if (selectedParking) {
      router.push(
        `/check?car=${selectedVehicle.slug}&parking=${selectedParking.slug}`
      );
    } else {
      router.push(`/car/${selectedVehicle.slug}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* 車種選択 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setVehicleOpen(!vehicleOpen);
              setParkingOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
          >
            <Car className="size-4 shrink-0 text-muted-foreground" />
            {selectedVehicle ? (
              <span className="truncate font-medium">
                {selectedVehicle.makerName} {selectedVehicle.name}
              </span>
            ) : (
              <span className="text-muted-foreground">車種を選択</span>
            )}
          </button>
          {vehicleOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="車種名で検索..."
                  value={vehicleSearch}
                  onValueChange={setVehicleSearch}
                />
                <CommandList>
                  <CommandEmpty>車種が見つかりません</CommandEmpty>
                  <CommandGroup>
                    {filteredVehicles.map((v) => (
                      <CommandItem
                        key={v.slug}
                        value={v.slug}
                        onSelect={() => {
                          setSelectedVehicle(v);
                          setVehicleOpen(false);
                          setVehicleSearch("");
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

        {/* 駐車場選択 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setParkingOpen(!parkingOpen);
              setVehicleOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
          >
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            {selectedParking ? (
              <span className="truncate font-medium">
                {selectedParking.name}
              </span>
            ) : (
              <span className="text-muted-foreground">
                駐車場を選択（任意）
              </span>
            )}
          </button>
          {parkingOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="駐車場名・住所で検索..."
                  value={parkingSearch}
                  onValueChange={setParkingSearch}
                />
                <CommandList>
                  <CommandEmpty>駐車場が見つかりません</CommandEmpty>
                  <CommandGroup>
                    {filteredParkingLots.map((p) => (
                      <CommandItem
                        key={p.slug}
                        value={p.slug}
                        onSelect={() => {
                          setSelectedParking(p);
                          setParkingOpen(false);
                          setParkingSearch("");
                        }}
                      >
                        <div className="min-w-0">
                          <p className="truncate">{p.name}</p>
                          {p.address && (
                            <p className="truncate text-xs text-muted-foreground">
                              {p.address}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleCheck}
        disabled={!selectedVehicle}
        className="w-full"
        size="lg"
      >
        <Search className="mr-2 size-4" />
        {selectedVehicle && selectedParking
          ? "判定する"
          : selectedVehicle
            ? "この車種の詳細を見る"
            : "車種を選択してください"}
      </Button>
    </div>
  );
}
