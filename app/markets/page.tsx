"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { MarketCard } from "@/components/MarketCard";
import { DesignMarket } from "@/components/DesignMarket";
import { useLiveMarkets } from "@/lib/useLiveMarkets";
import type { Market } from "@/lib/markets";
import { spring, LINKS } from "@/lib/ui";

const PRINCIPLES = [
  {
    t: "The price is the interface.",
    b: "On an exchange, one number carries the whole story. Everything else — type, motion, color — exists to make that number instantly legible and completely trustworthy.",
  },
  {
    t: "Calm is a feature.",
    b: "Markets move constantly; the UI shouldn't panic with them. Motion that soothes instead of alarms keeps people thinking clearly — which is the whole point of a prediction market.",
  },
  {
    t: "Trust is pixel-deep.",
    b: "In regulated finance, a misaligned digit erodes confidence the same way a wrong balance would. Craft isn't cosmetic here — it's the product's credibility.",
  },
];

export default function Markets() {
  const markets = useLiveMarkets();
  const [custom, setCustom] = useState<Market[]>([]);

  return (
    <main>
      <TopBar />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} style={{ maxWidth: 680 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>03 · Markets</div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 50px)" }}>This part isn&apos;t an act.</h1>
          <div style={{ fontSize: 17, lineHeight: 1.7, color: "var(--muted)", marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0 }}>
              Before I ever saw this posting, I spent my nights building{" "}
              <a href={LINKS.marketpulse} target="_blank" rel="noreferrer" style={{ color: "var(--green-deep)", fontWeight: 700 }}>
                a prediction-market interface
              </a>{" "}
              — for no client, no job, no reason except that markets which trade on <i>what&apos;s true</i> are the most
              interesting product surface I know.
            </p>
            <p style={{ margin: 0 }}>
              A prediction market is a machine that pays people to be honest about the future. That idea has real
              stakes: better forecasts, less punditry, a price on truth. Kalshi made it <b style={{ color: "var(--ink)" }}>legal, regulated, and
              consumer-grade</b> — which is exactly the version of this future I want to help design.
            </p>
            <p style={{ margin: 0 }}>
              Below: a live board in Kalshi&apos;s language — event contracts priced in cents, Yes and No always summing
              to a dollar — built from scratch for this page.
            </p>
          </div>
        </motion.div>

        {/* live board */}
        <Reveal style={{ marginTop: 40 }}>
          <div className="board">
            {custom.map((m) => (
              <MarketCard key={m.id} market={m} badge="Just listed" />
            ))}
            {markets.map((m) => (
              <MarketCard key={m.id} market={m} />
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--faint)", marginTop: 12 }}>
            Simulated prices — the interaction design is the exhibit.
          </div>
        </Reveal>

        {/* design your own */}
        <div style={{ marginTop: 60 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Design a market</div>
            <h2 style={{ fontSize: "clamp(26px, 3.6vw, 34px)", marginBottom: 10 }}>Now you list one.</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--muted)", maxWidth: 620, marginBottom: 26 }}>
              Market design is product design: a good contract is unambiguous, settle-able, and priced where honest
              money would open. Write one — the form teaches the rules as you go, and publishing puts it on the board
              above.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <DesignMarket onPublish={(m) => setCustom((cs) => [m, ...cs])} />
          </Reveal>
        </div>

        {/* principles */}
        <div style={{ marginTop: 56 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 20 }}>How I think about designing for traders</div>
          </Reveal>
          <div className="trio">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "20px 22px", boxShadow: "var(--shadow-soft)", height: "100%" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 10 }}>{p.t}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{p.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
