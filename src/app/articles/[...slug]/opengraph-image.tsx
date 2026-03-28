import { ImageResponse } from "next/og";
import { getArticleBySlug, ARTICLE_CATEGORIES } from "@/lib/articles";

export const runtime = "edge";
export const alt = "コラム記事 | トメピタ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const article = getArticleBySlug(slugStr);

  if (!article) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff", fontSize: 48 }}>
        トメピタ
      </div>,
      { ...size }
    );
  }

  const categoryLabel =
    ARTICLE_CATEGORIES[article.frontmatter.category] ?? article.frontmatter.category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1B65A6 100%)",
          padding: "60px",
        }}
      >
        {/* Header: Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50% 50% 50% 0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-45deg)",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#1B65A6", transform: "rotate(45deg)" }}>P</span>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#94a3b8" }}>トメピタ</span>
          <span style={{ fontSize: "20px", color: "#64748b", marginLeft: "8px" }}>コラム</span>
        </div>

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "#1B65A6",
              background: "rgba(255,255,255,0.9)",
              padding: "6px 20px",
              borderRadius: "999px",
              fontWeight: 600,
            }}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Article title */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.3,
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {article.frontmatter.title}
        </div>

        {/* Date */}
        <div style={{ fontSize: "18px", color: "#64748b", marginTop: "24px" }}>
          {article.frontmatter.date}
        </div>
      </div>
    ),
    { ...size }
  );
}
