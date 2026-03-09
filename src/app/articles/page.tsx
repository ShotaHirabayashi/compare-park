import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "記事一覧 | トメピタ",
  description: "駐車場選びや車の寸法に関する記事を掲載予定です。",
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "記事" },
        ]}
      />

      <h1 className="mb-8 text-3xl font-bold">記事</h1>

      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-20">
        <FileText className="mb-4 size-12 text-muted-foreground/50" />
        <p className="mb-2 text-lg font-medium text-muted-foreground">
          記事コンテンツは準備中です
        </p>
        <p className="text-sm text-muted-foreground">
          駐車場選びのコツや車種別の寸法比較など、役立つ記事を順次公開予定です。
        </p>
      </div>
    </div>
  );
}
