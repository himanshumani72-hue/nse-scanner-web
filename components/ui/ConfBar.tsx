interface Props { value: number; color?: string; w?: number; }
export default function ConfBar({ value, color = "var(--accent)", w = 88 }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: w, height: 4, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: "var(--ink-2)", minWidth: 22, fontFamily: "var(--mono)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
