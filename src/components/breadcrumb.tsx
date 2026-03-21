import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPath?: string;
}

const BASE_URL = "https://www.tomepita.com";

export function Breadcrumb({ items, currentPath }: BreadcrumbProps) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const url = item.href
        ? `${BASE_URL}${item.href}`
        : isLast && currentPath
          ? `${BASE_URL}${currentPath}`
          : BASE_URL;
      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name: item.label,
        item: url,
      };
    }),
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <nav aria-label="パンくずリスト" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3 shrink-0" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
