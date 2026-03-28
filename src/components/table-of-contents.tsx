"use client";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 2) return null;

  return (
    <nav className="mb-8 rounded-lg border bg-muted/30 p-4">
      <p className="mb-2 text-sm font-semibold text-foreground">目次</p>
      <ol className="space-y-1 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "ml-4" : ""}
          >
            <a
              href={`#${item.id}`}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** MDXコンテンツ文字列からh2/h3見出しを抽出する */
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
