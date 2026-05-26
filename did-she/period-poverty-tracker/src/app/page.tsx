import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "var(--brand)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 2rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px" }}>🌸</span>
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: "1.05rem", color: "white", letterSpacing: "-0.01em" }}>
              Did-She
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link href="/teacher" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              Teacher
            </Link>
            <Link href="/asha" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              ASHA Worker
            </Link>
            <Link href="/phc" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.82rem",color: "var(--brand)", textDecoration: "none", background: "var(--accent)", fontWeight: 500 }}>
              PHC Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "var(--brand)", paddingTop: "80px", paddingBottom: "96px" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ maxWidth: "640px" }}>
            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "100px", background: "rgba(233,196,106,0.2)", color: "var(--accent)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
              Period Poverty Response System
            </span>
            <h1 className="serif" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 400, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "24px" }}>
              Every girl deserves<br />
              <em>to stay in school.</em>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: "40px", maxWidth: "520px" }}>
              Did-She uses privacy-first attendance analysis to detect recurring absence cycles — automatically connecting students in need with ASHA workers and hygiene kits, without ever storing a name.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/teacher" style={{ padding: "14px 28px", borderRadius: "10px", background: "var(--accent)", color: "var(--brand)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", letterSpacing: "-0.01em" }}>
                Log Attendance →
              </Link>
              <Link href="/asha" style={{ padding: "14px 28px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", color: "white", fontWeight: 500, fontSize: "0.9rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
                View Alerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "var(--brand-mid)", padding: "0" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { value: "~225M", label: "Girls miss school due to menstruation annually" },
            { value: "1 in 5", label: "Girls drop out after first menstrual period" },
            { value: "100%", label: "Of alerts are anonymized — zero PII stored" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "28px 0", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>{s.value}</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 2rem" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--brand-mid)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>How it works</p>
            <h2 className="serif" style={{ fontSize: "2.25rem", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Three roles. One seamless pipeline.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                num: "01", role: "Teacher", icon: "📋",
                color: "var(--brand-pale)", accent: "var(--brand)",
                title: "Log weekly attendance",
                desc: "Teachers record days present and absent for each student using anonymous IDs — no names, no PII. Takes under 2 minutes per week.",
                href: "/teacher", cta: "Open Teacher Dashboard",
              },
              {
                num: "02", role: "ASHA Worker", icon: "🏥",
                color: "#F0FAF8", accent: "#0F6E56",
                title: "Receive anonymized alerts",
                desc: "When our algorithm detects a recurring ~28-day absence pattern, the ASHA worker in that zone receives an anonymized alert with school code, grade, and confidence score.",
                href: "/asha", cta: "Open ASHA Dashboard",
              },
              {
                num: "03", role: "PHC Admin", icon: "📦",
                color: "#FFFBF0", accent: "#B7791F",
                title: "Auto-dispatch hygiene kits",
                desc: "When an ASHA worker confirms kit delivery, the PHC supply chain is automatically triggered — ensuring physical resources reach exactly where they're needed.",
                href: "/phc", cta: "Open PHC Dashboard",
              },
            ].map((card) => (
              <div key={card.num} style={{ background: card.color, borderRadius: "20px", padding: "32px", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: card.accent, letterSpacing: "0.06em" }}>
                    {card.num} · {card.role}
                  </span>
                  <span style={{ fontSize: "1.5rem" }}>{card.icon}</span>
                </div>
                <h3 style={{ fontFamily: "'Instrument Serif'", fontSize: "1.35rem", fontWeight: 400, color: "var(--text-primary)", marginBottom: "12px", lineHeight: 1.3 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, flex: 1, marginBottom: "24px" }}>
                  {card.desc}
                </p>
                <Link href={card.href} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 600, color: card.accent, textDecoration: "none" }}>
                  {card.cta} <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section style={{ background: "var(--brand)", padding: "64px 2rem" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Privacy by design</p>
            <h2 className="serif" style={{ fontSize: "2rem", fontWeight: 400, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "20px" }}>
              No names. Ever.
            </h2>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
              Students are identified only by anonymous codes like STU-3F8A. ASHA workers receive only school code, grade, and zone — never a name. The algorithm detects patterns, not people.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "🔒", text: "Zero personally identifiable information stored" },
              { icon: "📊", text: "Pattern detection without individual profiling" },
              { icon: "🔁", text: "Automatic supply chain — no manual data entry" },
              { icon: "🌍", text: "Designed for India's ASHA network infrastructure" },
            ].map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "1.25rem" }}>{f.icon}</span>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 2rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1rem" }}>🌸</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Did-She</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Built for Code4Change · All student data anonymized
          </p>
        </div>
      </footer>

    </div>
  );
}