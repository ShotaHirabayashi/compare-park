"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <Image src="/logo.svg" alt="トメピタ" width={64} height={64} className="mb-6" />
      <h1 className="mb-2 text-6xl font-bold text-primary">500</h1>
      <h2 className="mb-4 text-xl font-semibold">エラーが発生しました</h2>
      <p className="mb-8 text-muted-foreground">
        ページの読み込み中にエラーが発生しました。時間をおいて再度お試しください。
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          もう一度試す
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
