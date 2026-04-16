import destinationsData from "../../data/destinations.json";

export interface Destination {
  name: string;
  slug: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  official_parking_name: string;
  max_height_mm: number | null;
  max_width_mm: number | null;
  notes: string;
}

export function getAllDestinations(): Destination[] {
  return destinationsData as Destination[];
}

export function getDestinationBySlug(slug: string): Destination | null {
  return (destinationsData as Destination[]).find((d) => d.slug === slug) ?? null;
}

export const categoryLabels: Record<string, string> = {
  department_store: "百貨店",
  complex: "複合施設",
  hotel: "ホテル",
  hospital: "病院",
  airport: "空港",
  station: "駅・ターミナル",
};
