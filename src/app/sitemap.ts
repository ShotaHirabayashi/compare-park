import type { MetadataRoute } from "next";
import { db } from "@/db";
import { models, parkingLots, makers } from "@/db/schema";
import { TOKYO_WARDS } from "@/lib/constants";

const BASE_URL = "https://tomepita.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [allModels, allLots, allMakers] = await Promise.all([
    db.select({ slug: models.slug }).from(models),
    db.select({ slug: parkingLots.slug }).from(parkingLots),
    db.select({ slug: makers.slug }).from(makers),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/car`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/area`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: "2025-01-01", changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: "2025-01-01", changeFrequency: "yearly", priority: 0.2 },
  ];

  const wardPages: MetadataRoute.Sitemap = TOKYO_WARDS.map((ward) => ({
    url: `${BASE_URL}/area/${encodeURIComponent(ward)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const carPages: MetadataRoute.Sitemap = allModels.map((m) => ({
    url: `${BASE_URL}/car/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const parkingPages: MetadataRoute.Sitemap = allLots.map((l) => ({
    url: `${BASE_URL}/parking/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const makerPages: MetadataRoute.Sitemap = allMakers.map((m) => ({
    url: `${BASE_URL}/maker/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // エリア×車種ページ（ロングテールSEO）
  const areaCarPages: MetadataRoute.Sitemap = TOKYO_WARDS.flatMap((ward) =>
    allModels.map((m) => ({
      url: `${BASE_URL}/area/${encodeURIComponent(ward)}/car/${m.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...wardPages, ...carPages, ...parkingPages, ...makerPages, ...areaCarPages];
}
