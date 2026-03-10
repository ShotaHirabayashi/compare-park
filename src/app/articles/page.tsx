import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { getArticles, ARTICLE_CATEGORIES } from "@/lib/articles";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "コラム | トメピタ",
  description:
    "機械式駐車場のサイズ制限や車種別の駐車場適合ガイドなど、駐車場選びに役立つコラムを掲載しています。",
  alternates: {
    canonical: "https://tomepita.com/articles",
  },
};

export default function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return <ArticlesContent searchParamsPromise={searchParams} />;
}

async function ArticlesContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ category?: string }>;
}) {
  const { category: selectedCategory } = await searchParamsPromise;
  const allArticles = getArticles();

  const filteredArticles = selectedCategory
    ? allArticles.filter((a) => a.frontmatter.category === selectedCategory)
    : allArticles;

  const activeCategories = [
    ...new Set(allArticles.map((a) => a.frontmatter.category)),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "コラム | トメピタ",
          description: "機械式駐車場のサイズ制限や車種別の駐車場適合ガイドなど、駐車場選びに役立つコラムを掲載しています。",
          url: "https://tomepita.com/articles",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: filteredArticles.length,
            itemListElement: filteredArticles.slice(0, 20).map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://tomepita.com/articles/${article.slug}`,
              name: article.frontmatter.title,
            })),
          },
        }}
      />
      <Breadcrumb
        items={[{ label: "トップ", href: "/" }, { label: "コラム" }]}
      />

      <h1 className="mb-8 text-3xl font-bold">コラム</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/articles"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          すべて
        </Link>
        {activeCategories.map((cat) => (
          <Link
            key={cat}
            href={`/articles?category=${cat}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {ARTICLE_CATEGORIES[cat] ?? cat}
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          該当する記事がありません。
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50"
            >
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {ARTICLE_CATEGORIES[article.frontmatter.category] ??
                  article.frontmatter.category}
              </span>
              <h2 className="mb-2 text-lg font-bold leading-snug group-hover:text-primary">
                {article.frontmatter.title}
              </h2>
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                {article.frontmatter.description}
              </p>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {article.frontmatter.date}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
