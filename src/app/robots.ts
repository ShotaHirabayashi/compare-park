import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowWithRestrictions = {
    allow: "/",
    disallow: ["/check", "/api/"],
  };

  return {
    rules: [
      // デフォルト: 全クローラー許可
      { userAgent: "*", ...allowWithRestrictions },
      // AI検索クローラー: 許可
      { userAgent: "GPTBot", ...allowWithRestrictions },
      { userAgent: "OAI-SearchBot", ...allowWithRestrictions },
      { userAgent: "ChatGPT-User", ...allowWithRestrictions },
      { userAgent: "ClaudeBot", ...allowWithRestrictions },
      { userAgent: "anthropic-ai", ...allowWithRestrictions },
      { userAgent: "PerplexityBot", ...allowWithRestrictions },
      { userAgent: "Google-Extended", ...allowWithRestrictions },
      // トレーニング用・不要クローラー: ブロック
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "cohere-ai", disallow: "/" },
    ],
    sitemap: [
      "https://www.tomepita.com/sitemap.xml",
      "https://www.tomepita.com/llms.txt",
    ],
  };
}
