import type { TocItem } from "@/components/table-of-contents";

/** MDXコンテンツ文字列からh2/h3見出しを抽出する（サーバーサイド用） */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u3000-\u9fff\u30a0-\u30ff\u3040-\u309f]+/g, "-")
      .replace(/^-+|-+$/g, "");
    items.push({ id, text, level });
  }

  return items;
}
