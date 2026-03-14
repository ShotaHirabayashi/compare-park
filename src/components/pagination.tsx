import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function pageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  // 表示するページ番号を計算（現在ページ前後2ページ + 先頭/末尾）
  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav aria-label="ページネーション" className="mt-8 flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          className="inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted"
          aria-label="前のページ"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex size-9 items-center justify-center rounded-md border text-sm text-muted-foreground/40">
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground">
            ...
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
            aria-current="page"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            className="inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted"
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          className="inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted"
          aria-label="次のページ"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex size-9 items-center justify-center rounded-md border text-sm text-muted-foreground/40">
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
