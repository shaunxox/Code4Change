"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Student {
  id: string;
  anonymousId: string;
  grade: string;
}

const SCHOOL_ID   = "school-001";
const TEACHER_ID  = "teacher-001";
const SCHOOL_CODE = "SCH-042";
const ZONE        = "Zone-A";

export default function TeacherDashboard() {
  const [students, setStudents]     = useState<Student[]>([]);
  const [weekStart, setWeekStart]   = useState("");
  const [attendance, setAttendance] = useState<Record<string, { present: number; absent: number }>>({});
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState<{ text: string; type: "success" | "alert" } | null>(null);

  useEffect(() => {
    const demo: Student[] = Array.from({ length: 8 }, (_, i) => ({
      id:          `student-${i + 1}`,
      anonymousId: `STU-${(1000 + i).toString(16).toUpperCase()}`,
      grade:       `Grade ${Math.floor(i / 2) + 6}`,
    }));
    setStudents(demo);
    const today  = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    setWeekStart(monday.toISOString().split("T")[0]);
  }, []);

  function update(studentId: string, field: "present" | "absent", value: number) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { present: prev[studentId]?.present ?? 5, absent: prev[studentId]?.absent ?? 0, [field]: value },
    }));
  }

  async function handleSubmit() {
    if (!weekStart) return;
    setSaving(true);
    setMessage(null);
    let alertsTotal = 0;
    for (const s of students) {
      try {
        const res  = await fetch("/api/attendance", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: s.id, schoolId: SCHOOL_ID, loggedById: TEACHER_ID,
            weekStart, daysPresent: attendance[s.id]?.present ?? 5, daysAbsent: attendance[s.id]?.absent ?? 0,
          }),
        });
        const data = await res.json();
        alertsTotal += data.alertsDispatched ?? 0;
      } catch (e) { console.error(e); }
    }
    setSaving(false);
    setMessage(alertsTotal > 0
      ? { text: `${alertsTotal} cycle alert(s) dispatched to ASHA worker.`, type: "alert" }
      : { text: "Attendance saved successfully.", type: "success" }
    );
  }

  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh", padding: "1.5rem" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" style={{ fontSize: "0.8rem", color: "var(--ink-muted)", textDecoration: "none", display: "block", marginBottom: "6px" }}>
              ← Did-She
            </Link>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 300, color: "var(--ink)" }}>
              Attendance Log
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--ink-muted)", marginTop: "2px" }}>
              {SCHOOL_CODE} · {ZONE}
            </p>
          </div>
          <div style={{ background: "var(--terra-light)", borderRadius: "50%", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
            📋
          </div>
        </div>

        {/* Privacy note */}
        <div className="rounded-2xl px-4 py-3 mb-6 flex items-start gap-3"
          style={{ background: "var(--warm-100)", border: "1px solid var(--warm-200)" }}>
          <span style={{ fontSize: "1rem", marginTop: "1px" }}>🔒</span>
          <p style={{ fontSize: "0.8rem", color: "var(--ink-muted)", lineHeight: 1.5 }}>
            Student names are never stored. Absence patterns are analyzed automatically
            to detect recurring cycles and dispatch anonymous alerts.
          </p>
        </div>

        {/* Week picker */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "white", border: "1px solid var(--warm-200)" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--ink-muted)", display: "block", marginBottom: "8px" }}>
            Week starting (Monday)
          </label>
          <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "12px", fontSize: "0.9rem",
              border: "1px solid var(--warm-200)", background: "var(--cream)", color: "var(--ink)",
              outline: "none", fontFamily: "var(--font-body)"
            }} />
        </div>

        {/* Attendance table */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "white", border: "1px solid var(--warm-200)" }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--warm-100)", background: "var(--warm-100)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 400, color: "var(--ink)" }}>
              Students
            </p>
            <div className="flex gap-6">
              <span style={{ fontSize: "0.75rem", color: "var(--sage)", fontWeight: 500, width: "52px", textAlign: "center" }}>Present</span>
              <span style={{ fontSize: "0.75rem", color: "var(--rust)", fontWeight: 500, width: "52px", textAlign: "center" }}>Absent</span>
            </div>
          </div>

          {students.map((s, i) => (
            <div key={s.id} className="flex items-center px-5 py-4 gap-4"
              style={{ borderBottom: i < students.length - 1 ? "1px solid var(--warm-100)" : "none" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--ink)" }}>{s.anonymousId}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{s.grade}</p>
              </div>
              <div className="flex gap-6">
                <input type="number" min={0} max={5}
                  value={attendance[s.id]?.present ?? 5}
                  onChange={(e) => update(s.id, "present", Number(e.target.value))}
                  style={{
                    width: "52px", textAlign: "center", padding: "8px", borderRadius: "10px", fontSize: "0.9rem",
                    border: "1.5px solid var(--sage)", background: "var(--sage-light)", color: "var(--ink)",
                    outline: "none", fontFamily: "var(--font-body)"
                  }} />
                <input type="number" min={0} max={5}
                  value={attendance[s.id]?.absent ?? 0}
                  onChange={(e) => update(s.id, "absent", Number(e.target.value))}
                  style={{
                    width: "52px", textAlign: "center", padding: "8px", borderRadius: "10px", fontSize: "0.9rem",
                    border: "1.5px solid var(--rust)", background: "var(--rust-light)", color: "var(--ink)",
                    outline: "none", fontFamily: "var(--font-body)"
                  }} />
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="rounded-2xl px-5 py-3 mb-4"
            style={{
              background: message.type === "alert" ? "var(--terra-light)" : "var(--sage-light)",
              border: `1px solid ${message.type === "alert" ? "var(--warm-200)" : "var(--warm-200)"}`,
              color: message.type === "alert" ? "var(--terra-dark)" : "var(--sage)",
              fontSize: "0.85rem"
            }}>
            ✓ {message.text}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={saving}
          style={{
            width: "100%", padding: "16px", borderRadius: "16px", fontSize: "0.95rem",
            fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: "0.01em",
            background: saving ? "var(--warm-200)" : "var(--terra)",
            color: saving ? "var(--ink-muted)" : "white",
            border: "none", cursor: saving ? "not-allowed" : "pointer",
            transition: "all 0.15s ease"
          }}>
          {saving ? "Saving attendance..." : "Submit Weekly Attendance"}
        </button>

      </div>
    </main>
  );
}