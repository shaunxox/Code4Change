"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface SupplyRequest {
  id: string;
  zone: string;
  schoolCode: string;
  kitsNeeded: number;
  status: string;
  requestedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export default function PhcDashboard() {
  const [requests, setRequests]   = useState<SupplyRequest[]>([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/supply");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  async function updateStatus(id: string, action: "dispatch" | "deliver") {
    setUpdating(id);
    try {
      await fetch("/api/supply", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id, action }),
      });
      await fetchRequests();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  const queued     = requests.filter((r) => r.status === "QUEUED");
  const dispatched = requests.filter((r) => r.status === "DISPATCHED");
  const delivered  = requests.filter((r) => r.status === "DELIVERED");

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">📦</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">PHC Supply Chain</h1>
              <p className="text-sm text-gray-500">Primary Health Centre · Kit dispatch management</p>
            </div>
          </div>
          <button onClick={fetchRequests} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg">
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-orange-500">{queued.length}</p>
            <p className="text-sm text-gray-500 mt-1">Queued</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-purple-500">{dispatched.length}</p>
            <p className="text-sm text-gray-500 mt-1">Dispatched</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-green-500">{delivered.length}</p>
            <p className="text-sm text-gray-500 mt-1">Delivered</p>
          </Card>
        </div>

        {/* Queued */}
        <div className="space-y-3">
          <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Queued — Needs Dispatch</h2>
          {loading && <p className="text-sm text-gray-400">Loading...</p>}
          {!loading && queued.length === 0 && (
            <Card><p className="text-sm text-gray-400 text-center">No kits queued</p></Card>
          )}
          {queued.map((r) => (
            <Card key={r.id} className="border-l-4 border-l-orange-400">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge status="queued" />
                    <span className="text-xs text-gray-400">{new Date(r.requestedAt).toLocaleDateString("en-IN")}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{r.schoolCode} · {r.zone}</p>
                  <p className="text-xs text-gray-500">{r.kitsNeeded} hygiene kit(s) needed</p>
                </div>
                <button
                  onClick={() => updateStatus(r.id, "dispatch")}
                  disabled={updating === r.id}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {updating === r.id ? "..." : "Mark Dispatched"}
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Dispatched */}
        {dispatched.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Dispatched — In Transit</h2>
            {dispatched.map((r) => (
              <Card key={r.id} className="border-l-4 border-l-purple-400">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge status="dispatched" />
                      <span className="text-xs text-gray-400">
                        Sent {r.dispatchedAt ? new Date(r.dispatchedAt).toLocaleDateString("en-IN") : "—"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{r.schoolCode} · {r.zone}</p>
                  </div>
                  <button
                    onClick={() => updateStatus(r.id, "deliver")}
                    disabled={updating === r.id}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {updating === r.id ? "..." : "Mark Delivered"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delivered */}
        {delivered.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-gray-700 text-sm uppercase tracking-wide">Delivered</h2>
            {delivered.map((r) => (
              <Card key={r.id} className="border-l-4 border-l-green-400 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.schoolCode} · {r.zone}</p>
                    <p className="text-xs text-gray-400">
                      Delivered {r.deliveredAt ? new Date(r.deliveredAt).toLocaleDateString("en-IN") : "—"}
                    </p>
                  </div>
                  <Badge status="delivered" />
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}