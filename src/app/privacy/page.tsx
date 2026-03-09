import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | トメピタ",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>
      <p className="mb-6 text-sm text-muted-foreground">最終更新日: 2026年3月9日</p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="mb-3 text-lg font-semibold">1. はじめに</h2>
          <p>
            トメピタ（以下「本サービス」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、本サービスにおける情報の取扱いについて定めるものです。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">2. 収集する情報</h2>
          <p>本サービスでは、以下の情報を自動的に収集する場合があります。</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時、参照元URL等）</li>
            <li>Cookie およびこれに類する技術を通じた情報</li>
            <li>アクセス解析ツール（Google Analytics等）により収集される利用状況データ</li>
          </ul>
          <p className="mt-2">
            本サービスは会員登録機能を持たないため、氏名・メールアドレス等の個人情報を直接収集することはありません。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">3. 情報の利用目的</h2>
          <p>収集した情報は以下の目的で利用します。</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>本サービスの提供・維持・改善</li>
            <li>利用状況の分析・統計処理</li>
            <li>不正アクセスの検知・防止</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">4. Cookie の利用</h2>
          <p>
            本サービスでは、利用者の利便性向上やアクセス解析のために Cookie を使用する場合があります。利用者はブラウザの設定により Cookie の受け入れを拒否できますが、一部機能が制限される場合があります。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">5. 第三者への提供</h2>
          <p>
            運営者は、法令に基づく場合を除き、利用者の情報を第三者に提供することはありません。ただし、アクセス解析ツール（Google Analytics等）の提供元に対しては、同ツールの利用規約に基づき情報が送信されます。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">6. Google Analytics について</h2>
          <p>
            本サービスでは、Google LLC が提供する Google Analytics を利用してアクセス情報を収集する場合があります。Google Analytics は Cookie を使用してデータを収集しますが、個人を特定する情報は含まれません。詳細は
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              Google のプライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">7. セキュリティ</h2>
          <p>
            運営者は、収集した情報の漏洩・紛失・改ざんを防止するため、適切なセキュリティ対策を講じます。ただし、インターネット上の通信において完全な安全性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">8. ポリシーの変更</h2>
          <p>
            運営者は、必要に応じて本ポリシーを変更する場合があります。変更後のポリシーは本ページに掲載した時点で効力を生じます。
          </p>
        </section>
      </div>
    </div>
  );
}
