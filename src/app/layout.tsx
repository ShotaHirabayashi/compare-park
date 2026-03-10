import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const GA_ID = "G-Z9J1ERR28F";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "トメピタ - 車種×駐車場マッチングサービス",
  description:
    "機械式駐車場に車が入るか即判定。車種サイズと駐車場の制限寸法を比較し、OK・ギリギリ・NGを瞬時に判定。東京23区内の機械式・タワー式駐車場対応。",
  metadataBase: new URL("https://www.tomepita.com"),
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "トメピタ",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "トメピタ",
            url: "https://www.tomepita.com",
            description:
              "あなたの車がその駐車場に停められるか、寸法データで即判定。東京23区内の駐車場と車種のマッチングサービス。",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://www.tomepita.com/search?car={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <Header />
        <main className="min-h-[calc(100dvh-128px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
