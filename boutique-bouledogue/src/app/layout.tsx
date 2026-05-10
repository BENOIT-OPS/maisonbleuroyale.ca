import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import Script from "next/script";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthSessionProvider } from "@/components/session-provider";
import { htmlLangFromHeaderGetter } from "@/lib/seo-metadata";
import { siteConfig } from "@/lib/site";
import "./globals.css";

/** Google Ads — ID balise globale gtag.js. Si Google Ads montre AW-18153273751, remplacez la chaîne ci-dessous. */
const GOOGLE_ADS_ID = "AW-18153273551";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Élevage premium`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  robots: { index: true, follow: true },
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const h = await headers();
  const lang = htmlLangFromHeaderGetter((name) => h.get(name));

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${display.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Google tag (gtag.js) — next/script garantit bon ordre en prod App Router */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
        <AuthSessionProvider>
          {children}
          <Analytics />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
