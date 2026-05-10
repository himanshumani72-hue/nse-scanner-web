import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        "#0a0f1e",
        card:      "#0f172a",
        border:    "#1e293b",
        muted:     "#334155",
        textmuted: "#64748b",
        bull:      "#22c55e",
        bear:      "#ef4444",
        gold:      "#f59e0b",
        blue:      "#3b82f6",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
