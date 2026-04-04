import type { MetadataRoute } from "next";
import { db } from "@/db";
import { like } from "drizzle-orm";
import { models, parkingLots, makers, vehicleRestrictions } from "@/db/schema";
import { TOKYO_WARD_MAP, SIZE_CATEGORIES } from "@/lib/constants";
import { getArticles, ARTICLE_CATEGORIES } from "@/lib/articles";

const BASE_URL = "https://www.tomepita.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/car`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/area`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: "2025-01-01", changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: "2025-01-01", changeFrequency: "yearly", priority: 0.2 },
  ];

  // エリアページ
  const wardPages: MetadataRoute.Sitemap = TOKYO_WARD_MAP.map((w) => ({
    url: `${BASE_URL}/area/${w.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // メーカーページ
  const allMakers = await db.select({ slug: makers.slug }).from(makers);
  const makerPages: MetadataRoute.Sitemap = allMakers.map((m) => ({
    url: `${BASE_URL}/maker/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // サイズ条件ページ
  const sizePages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/parking/size`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...SIZE_CATEGORIES.map((cat) => ({
      url: `${BASE_URL}/parking/size/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  // 車種ページ
  const allModels = await db.select({ slug: models.slug }).from(models);
  const carPages: MetadataRoute.Sitemap = allModels.map((m) => ({
    url: `${BASE_URL}/car/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 駐車場ページ
  const allLots = await db.select({ slug: parkingLots.slug }).from(parkingLots);
  const parkingPages: MetadataRoute.Sitemap = allLots.map((l) => ({
    url: `${BASE_URL}/parking/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // エリア × 車種ページ（駐車場データがあるエリアのみ）
  const wardsWithParking = new Set<string>();
  for (const w of TOKYO_WARD_MAP) {
    const rows = await db
      .select({ id: vehicleRestrictions.id })
      .from(vehicleRestrictions)
      .innerJoin(parkingLots, like(parkingLots.address, `%${w.name}%`))
      .limit(1);
    if (rows.length > 0) wardsWithParking.add(w.slug);
  }
  const areaCar: MetadataRoute.Sitemap = TOKYO_WARD_MAP
    .filter((w) => wardsWithParking.has(w.slug))
    .flatMap((w) =>
      allModels.map((m) => ({
        url: `${BASE_URL}/area/${w.slug}/car/${m.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    );

  // コラム記事 + カテゴリページ
  const categoryPages: MetadataRoute.Sitemap = Object.keys(ARTICLE_CATEGORIES).map((cat) => ({
    url: `${BASE_URL}/articles/category/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const articles = getArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: article.frontmatter.updatedAt
      ? new Date(article.frontmatter.updatedAt)
      : new Date(article.frontmatter.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...wardPages,
    ...makerPages,
    ...sizePages,
    ...carPages,
    ...parkingPages,
    ...areaCar,
    ...categoryPages,
    ...articlePages,
  ];
}
