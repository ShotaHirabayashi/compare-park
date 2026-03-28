import Link from "next/link";
import Image from "next/image";

const siteLinks = [
  { href: "/#check", label: "駐車場を判定" },
  { href: "/area", label: "エリアから探す" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/about", label: "トメピタについて" },
] as const;

const popularWards = [
  { href: "/area/minato", label: "港区" },
  { href: "/area/shibuya", label: "渋谷区" },
  { href: "/area/shinjuku", label: "新宿区" },
  { href: "/area/chiyoda", label: "千代田区" },
  { href: "/area/chuo", label: "中央区" },
  { href: "/area/shinagawa", label: "品川区" },
] as const;

const popularCars = [
  { href: "/car/alphard", label: "アルファード" },
  { href: "/car/harrier", label: "ハリアー" },
  { href: "/car/rav4", label: "RAV4" },
  { href: "/car/n-box", label: "N-BOX" },
  { href: "/car/noah", label: "ノア" },
  { href: "/car/freed", label: "フリード" },
] as const;

const columnLinks = [
  { href: "/articles", label: "コラム一覧" },
  { href: "/articles?category=cars", label: "車種別ガイド" },
  { href: "/articles?category=size-guide", label: "サイズ規格別" },
  { href: "/articles?category=knowledge", label: "知識・ハウツー" },
  { href: "/articles?category=compare", label: "車種比較" },
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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

          {/* 人気車種 */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              人気車種
            </h3>
            <nav className="flex flex-col gap-2">
              {popularCars.map((link) => (
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

          {/* コラム */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              コラム
            </h3>
            <nav className="flex flex-col gap-2">
              {columnLinks.map((link) => (
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
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
              <Image src="/logo.svg" alt="トメピタ" width={28} height={28} />
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
