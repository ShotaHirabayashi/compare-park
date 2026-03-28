import type { MetadataRoute } from "next";
import { db } from "@/db";
import { like } from "drizzle-orm";
import { models, parkingLots, makers, vehicleRestrictions } from "@/db/schema";
import { TOKYO_WARD_MAP, SIZE_CATEGORIES } from "@/lib/constants";
import { getArticles, ARTICLE_CATEGORIES } from "@/lib/articles";

const BASE_URL = "https://www.tomepita.com";

// sitemap index 用のID一覧を返す
// → /sitemap/0.xml, /sitemap/1.xml, ... として自動生成される
export async function generateSitemaps() {
  return [
    { id: 0 },  // static + area + maker + size
    { id: 1 },  // car pages
    { id: 2 },  // parking pages
    { id: 3 },  // area × car pages
    { id: 4 },  // articles
  ];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // id=0: 静的ページ + エリア + メーカー + サイズ条件
  if (id === 0) {
    const allMakers = await db.select({ slug: makers.slug }).from(makers);

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

    const wardPages: MetadataRoute.Sitemap = TOKYO_WARD_MAP.map((w) => ({
      url: `${BASE_URL}/area/${w.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const makerPages: MetadataRoute.Sitemap = allMakers.map((m) => ({
      url: `${BASE_URL}/maker/${m.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const sizePages: MetadataRoute.Sitemap = [
      { url: `${BASE_URL}/parking/size`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
      ...SIZE_CATEGORIES.map((cat) => ({
        url: `${BASE_URL}/parking/size/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];

    return [...staticPages, ...wardPages, ...makerPages, ...sizePages];
  }

  // id=1: 車種ページ
  if (id === 1) {
    const allModels = await db.select({ slug: models.slug }).from(models);
    return allModels.map((m) => ({
      url: `${BASE_URL}/car/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  // id=2: 駐車場ページ
  if (id === 2) {
    const allLots = await db.select({ slug: parkingLots.slug }).from(parkingLots);
    return allLots.map((l) => ({
      url: `${BASE_URL}/parking/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  // id=3: エリア × 車種ページ（駐車場データがあるエリアのみ）
  if (id === 3) {
    const allModels = await db.select({ slug: models.slug }).from(models);

    const wardsWithParking = new Set<string>();
    for (const w of TOKYO_WARD_MAP) {
      const rows = await db
        .select({ id: vehicleRestrictions.id })
        .from(vehicleRestrictions)
        .innerJoin(parkingLots, like(parkingLots.address, `%${w.name}%`))
        .limit(1);
      if (rows.length > 0) wardsWithParking.add(w.slug);
    }

    return TOKYO_WARD_MAP
      .filter((w) => wardsWithParking.has(w.slug))
      .flatMap((w) =>
        allModels.map((m) => ({
          url: `${BASE_URL}/area/${w.slug}/car/${m.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      );
  }

  // id=4: コラム記事 + カテゴリページ
  if (id === 4) {
    const now = new Date();
    const categoryPages: MetadataRoute.Sitemap = Object.keys(ARTICLE_CATEGORIES).map((cat) => ({
      url: `${BASE_URL}/articles/category/${cat}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const articles = getArticles();
    const articlePages = articles.map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: article.frontmatter.updatedAt
        ? new Date(article.frontmatter.updatedAt)
        : new Date(article.frontmatter.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...categoryPages, ...articlePages];
  }

  return [];
}
