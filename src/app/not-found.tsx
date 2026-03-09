import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <Image src="/logo.svg" alt="トメピタ" width={64} height={64} className="mb-6" />
      <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-xl font-semibold">ページが見つかりません</h2>
      <p className="mb-8 text-muted-foreground">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          トップページへ戻る
        </Link>
        <Link
          href="/area"
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          エリアから探す
        </Link>
      </div>
    </div>
  );
}
