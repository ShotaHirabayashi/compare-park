import type { MetadataRoute } from "next";
import { db } from "@/db";
import { models, parkingLots } from "@/db/schema";
import { TOKYO_WARDS } from "@/lib/constants";

const BASE_URL = "https://tomepita.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allModels, allLots] = await Promise.all([
    db.select({ slug: models.slug }).from(models),
    db.select({ slug: parkingLots.slug }).from(parkingLots),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/area`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/articles`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const wardPages: MetadataRoute.Sitemap = TOKYO_WARDS.map((ward) => ({
    url: `${BASE_URL}/area/${encodeURIComponent(ward)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const carPages: MetadataRoute.Sitemap = allModels.map((m) => ({
    url: `${BASE_URL}/car/${m.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const parkingPages: MetadataRoute.Sitemap = allLots.map((l) => ({
    url: `${BASE_URL}/parking/${l.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...wardPages, ...carPages, ...parkingPages];
}
