"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface Alert { id: string; schoolCode: string; zone: string; grade: string; cycleConfidence: number; detectedAt: string; status: string; resolvedAt?: string; }

const ASHA_ID = "asha-worker-001", ZONE = "Zone-A";

export default function AshaDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch(`/api/alerts?zone=${ZONE}`); const d = await r.json(); setAlerts(d.alerts ?? []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  async function resolveAlert(alertId: string) {
    setResolving(alertId);
    try { await fetch("/api/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alertId, resolvedBy: ASHA_ID }) }); await fetchAlerts(); }
    catch (e) { console.error(e); } finally { setResolving(null); }
  }

  const pending = alerts.filter(a => a.status === "PENDING");
  const resolved = alerts.filter(a => a.status === "RESOLVED");

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>

      {/* Top bar */}
      <div style={{ background: "var(--brand)", padding: "0 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.82rem" }}>← Did-She</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>ASHA Field Dashboard</span>
          </div>
          <button onClick={fetchAlerts} style={{ padding: "6px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans'" }}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 2rem" }}>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Instrument Serif'", fontSize: "2rem", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Field Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "6px" }}>
            {ZONE} · Anonymized alerts only — no student names or personal details.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "36px" }}>
          {[
            { label: "Pending alerts", value: pending.length, color: "#B7791F", bg: "var(--warning-light)", border: "#FCD34D" },
            { label: "Resolved this month", value: resolved.length, color: "var(--success)", bg: "var(--success-light)", border: "#86EFAC" },
            { label: "Total alerts", value: alerts.length, color: "var(--brand)", bg: "var(--brand-pale)", border: "var(--brand-light)" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "16px", padding: "20px 24px" }}>
              <p style={{ fontSize: "2.25rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "6px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending */}
        <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Pending Actions
          </p>
          {pending.length > 0 && <span style={{ fontSize: "0.75rem", color: "var(--warning)", fontWeight: 600 }}>{pending.length} kit(s) needed</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
          {loading && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading alerts...</p>
            </div>
          )}
          {!loading && pending.length === 0 && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "2rem", marginBottom: "12px" }}>✓</p>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>All clear</p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>No pending alerts in {ZONE}</p>
            </div>
          )}
          {pending.map(alert => (
            <div key={alert.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px 24px", borderLeft: "4px solid #D97706" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <Badge status={alert.status.toLowerCase() as BadgeVariant} />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Detected {new Date(alert.detectedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "6px", fontFamily: "monospace" }}>
                    {alert.schoolCode}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    {alert.grade} · {alert.zone}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, maxWidth: "120px", height: "6px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.round(alert.cycleConfidence * 100)}%`, background: "#D97706", borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#B7791F" }}>
                      {Math.round(alert.cycleConfidence * 100)}% cycle confidence
                    </span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "8px", fontStyle: "italic" }}>
                    No student name stored — privacy protected
                  </p>
                </div>
                <button onClick={() => resolveAlert(alert.id)} disabled={resolving === alert.id}
                  style={{ flexShrink: 0, padding: "12px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", fontFamily: "'Plus Jakarta Sans'", background: resolving === alert.id ? "var(--border)" : "var(--brand)", color: resolving === alert.id ? "var(--text-muted)" : "white", border: "none", cursor: resolving === alert.id ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                  {resolving === alert.id ? "Saving..." : "✓ Kit Delivered"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resolved */}
        {resolved.length > 0 && (
          <>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Resolved</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {resolved.map(alert => (
                <div key={alert.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.75 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "monospace" }}>{alert.schoolCode} · {alert.grade}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Resolved {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                  <Badge status="resolved" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}