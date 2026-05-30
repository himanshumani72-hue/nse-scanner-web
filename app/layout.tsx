import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const SITE_URL = "https://nse-scanner-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NSE Scanner Pro — 12 NSE pattern scanners in one dashboard",
  description:
    "12 independent scanners run on 500+ NSE stocks every trading day. Cross-validation surfaces only high-conviction setups with stop loss & target. ₹99/month, 10-day free trial.",
  keywords: [
    "NSE scanner", "stock pattern scanner India", "swing trading India",
    "Indian stock market alerts", "52 week high breakout", "bulk deals tracker",
    "stock screener India", "NSE pattern detection",
  ],
  authors: [{ name: "NSE Scanner Pro" }],
  openGraph: {
    title: "NSE Scanner Pro — Pattern detection for Indian stocks",
    description:
      "12 scanners. One dashboard. Cross-validation surfaces only high-conviction NSE setups with stop loss & target. ₹99/month, 10-day free trial.",
    url: SITE_URL,
    siteName: "NSE Scanner Pro",
    locale: "en_IN",
    type: "website",
    images: [{
      url: `${SITE_URL}/opengraph-image`,
      width:  1200,
      height: 630,
      alt: "NSE Scanner Pro dashboard preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NSE Scanner Pro — 12 NSE pattern scanners",
    description:
      "Cross-validated NSE setups with stop loss & target. ₹99/month, 10-day free trial.",
    images: [`${SITE_URL}/twitter-image`],
  },
  robots: { index: true, follow: true },
};

// Tiny inline script — runs before paint to apply the user's saved theme
// (prevents a "flash of dark" on light-preferring users on first load)
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
