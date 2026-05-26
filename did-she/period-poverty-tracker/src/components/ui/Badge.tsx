export type BadgeVariant = "pending" | "in_progress" | "resolved" | "queued" | "dispatched" | "delivered";

const config: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  pending:     { bg: "#FFFBEB", text: "#B7791F", dot: "#D97706" },
  in_progress: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  resolved:    { bg: "#EDFAF3", text: "#1B6B3A", dot: "#22C55E" },
  queued:      { bg: "#FFF7ED", text: "#C2410C", dot: "#EA580C" },
  dispatched:  { bg: "#F5F3FF", text: "#5B21B6", dot: "#7C3AED" },
  delivered:   { bg: "#EDFAF3", text: "#1B6B3A", dot: "#22C55E" },
};

export function Badge({ status }: { status: BadgeVariant }) {
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {status.replace("_", " ")}
    </span>
  );
}