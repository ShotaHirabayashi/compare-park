import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "トメピタ - 車種×駐車場マッチングサービス",
  description:
    "あなたの車がその駐車場に停められるか、寸法データで即判定。東京23区内の駐車場と車種のマッチングサービス。",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        <Header />
        <main className="min-h-[calc(100dvh-128px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
