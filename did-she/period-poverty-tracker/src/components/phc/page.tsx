"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface SupplyRequest { id: string; zone: string; schoolCode: string; kitsNeeded: number; status: string; requestedAt: string; dispatchedAt?: string; deliveredAt?: string; }

export default function PhcDashboard() {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch("/api/supply"); const d = await r.json(); setRequests(d.requests ?? []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  async function updateStatus(id: string, action: "dispatch" | "deliver") {
    setUpdating(id);
    try { await fetch("/api/supply", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) }); await fetchRequests(); }
    catch (e) { console.error(e); } finally { setUpdating(null); }
  }

  const queued = requests.filter(r => r.status === "QUEUED");
  const dispatched = requests.filter(r => r.status === "DISPATCHED");
  const delivered = requests.filter(r => r.status === "DELIVERED");

  const RequestCard = ({ r, actionLabel, actionKey, accentColor }: { r: SupplyRequest; actionLabel?: string; actionKey?: "dispatch" | "deliver"; accentColor: string }) => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `4px solid ${accentColor}` }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <Badge status={r.status.toLowerCase() as BadgeVariant} />
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            {new Date(r.requestedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", fontFamily: "monospace" }}>{r.schoolCode}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>{r.zone} · {r.kitsNeeded} hygiene kit(s)</p>
      </div>
      {actionLabel && actionKey && (
        <button onClick={() => updateStatus(r.id, actionKey)} disabled={updating === r.id}
          style={{ padding: "10px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", fontFamily: "'Plus Jakarta Sans'", background: updating === r.id ? "var(--border)" : accentColor, color: updating === r.id ? "var(--text-muted)" : "white", border: "none", cursor: updating === r.id ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
          {updating === r.id ? "..." : actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>

      {/* Top bar */}
      <div style={{ background: "var(--brand)", padding: "0 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.82rem" }}>← Did-She</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>PHC Supply Chain</span>
          </div>
          <button onClick={fetchRequests} style={{ padding: "6px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans'" }}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 2rem" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Instrument Serif'", fontSize: "2rem", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Supply Chain Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "6px" }}>
            Primary Health Centre · Hygiene kit dispatch management
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "36px" }}>
          {[
            { label: "Total requests", value: requests.length, color: "var(--text-primary)", bg: "var(--surface)", border: "var(--border)" },
            { label: "Queued", value: queued.length, color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA" },
            { label: "Dispatched", value: dispatched.length, color: "#5B21B6", bg: "#F5F3FF", border: "#DDD6FE" },
            { label: "Delivered", value: delivered.length, color: "var(--success)", bg: "var(--success-light)", border: "#86EFAC" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "14px", padding: "18px 20px" }}>
              <p style={{ fontSize: "1.875rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "6px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>Loading supply requests...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              { label: "Queued — needs dispatch", items: queued, accentColor: "#EA580C", actionLabel: "Mark Dispatched", actionKey: "dispatch" as const },
              { label: "Dispatched — in transit", items: dispatched, accentColor: "#7C3AED", actionLabel: "Mark Delivered", actionKey: "deliver" as const },
              { label: "Delivered", items: delivered, accentColor: "#16A34A" },
            ].map(section => (
              <div key={section.label}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                  {section.label}
                </p>
                {section.items.length === 0 ? (
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Nothing here</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {section.items.map(r => (
                      <RequestCard key={r.id} r={r} accentColor={section.accentColor} actionLabel={section.actionLabel} actionKey={section.actionKey} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}