import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "NSE Scanner Pro — Real-Time Stock Alerts",
  description: "Get real-time NSE stock alerts — Big Movers, Chart Patterns & W-Pattern signals with position sizing. ₹99/month.",
  keywords: "NSE scanner, stock alerts, India stock market, swing trading, intraday signals",
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
