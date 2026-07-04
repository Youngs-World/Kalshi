"use client";

import { motion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { MarketCard } from "@/components/MarketCard";
import { Sparkline } from "@/components/Sparkline";
import { useLiveMarkets } from "@/lib/useLiveMarkets";
import { SEED_MARKETS, cents, usd, type Market } from "@/lib/markets";
import { spring } from "@/lib/ui";

export default function Range() {
  const markets = useLiveMarkets(2000, [SEED_MARKETS[1]]); // the Fed market, live everywhere below
  const m = markets[0];

  return (
    <main>
      <TopBar />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} style={{ maxWidth: 680 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Range</div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 50px)" }}>One market, five ways.</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.65, color: "var(--muted)", marginTop: 18 }}>
            Taste isn&apos;t one look — it&apos;s knowing which look serves which user. Below, the <b style={{ color: "var(--ink)" }}>same live market</b>{" "}
            (same data, ticking right now) designed five deliberately different ways, with the tradeoffs stated out loud.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 44 }}>
          <Variant n="01" title="The consumer card" note="Friendly, glanceable, tap-first. Hierarchy over density: one number to feel, two buttons to act. This is the site's default — designed for someone's first market, not their thousandth.">
            <div style={{ maxWidth: 460 }}>
              <MarketCard market={m} />
            </div>
          </Variant>

          <Variant n="02" title="The pro terminal row" note="For the trader with forty tabs: maximum density, zero ceremony. Mono numerals, bid/ask spread, keyboard affordance. Delight here isn't charm — it's never making them wait or wonder.">
            <ProRow m={m} />
          </Variant>

          <Variant n="03" title="The glanceable widget" note="Watch-face / home-screen size: one question, one number, one direction. Everything else is deleted — the discipline is deciding what survives at 160 pixels.">
            <Widget m={m} />
          </Variant>

          <Variant n="04" title="The exchange-floor dark" note="Same consumer anatomy, tuned for low light and long sessions: dimmed surfaces, brighter signal color, softer borders. Dark mode isn't inverted colors — it's re-balanced contrast.">
            <DarkCard m={m} />
          </Variant>

          <Variant n="05" title="Accessibility-first" note="High contrast, bigger type, and direction that never relies on color alone — arrows and words carry the signal too. If this version feels 'plain,' good: it's the one everyone can use.">
            <A11yCard m={m} />
          </Variant>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Variant({ n, title, note, children }: { n: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="designer-grid" style={{ borderTop: "1px solid var(--border)", paddingTop: 26 }}>
        <div>
          <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 14 }}>
            <span className="mono tnum" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--green-deep)" }}>{n}</span>
            <h2 style={{ fontSize: 21 }}>{title}</h2>
          </div>
          {children}
        </div>
        <p className="range-note" style={{ fontSize: 14, lineHeight: 1.62, color: "var(--muted)", margin: 0, paddingTop: 6 }}>
          {note}
        </p>
      </div>
    </Reveal>
  );
}

function ProRow({ m }: { m: Market }) {
  const yes = cents(m.prob);
  const bid = Math.max(1, yes - 1);
  const ask = Math.min(99, yes + 1);
  const chg = m.history.length > 1 ? yes - Math.round(m.history[0] * 100) : 0;
  return (
    <div className="mono tnum" style={{ background: "#0c1310", border: "1px solid #1e2b24", borderRadius: 10, padding: "12px 16px", color: "#d7e4dc", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: 13 }}>
      <span style={{ color: "#8fa39a", minWidth: 54 }}>FED-25</span>
      <span style={{ flex: 1, minWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font)" }}>{m.question}</span>
      <span>bid <b style={{ color: "#09c285" }}>{bid}¢</b></span>
      <span>ask <b style={{ color: "#09c285" }}>{ask}¢</b></span>
      <span style={{ color: chg >= 0 ? "#09c285" : "#ff7b84" }}>{chg >= 0 ? "+" : ""}{chg}</span>
      <span style={{ color: "#8fa39a" }}>{usd(m.volume)}</span>
      <span style={{ width: 120 }}><Sparkline data={m.history} color={chg >= 0 ? "#09c285" : "#ff7b84"} height={26} /></span>
      <span style={{ color: "#5d6f66", fontSize: 11.5, border: "1px solid #24332b", borderRadius: 5, padding: "2px 7px" }}>B</span>
      <span style={{ color: "#5d6f66", fontSize: 11.5, border: "1px solid #24332b", borderRadius: 5, padding: "2px 7px" }}>S</span>
    </div>
  );
}

function Widget({ m }: { m: Market }) {
  const yes = cents(m.prob);
  return (
    <div style={{ width: 170, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 22, padding: "16px 18px", boxShadow: "var(--shadow-soft)" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", lineHeight: 1.3 }}>Fed cut in Sept?</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 6 }}>
        <span className="tnum" style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em" }}>{yes}¢</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: m.dir === -1 ? "var(--red)" : "var(--green-deep)" }}>{m.dir === -1 ? "▼" : "▲"}</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <Sparkline data={m.history} color={m.dir === -1 ? "var(--red)" : "var(--green)"} height={24} />
      </div>
    </div>
  );
}

function DarkCard({ m }: { m: Market }) {
  const yes = cents(m.prob);
  return (
    <div style={{ maxWidth: 460, background: "#101815", border: "1px solid #223129", borderRadius: 16, padding: 20, color: "#e8f1ec", boxShadow: "0 24px 54px -30px rgba(0,0,0,0.6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#7f958a" }}>
        <span style={{ border: "1px solid #223129", borderRadius: 999, padding: "3px 9px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{m.category}</span>
        <span className="tnum">{usd(m.volume)} vol</span>
      </div>
      <div style={{ fontSize: 16.5, fontWeight: 700, marginTop: 10, lineHeight: 1.35 }}>{m.question}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginTop: 12 }}>
        <span className="tnum" style={{ fontSize: 32, fontWeight: 800 }}>{yes}<span style={{ fontSize: 16, color: "#7f958a" }}>¢</span></span>
        <span style={{ flex: 1, maxWidth: 150 }}><Sparkline data={m.history} color="#0ee29a" height={36} /></span>
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
        <span style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 10, background: "rgba(14,226,154,0.12)", border: "1px solid rgba(14,226,154,0.4)", color: "#0ee29a", fontWeight: 800, fontSize: 13.5 }} className="tnum">Yes {yes}¢</span>
        <span style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 10, background: "rgba(255,123,132,0.10)", border: "1px solid rgba(255,123,132,0.35)", color: "#ff7b84", fontWeight: 800, fontSize: 13.5 }} className="tnum">No {100 - yes}¢</span>
      </div>
    </div>
  );
}

function A11yCard({ m }: { m: Market }) {
  const yes = cents(m.prob);
  const up = m.dir !== -1;
  return (
    <div style={{ maxWidth: 500, background: "#ffffff", border: "2px solid #101815", borderRadius: 12, padding: 22 }}>
      <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.35, color: "#101815" }}>{m.question}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 12 }}>
        <span className="tnum" style={{ fontSize: 38, fontWeight: 800, color: "#101815" }}>{yes}¢</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#101815" }}>
          {up ? "▲ Trending up" : "▼ Trending down"}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <span style={{ flex: 1, textAlign: "center", padding: "13px 0", borderRadius: 8, background: "#101815", color: "#fff", fontWeight: 800, fontSize: 16 }}>
          Buy YES — {yes}¢
        </span>
        <span style={{ flex: 1, textAlign: "center", padding: "13px 0", borderRadius: 8, background: "#fff", color: "#101815", border: "2px solid #101815", fontWeight: 800, fontSize: 16 }}>
          Buy NO — {100 - yes}¢
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: "#3d443f", marginTop: 12, lineHeight: 1.5 }}>
        Direction is written in words, buttons name their action and price, and every color pairing clears WCAG AA.
      </div>
    </div>
  );
}
