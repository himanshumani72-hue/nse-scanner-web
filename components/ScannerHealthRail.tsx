"use client";

interface HealthDetail {
  scan_type: string;
  status: "OK" | "OK_EMPTY" | "WARN_EMPTY" | "FAILED";
  rows: number;
  duration_sec: number;
  error?: string;
}

interface HealthRow {
  run_at: string;
  total: number;
  ok: number;
  warn: number;
  failed: number;
  details: Record<string, HealthDetail>;
}

const ICON: Record<string, string> = {
  CHART_PATTERN:      "📈",
  W_PATTERN_15M:      "Ｗ",
  BIG_MOVERS:         "⚡",
  CANNON_MOMENTUM:    "🚀",
  BOOMERANG_REVERSAL: "↩",
  TURNAROUND:         "↺",
  BULK_DEALS:         "🏦",
  BREAKOUT_52W:       "🏔",
  SECTOR_ROTATION:    "🔄",
  BROKER_UPGRADES:    "🎯",
  TWITTER_SPIKE:      "🐦",
  DASHBOARD_MAIN:     "▤",
  PANEL_UPDATER:      "▦",
};

const STATUS_COLOR = {
  OK:         "var(--up)",
  OK_EMPTY:   "var(--ink-3)",
  WARN_EMPTY: "var(--warn)",
  FAILED:     "var(--down)",
};

const STATUS_LABEL = {
  OK:         "✓",
  OK_EMPTY:   "○",
  WARN_EMPTY: "!",
  FAILED:     "✗",
};

export default function ScannerHealthRail({ health }: { health: HealthRow | null }) {
  if (!health || !health.details) {
    return (
      <div>
        <RailHeader />
        <p style={{ fontSize: 12, color: "var(--ink-3)", margin: 0 }}>
          No scan run today yet. Next scheduled scan: 9:20 AM IST.
        </p>
      </div>
    );
  }

  const entries = Object.entries(health.details);
  const allGreen = health.failed === 0 && health.warn === 0;

  return (
    <div>
      <RailHeader />

      {/* Top-line summary */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8, marginBottom: 14,
        padding: "10px 12px",
        background: allGreen ? "rgba(43,208,122,.06)" : health.failed > 0 ? "rgba(255,93,108,.08)" : "rgba(255,176,32,.08)",
        border: `1px solid ${allGreen ? "rgba(43,208,122,.25)" : health.failed > 0 ? "rgba(255,93,108,.3)" : "rgba(255,176,32,.3)"}`,
        borderRadius: 8,
      }}>
        <Stat label="OK" value={health.ok} color="var(--up)" />
        <Stat label="Empty" value={health.warn} color="var(--warn)" />
        <Stat label="Failed" value={health.failed} color="var(--down)" />
      </div>

      {/* Per-scanner status list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map(([name, d]) => {
          const color = STATUS_COLOR[d.status] || "var(--ink-3)";
          return (
            <div key={name}
              title={d.error || `${d.status} · ${d.duration_sec}s`}
              style={{
                display: "grid",
                gridTemplateColumns: "16px 1fr auto auto",
                gap: 8, alignItems: "center",
                padding: "6px 8px",
                background: "var(--bg-2)",
                border: "1px solid var(--line)",
                borderRadius: 6,
                fontSize: 11.5,
              }}>
              <span style={{ fontSize: 12 }}>{ICON[name] || "•"}</span>
              <span style={{ color: "var(--ink-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name.replace(/_/g, " ")}
              </span>
              <span className="num" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>
                {d.rows}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, color,
                width: 16, height: 16, borderRadius: "50%",
                background: `${color}20`, border: `1px solid ${color}50`,
                display: "grid", placeItems: "center",
              }}>
                {STATUS_LABEL[d.status]}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 12, fontSize: 10.5, color: "var(--ink-4)", lineHeight: 1.4 }}>
        Last run: {new Date(health.run_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST · Hover for details
      </p>
    </div>
  );
}

function RailHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
      <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--ink-1)" }}>
        Scanner Health
      </h3>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <span className="num" style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
    </div>
  );
}
