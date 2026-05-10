export default function PulseDot({ color = "var(--up)" }: { color?: string }) {
  return (
    <span style={{ position: "relative", width: 8, height: 8, display: "inline-block", flexShrink: 0 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.6, animation: "nse-pulse 1.6s ease-out infinite" }} />
      <span style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
    </span>
  );
}
