import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "トメピタについて | トメピタ",
  description:
    "トメピタは車種の寸法と機械式・立体駐車場の制限サイズを比較し、停められるかどうかを判定するサービスです。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "トメピタ",
          url: "https://www.tomepita.com",
          logo: "https://www.tomepita.com/logo.svg",
        }}
      />
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "トメピタについて" },
        ]}
        currentPath="/about"
      />

      <h1 className="mb-8 text-3xl font-bold">トメピタについて</h1>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="mb-3 text-lg font-semibold">サービス概要</h2>
          <p>
            トメピタは、車種の寸法（全長・全幅・全高・重量）と駐車場の制限サイズを比較し、
            「停められるかどうか」を瞬時に判定するWebサービスです。
          </p>
          <p className="mt-2">
            特に機械式駐車場では寸法制限が厳しく、事前に適合を確認しておくことが重要です。
            トメピタを使えば、車種と駐車場を選ぶだけで、OK・ギリギリ・NGの3段階で判定結果を確認できます。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">データ出典</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>車種データ</strong>: グーネット（goo-net.com）のカタログ情報を基に、
              各車種の全長・全幅・全高・重量などの寸法データを収集・登録しています。
            </li>
            <li>
              <strong>駐車場データ</strong>:
              各駐車場施設の公式情報を基に、制限寸法や料金情報を手動で調査・登録しています。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">免責事項</h2>
          <p>
            本サービスで提供する車種の寸法データおよび駐車場の制限値は、各情報源の公開情報に基づいていますが、
            データの正確性・最新性を完全に保証するものではありません。
          </p>
          <p className="mt-2">
            実際に駐車場をご利用の際は、必ず現地の表示や管理者の案内に従ってください。
            本サービスの判定結果に基づく駐車によって生じた損害について、運営者は一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">対応エリア</h2>
          <p>
            現在は東京23区内の駐車場を中心にデータを登録しています。
            今後、対応エリアを順次拡大していく予定です。
          </p>
        </section>
      </div>
    </div>
  );
}
