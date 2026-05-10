type Tone = "neutral" | "up" | "down" | "warn" | "info" | "violet";
const map: Record<Tone, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: "var(--bg-3)", fg: "var(--ink-1)", bd: "var(--line)" },
  up:      { bg: "var(--up-bg)", fg: "var(--up)", bd: "var(--up-line)" },
  down:    { bg: "var(--down-bg)", fg: "var(--down)", bd: "var(--down-line)" },
  warn:    { bg: "var(--warn-bg)", fg: "var(--warn)", bd: "rgba(243,181,74,.30)" },
  info:    { bg: "rgba(91,140,255,.10)", fg: "var(--accent-2)", bd: "rgba(91,140,255,.30)" },
  violet:  { bg: "rgba(168,123,255,.10)", fg: "var(--violet)", bd: "rgba(168,123,255,.30)" },
};
export default function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  const t = map[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 500, lineHeight: 1.4, color: t.fg, background: t.bg, border: `1px solid ${t.bd}`, letterSpacing: "0.01em" }}>
      {children}
    </span>
  );
}
