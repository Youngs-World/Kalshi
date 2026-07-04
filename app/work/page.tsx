"use client";

import { motion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { spring, LINKS } from "@/lib/ui";

type Study = {
  n: string;
  title: string;
  sub: string;
  href: string;
  cta: string;
  problem: string;
  decisions: string[];
  outcome: string;
};

const STUDIES: Study[] = [
  {
    n: "01",
    title: "Market Pulse",
    sub: "A prediction-market interface study · Next.js · Framer Motion",
    href: LINKS.marketpulse,
    cta: "Live demo ↗",
    problem:
      "Prediction-market UIs drown people in numbers that keep changing. I wanted the price to feel alive without ever feeling anxious — the difference between a market you watch and one you close.",
    decisions: [
      "Prices glide on springs instead of snapping — movement reads as information, not alarm.",
      "Tabular numerals everywhere a digit changes, so nothing shifts or jitters.",
      "One market gets the hero treatment; the rest recede — hierarchy over density.",
      "Green/red carry direction only — never decoration — so color stays trustworthy.",
    ],
    outcome:
      "Built before I ever saw this posting — the prediction-market obsession predates the application. It became my most-clicked portfolio piece.",
  },
  {
    n: "02",
    title: "Sip: Drinks Abroad",
    sub: "Consumer iOS app, shipped to the U.S. App Store · React + Capacitor",
    href: LINKS.sip,
    cta: "App Store ↗",
    problem:
      "Standing at a bar in a country where you can't read the menu is a small, real consumer problem. The product had to work instantly, offline, in loud rooms, one-handed.",
    decisions: [
      "Fully offline-first — the moment of need has no Wi-Fi, so the design assumes none.",
      "A hand-built design system (tokens, type scale, spacing) so 15 locales feel like one product.",
      "Full RTL support designed in from the start, not retrofitted.",
      "Every drink gets a real photo — trust at a glance beats a prettier illustration.",
    ],
    outcome: "Live on the App Store, fully offline, 15 countries — designed, built, and shipped by one person.",
  },
  {
    n: "03",
    title: "FireCode AI",
    sub: "0→1 SaaS for the fire-alarm trade · React · Supabase · Claude",
    href: LINKS.firecode,
    cta: "Visit ↗",
    problem:
      "Fire-alarm designers juggle code books, spec sheets, and CAD plans across a dozen tools. I lived that world for six years — so I designed the product I wished my industry had.",
    decisions: [
      "Customer intuition from the trade itself: features map to real workflows (submittals, takeoffs, RFIs), not imagined ones.",
      "An in-product AI assistant (Claude) designed as a colleague, not a chatbot bolt-on.",
      "Dense-data screens with deliberate hierarchy — contractors scan, they don't read.",
    ],
    outcome: "In production with a first paying customer — scoped, designed, built, and sold by me.",
  },
  {
    n: "04",
    title: "Interactive applications",
    sub: "Résumés as products · four-lens site, streaming chat, this site",
    href: LINKS.anthropic,
    cta: "Four-lens site ↗",
    problem:
      "Applications are the one product where the user (a reviewer) gives you 30 seconds. I treat each one as a consumer product with a single job: make the next click irresistible.",
    decisions: [
      "Each application gets its own designed artifact in the company's visual language — this site is the Kalshi edition.",
      "Motion is choreographed to guide reading order — reveal, settle, then invite interaction.",
      "Every claim links to a live, working thing. Show, don't tell.",
    ],
    outcome: "A four-lens interactive résumé, a real-time streaming chat study (xai-resume.pages.dev), and the site you're reading.",
  },
];

export default function Work() {
  return (
    <main>
      <TopBar />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} style={{ maxWidth: 680 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>01 · Work</div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 50px)" }}>Shipped, not mocked.</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.65, color: "var(--muted)", marginTop: 18 }}>
            Everything below is a real product a stranger can use today. For each: the problem, the design decisions,
            and what shipped. I&apos;m the designer <i>and</i> the person who built it — so nothing here died in handoff.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 44 }}>
          {STUDIES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <article
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-lg)",
                  padding: "26px 28px",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span className="mono tnum" style={{ fontSize: 13, color: "var(--green-deep)", fontWeight: 600 }}>{s.n}</span>
                    <h2 style={{ fontSize: 26 }}>{s.title}</h2>
                  </div>
                  <a href={s.href} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: "var(--green-deep)", whiteSpace: "nowrap" }}>
                    {s.cta}
                  </a>
                </div>
                <div style={{ fontSize: 13, color: "var(--faint)", marginTop: 4, fontWeight: 500 }}>{s.sub}</div>

                <p style={{ fontSize: 15.5, lineHeight: 1.62, color: "var(--ink)", marginTop: 16, maxWidth: 720 }}>{s.problem}</p>

                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 8 }}>
                    Design decisions
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                    {s.decisions.map((d, j) => (
                      <li key={j} style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted)" }}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--green-deep)",
                    background: "var(--green-soft)",
                    border: "1px solid var(--green-line)",
                    padding: "7px 13px",
                    borderRadius: "var(--r-pill)",
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--green)" }} />
                  {s.outcome}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
