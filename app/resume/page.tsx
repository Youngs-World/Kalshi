"use client";

import { motion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { spring, LINKS } from "@/lib/ui";

const MAP = [
  { ask: "1+ years of product design", bring: "2+ years designing and shipping my own products end to end — Sip (App Store), FireCode AI (paying customer), and four interactive application sites." },
  { ask: "A compelling portfolio — show us!", bring: "You're inside it. This site was designed and built for this application; every linked project is live and usable." },
  { ask: "Obsessive over design details", bring: "See the Craft page — spring-tuned price motion, tabular numerals, intent-coded color, reduced-motion support. With the reasoning, not just the polish." },
  { ask: "Customer intuition & consumer sensibility", bring: "Sip was designed for a real consumer moment (a loud bar, no Wi-Fi, one hand). FireCode came from six years inside the industry it serves." },
  { ask: "Move fast in a dynamic environment", bring: "Solo founder speed: this entire site — design system, five pages, live market components — was scoped, designed, and shipped in days." },
  { ask: "Passion for prediction markets", bring: "Built a prediction-market UI study (Market Pulse) before ever seeing this posting. The Markets page explains why this space has my full attention." },
];

export default function Resume() {
  return (
    <main>
      <TopBar />
      <section className="wrap" style={{ paddingTop: 56, maxWidth: 860 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>04 · Résumé</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "clamp(34px, 5vw, 50px)" }}>Clayton Young</h1>
              <p style={{ fontSize: 16.5, color: "var(--muted)", marginTop: 10 }}>
                Product designer who builds · Vacaville, CA → <b style={{ color: "var(--ink)" }}>ready to relocate to NYC</b> · U.S. citizen
              </p>
            </div>
            <motion.a
              href={LINKS.resumePdf}
              download
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.snappy}
              style={{ display: "inline-block", background: "var(--green-deep)", color: "#fff", fontSize: 14.5, fontWeight: 700, padding: "12px 20px", borderRadius: "var(--r-pill)", boxShadow: "var(--shadow-soft)" }}
            >
              Download PDF ↓
            </motion.a>
          </div>
        </motion.div>

        {/* what you asked for ↔ what I bring */}
        <Reveal style={{ marginTop: 40 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-soft)", overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
              What you asked for → what I bring
            </div>
            {MAP.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 0.8fr) 1.6fr", gap: 18, padding: "15px 22px", borderBottom: i < MAP.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green-deep)" }}>{row.ask}</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted)" }}>{row.bring}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* experience */}
        <Reveal style={{ marginTop: 44 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Experience</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                role: "FireCode AI — Founder & Product Designer/Engineer",
                time: "2024 – Present",
                body: "0→1 SaaS for the fire-alarm trade: research from lived industry experience, product design, full build (React, Supabase, Cloudflare, Claude), and a first paying customer.",
              },
              {
                role: "Sip: Drinks Abroad — Founder & Product Designer/Engineer",
                time: "2024 – Present",
                body: "Consumer iOS app on the U.S. App Store: offline-first product design, hand-built design system, 15-locale i18n with full RTL, shipped solo.",
              },
              {
                role: "AVF Systems — Low-Voltage Systems Technician",
                time: "2019 – 2026",
                body: "Six years designing and commissioning security & life-safety systems — reliability-critical work that trained the detail obsession everything above runs on.",
              },
            ].map((e) => (
              <div key={e.role} style={{ borderLeft: "3px solid var(--green-line)", paddingLeft: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "baseline" }}>
                  <h3 style={{ fontSize: 17.5 }}>{e.role}</h3>
                  <span className="tnum" style={{ fontSize: 13, color: "var(--faint)", fontWeight: 600 }}>{e.time}</span>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", marginTop: 6 }}>{e.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* links */}
        <Reveal style={{ marginTop: 44 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { t: "Market Pulse ↗", u: LINKS.marketpulse },
              { t: "Sip on the App Store ↗", u: LINKS.sip },
              { t: "FireCode AI ↗", u: LINKS.firecode },
              { t: "Interactive résumé ↗", u: LINKS.anthropic },
              { t: "GitHub ↗", u: LINKS.github },
            ].map((l) => (
              <a key={l.t} href={l.u} target="_blank" rel="noreferrer" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--muted)", background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "9px 15px", borderRadius: "var(--r-pill)" }}>
                {l.t}
              </a>
            ))}
          </div>
        </Reveal>
      </section>
      <Footer />
    </main>
  );
}
