"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface Alert {
  id: string;
  schoolCode: string;
  zone: string;
  grade: string;
  cycleConfidence: number;
  detectedAt: string;
  status: string;
  resolvedAt?: string;
}

const ASHA_ID = "asha-worker-001";
const ZONE    = "Zone-A";

export default function AshaDashboard() {
  const [alerts, setAlerts]     = useState<Alert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/alerts?zone=${ZONE}`);
      const data = await res.json();
      setAlerts(data.alerts ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  async function resolveAlert(alertId: string) {
    setResolving(alertId);
    try {
      await fetch("/api/resolve", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ alertId, resolvedBy: ASHA_ID }),
      });
      await fetchAlerts();
    } catch (e) {
      console.error(e);
    } finally {
      setResolving(null);
    }
  }

  const pending  = alerts.filter((a) => a.status === "PENDING");
  const resolved = alerts.filter((a) => a.status === "RESOLVED");

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg">🏥</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">ASHA Field Dashboard</h1>
              <p className="text-sm text-gray-500">{ZONE} · Anonymized alerts only</p>
            </div>
          </div>
          <button onClick={fetchAlerts} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg">
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-amber-500">{pending.length}</p>
            <p className="text-sm text-gray-500 mt-1">Pending Alerts</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-green-500">{resolved.length}</p>
            <p className="text-sm text-gray-500 mt-1">Kits Delivered</p>
          </Card>
        </div>

        {/* Pending alerts */}
        <div className="space-y-3">
          <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Pending Actions</h2>
          {loading && <p className="text-sm text-gray-400">Loading...</p>}
          {!loading && pending.length === 0 && (
            <Card><p className="text-sm text-gray-400 text-center">No pending alerts — all clear!</p></Card>
          )}
          {pending.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-amber-400">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status={alert.status.toLowerCase() as BadgeVariant} />
                    <span className="text-xs text-gray-400">
                      {new Date(alert.detectedAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {alert.schoolCode} · {alert.grade}
                  </p>
                  <p className="text-xs text-gray-500">
                    Cycle confidence: <span className="font-medium text-amber-600">{Math.round(alert.cycleConfidence * 100)}%</span>
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    No student name stored — privacy protected
                  </p>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  disabled={resolving === alert.id}
                  className="shrink-0 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {resolving === alert.id ? "Saving..." : "Kit Delivered ✓"}
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Resolved */}
        {resolved.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Resolved</h2>
            {resolved.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-green-400 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{alert.schoolCode} · {alert.grade}</p>
                    <p className="text-xs text-gray-400">
                      Resolved {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                  <Badge status="resolved" />
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}