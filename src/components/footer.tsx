import Link from "next/link";

const siteLinks = [
  { href: "/#check", label: "駐車場を判定" },
  { href: "/area", label: "エリアから探す" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

const popularWards = [
  { href: "/area/港区", label: "港区" },
  { href: "/area/渋谷区", label: "渋谷区" },
  { href: "/area/新宿区", label: "新宿区" },
  { href: "/area/千代田区", label: "千代田区" },
  { href: "/area/中央区", label: "中央区" },
  { href: "/area/品川区", label: "品川区" },
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* サイト案内 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              サイト案内
            </h3>
            <nav className="flex flex-col gap-2">
              {siteLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 人気エリア */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              人気エリア
            </h3>
            <nav className="flex flex-col gap-2">
              {popularWards.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ブランド */}
          <div>
            <Link href="/" className="text-lg font-bold text-primary">
              トメピタ
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              車種の寸法と駐車場の制限サイズを比較して、停められるかどうかを瞬時に判定。
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} トメピタ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
