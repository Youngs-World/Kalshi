"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { MarketCard } from "@/components/MarketCard";
import { useLiveMarkets } from "@/lib/useLiveMarkets";
import { container, item, spring } from "@/lib/ui";

const SECTIONS = [
  {
    href: "/trade",
    n: "01",
    title: "Trade",
    blurb: "A playable demo of the whole loop — $100, an order ticket, live P&L, resolution. One market is about this application.",
    tag: "Play this first",
  },
  {
    href: "/work",
    n: "02",
    title: "Work",
    blurb: "Three shipped products with real users — plus the prediction-market study I built before I ever saw this posting.",
    tag: "Portfolio",
  },
  {
    href: "/craft",
    n: "03",
    title: "Craft",
    blurb: "The details I obsess over, live and pokeable — price motion, tabular numerals, spring physics, states.",
    tag: "Interaction lab",
  },
  {
    href: "/range",
    n: "04",
    title: "Range",
    blurb: "One live market designed five deliberately different ways — with the tradeoffs stated out loud.",
    tag: "Design judgment",
  },
  {
    href: "/markets",
    n: "05",
    title: "Markets",
    blurb: "Why prediction markets have my full attention — plus a flow where you design and list your own.",
    tag: "The passion part",
  },
  {
    href: "/resume",
    n: "06",
    title: "Résumé",
    blurb: "The paper version — one page, plus the PDF for your ATS.",
    tag: "The formal part",
  },
];

export default function Home() {
  const markets = useLiveMarkets();
  const hero = markets[0];

  return (
    <main>
      <TopBar />

      {/* hero */}
      <section className="wrap" style={{ paddingTop: 64, paddingBottom: 10 }}>
        <div className="hero-grid">
          <motion.div initial="hidden" animate="show" variants={container}>
            <motion.div variants={item} className="eyebrow" style={{ marginBottom: 18 }}>
              Product Designer @ Kalshi — an application
            </motion.div>
            <motion.h1 variants={item} style={{ fontSize: "clamp(36px, 5.6vw, 58px)" }}>
              I design delightful product —{" "}
              <span style={{ color: "var(--green-deep)" }}>then I build it myself.</span>
            </motion.h1>
            <motion.p variants={item} style={{ fontSize: 18, lineHeight: 1.65, color: "var(--muted)", marginTop: 22, maxWidth: 540 }}>
              You asked applicants to <b style={{ color: "var(--ink)" }}>show you</b>. This whole site is the answer —
              designed and coded from scratch, in Kalshi&apos;s language, with a live market ticking on the right. Every
              page is a work sample.
            </motion.p>
            <motion.div variants={item} style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <Link href="/trade">
                <motion.span
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring.snappy}
                  style={{ display: "inline-block", background: "var(--green-deep)", color: "#fff", fontSize: 15, fontWeight: 700, padding: "13px 22px", borderRadius: "var(--r-pill)", boxShadow: "var(--shadow-soft)" }}
                >
                  Try the trading demo →
                </motion.span>
              </Link>
              <Link href="/work">
                <motion.span
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring.snappy}
                  style={{ display: "inline-block", background: "var(--surface)", border: "1px solid var(--border-strong)", fontSize: 15, fontWeight: 700, padding: "13px 22px", borderRadius: "var(--r-pill)" }}
                >
                  See the work
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring.soft, delay: 0.25 }}>
            <MarketCard market={hero} featured />
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--faint)", marginTop: 10 }}>
              Live simulation — prices tick, springs glide, numbers never jitter.
            </div>
          </motion.div>
        </div>
      </section>

      {/* sections */}
      <section className="wrap" style={{ paddingTop: 58 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={container} className="cards-2">
          {SECTIONS.map((s) => (
            <motion.div key={s.href} variants={item}>
              <Link href={s.href} style={{ display: "block", height: "100%" }}>
                <motion.article
                  whileHover={{ y: -4, boxShadow: "var(--shadow)" }}
                  transition={spring.snappy}
                  style={{
                    height: "100%",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-lg)",
                    padding: "22px 24px",
                    boxShadow: "var(--shadow-soft)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="mono tnum" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--green-deep)" }}>{s.n}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--faint)" }}>{s.tag}</span>
                  </div>
                  <h2 style={{ fontSize: 24 }}>{s.title}</h2>
                  <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--muted)", flex: 1 }}>{s.blurb}</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green-deep)" }}>Open →</span>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
