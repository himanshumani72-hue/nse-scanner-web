import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NSE Scanner Pro — Real-Time Stock Alerts",
  description: "Get real-time NSE stock alerts — Big Movers, Chart Patterns & W-Pattern signals with position sizing. ₹99/month.",
  keywords: "NSE scanner, stock alerts, India stock market, swing trading, intraday signals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
