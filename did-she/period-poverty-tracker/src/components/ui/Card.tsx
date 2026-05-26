export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border ${className}`} style={{ borderColor: "var(--border)" }}>
      {children}
    </div>
  );
}