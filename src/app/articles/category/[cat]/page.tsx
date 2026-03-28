import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import {
  getArticles,
  getArticlesByCategory,
  ARTICLE_CATEGORIES,
} from "@/lib/articles";

const BASE_URL = "https://www.tomepita.com";

export const revalidate = 86400;

interface Props {
  params: Promise<{ cat: string }>;
}

export function generateStaticParams() {
  return Object.keys(ARTICLE_CATEGORIES).map((cat) => ({ cat }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const label = ARTICLE_CATEGORIES[cat];
  if (!label) return {};

  const title = `${label}のコラム一覧 | トメピタ`;
  const description = `${label}に関するコラム記事一覧。機械式・立体駐車場のサイズ制限や車種別の駐車場適合ガイドを掲載。`;

  return {
    title,
    description,
    alternates: { canonical: `/articles/category/${cat}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${BASE_URL}/articles/category/${cat}`,
      siteName: "トメピタ",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;
  const label = ARTICLE_CATEGORIES[cat];
  if (!label) notFound();

  const articles = getArticlesByCategory(cat);
  const allArticles = getArticles();
  const activeCategories = [
    ...new Set(allArticles.map((a) => a.frontmatter.category)),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${label}のコラム一覧 | トメピタ`,
          description: `${label}に関するコラム記事一覧。`,
          url: `${BASE_URL}/articles/category/${cat}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.slice(0, 20).map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${BASE_URL}/articles/${article.slug}`,
              name: article.frontmatter.title,
            })),
          },
        }}
      />
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "コラム", href: "/articles" },
          { label },
        ]}
        currentPath={`/articles/category/${cat}`}
      />

      <h1 className="mb-8 text-3xl font-bold">{label}のコラム</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/articles"
          className="rounded-full px-4 py-1.5 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          すべて
        </Link>
        {activeCategories.map((c) => (
          <Link
            key={c}
            href={`/articles/category/${c}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {ARTICLE_CATEGORIES[c] ?? c}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          該当する記事がありません。
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
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
