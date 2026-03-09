import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | トメピタ",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">利用規約</h1>
      <p className="mb-6 text-sm text-muted-foreground">最終更新日: 2026年3月9日</p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="mb-3 text-lg font-semibold">第1条（適用）</h2>
          <p>
            本規約は、トメピタ（以下「本サービス」）の利用に関する条件を定めるものです。利用者は本規約に同意した上で本サービスを利用するものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">第2条（サービス内容）</h2>
          <p>
            本サービスは、車種の寸法データと駐車場の制限寸法データを比較し、車両が駐車場に適合するかどうかの目安を提供する情報サービスです。判定結果はあくまで参考情報であり、実際の駐車可否を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">第3条（免責事項）</h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>本サービスが提供する判定結果は、公開されているカタログ値等に基づく参考情報です。実際の車両寸法や駐車場の制限は、グレード・オプション・経年変化等により異なる場合があります。</li>
            <li>本サービスの利用により生じた損害（駐車場での事故・損傷等を含む）について、運営者は一切の責任を負いません。</li>
            <li>本サービスの情報の正確性・完全性・最新性について、運営者は保証しません。</li>
            <li>本サービスは予告なく内容の変更・中断・終了する場合があります。</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">第4条（禁止事項）</h2>
          <p>利用者は以下の行為を行ってはなりません。</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>本サービスのデータを無断で複製・転載・販売する行為</li>
            <li>本サービスに対する不正アクセスやサーバーへの過度な負荷をかける行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>法令または公序良俗に反する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">第5条（知的財産権）</h2>
          <p>
            本サービスに掲載されるコンテンツ（テキスト、画像、データベース等）の知的財産権は運営者または正当な権利者に帰属します。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">第6条（規約の変更）</h2>
          <p>
            運営者は、必要と判断した場合、利用者に通知することなく本規約を変更できるものとします。変更後の規約は本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">第7条（準拠法・管轄）</h2>
          <p>
            本規約の解釈は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>
      </div>
    </div>
  );
}
