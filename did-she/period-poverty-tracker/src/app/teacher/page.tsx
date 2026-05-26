"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Student { id: string; anonymousId: string; grade: string; }

const SCHOOL_ID = "school-001", TEACHER_ID = "teacher-001", SCHOOL_CODE = "SCH-042", ZONE = "Zone-A";

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [attendance, setAttendance] = useState<Record<string, { present: number; absent: number }>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "alert" } | null>(null);

  useEffect(() => {
    setStudents(Array.from({ length: 8 }, (_, i) => ({
      id: `student-${i + 1}`,
      anonymousId: `STU-${(1000 + i).toString(16).toUpperCase()}`,
      grade: `Grade ${Math.floor(i / 2) + 6}`,
    })));
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    setWeekStart(monday.toISOString().split("T")[0]);
  }, []);

  function update(id: string, field: "present" | "absent", val: number) {
    setAttendance(p => ({ ...p, [id]: { present: p[id]?.present ?? 5, absent: p[id]?.absent ?? 0, [field]: val } }));
  }

  async function handleSubmit() {
    if (!weekStart) return;
    setSaving(true); setMessage(null);
    let total = 0;
    for (const s of students) {
      try {
        const r = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: s.id,
            anonymousId: s.anonymousId,
            grade: s.grade,
            schoolId: SCHOOL_ID,
            schoolCode: SCHOOL_CODE,
            zone: ZONE,
            loggedById: TEACHER_ID,
            weekStart,
            daysPresent: attendance[s.id]?.present ?? 5,
            daysAbsent: attendance[s.id]?.absent ?? 0,
          }),
        });
        const d = await r.json(); total += d.alertsDispatched ?? 0;
      } catch (e) {
        console.error(e);
      }
    }
    setSaving(false);
    setMessage(total > 0 ? { text: `${total} cycle alert(s) dispatched to ASHA worker.`, type: "alert" } : { text: "Attendance saved successfully.", type: "success" });
  }

  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>

      {/* Top bar */}
      <div style={{ background: "var(--brand)", padding: "0 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.82rem" }}>← Did-She</Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Teacher Dashboard</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ padding: "3px 10px", borderRadius: "100px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>{SCHOOL_CODE}</span>
            <span style={{ padding: "3px 10px", borderRadius: "100px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>{ZONE}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Instrument Serif'", fontSize: "2rem", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Weekly Attendance Log
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "6px" }}>
            Record attendance for each student. Patterns are analyzed automatically — no manual flagging needed.
          </p>
        </div>

        {/* Privacy banner */}
        <div style={{ background: "var(--brand-pale)", border: "1px solid var(--brand-light)", borderRadius: "12px", padding: "14px 18px", marginBottom: "28px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "1rem", marginTop: "1px" }}>🔒</span>
          <p style={{ fontSize: "0.82rem", color: "var(--brand-mid)", lineHeight: 1.6 }}>
            Student names are never stored. Each student is identified by an anonymous code only. Our algorithm analyzes absence patterns to detect recurring cycles.
          </p>
        </div>

        {/* Week + table side by side on wide, stacked on narrow */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>

          {/* Left: week picker + submit */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                Week Starting
              </label>
              <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "0.875rem", color: "var(--text-primary)", background: "var(--surface-2)", fontFamily: "'Plus Jakarta Sans'" }} />
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "8px" }}>Select the Monday of the attendance week</p>
            </div>

            {message && (
              <div style={{ borderRadius: "12px", padding: "14px 16px", background: message.type === "alert" ? "var(--warning-light)" : "var(--success-light)", border: `1px solid ${message.type === "alert" ? "#FCD34D" : "#86EFAC"}`, color: message.type === "alert" ? "var(--warning)" : "var(--success)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                ✓ {message.text}
              </div>
            )}

            <button onClick={handleSubmit} disabled={saving}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", fontWeight: 700, fontSize: "0.875rem", fontFamily: "'Plus Jakarta Sans'", background: saving ? "var(--border)" : "var(--brand)", color: saving ? "var(--text-muted)" : "white", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Saving..." : "Submit Attendance"}
            </button>
          </div>

          {/* Right: student table */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Students ({students.length})</p>
              <div style={{ display: "flex", gap: "24px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#1B6B3A", letterSpacing: "0.05em", width: "52px", textAlign: "center" }}>PRESENT</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#C0392B", letterSpacing: "0.05em", width: "52px", textAlign: "center" }}>ABSENT</span>
              </div>
            </div>
            {students.map((s, i) => (
              <div key={s.id} style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < students.length - 1 ? "1px solid var(--surface-3)" : "none" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "monospace" }}>{s.anonymousId}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.grade}</p>
                </div>
                <div style={{ display: "flex", gap: "24px" }}>
                  <input type="number" min={0} max={5} value={attendance[s.id]?.present ?? 5}
                    onChange={e => update(s.id, "present", Number(e.target.value))}
                    style={{ width: "52px", textAlign: "center", padding: "8px 4px", border: "1.5px solid #86EFAC", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600, color: "#1B6B3A", background: "#F0FDF4", fontFamily: "'Plus Jakarta Sans'" }} />
                  <input type="number" min={0} max={5} value={attendance[s.id]?.absent ?? 0}
                    onChange={e => update(s.id, "absent", Number(e.target.value))}
                    style={{ width: "52px", textAlign: "center", padding: "8px 4px", border: "1.5px solid #FCA5A5", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600, color: "#C0392B", background: "#FFF5F5", fontFamily: "'Plus Jakarta Sans'" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}