"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { PriceTicker, YesNoButtons } from "@/components/MarketCard";
import { spring } from "@/lib/ui";

function Panel({ title, why, children }: { title: string; why: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        padding: "20px 22px",
        boxShadow: "var(--shadow-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: "100%",
      }}
    >
      <h3 style={{ fontSize: 17 }}>{title}</h3>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>{children}</div>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted)", margin: 0, borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
        <b style={{ color: "var(--green-deep)" }}>Why:</b> {why}
      </p>
    </div>
  );
}

function PriceDemo() {
  const [prob, setProb] = useState(0.62);
  const [dir, setDir] = useState<1 | -1 | 0>(1);
  const nudge = (d: 1 | -1) => {
    setDir(d);
    setProb((p) => Math.min(0.96, Math.max(0.04, p + d * (0.04 + Math.random() * 0.06))));
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
      <PriceTicker prob={prob} dir={dir} size={44} />
      <div style={{ display: "flex", gap: 8 }}>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => nudge(1)} style={{ fontSize: 13, fontWeight: 700, color: "var(--green-deep)", background: "var(--green-soft)", border: "1px solid var(--green-line)", padding: "8px 14px", borderRadius: "var(--r-pill)" }}>
          Buy pressure
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => nudge(-1)} style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", background: "var(--red-soft)", border: "1px solid rgba(229,72,77,0.32)", padding: "8px 14px", borderRadius: "var(--r-pill)" }}>
          Sell pressure
        </motion.button>
      </div>
    </div>
  );
}

function SpreadDemo() {
  const [prob, setProb] = useState(0.62);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
        <span style={{ color: "var(--green-deep)" }} className="tnum">Yes {Math.round(prob * 100)}¢</span>
        <span style={{ color: "var(--red)" }} className="tnum">No {100 - Math.round(prob * 100)}¢</span>
      </div>
      <div style={{ position: "relative", height: 10, borderRadius: 999, background: "var(--red-soft)", overflow: "hidden" }}>
        <motion.div animate={{ width: `${prob * 100}%` }} transition={spring.price} style={{ position: "absolute", inset: 0, borderRadius: 999, background: "linear-gradient(90deg, var(--green-deep), var(--green))" }} />
      </div>
      <input
        type="range"
        min={4}
        max={96}
        value={Math.round(prob * 100)}
        onChange={(e) => setProb(Number(e.target.value) / 100)}
        aria-label="Yes price"
        style={{ width: "100%", marginTop: 16, accentColor: "var(--green)" }}
      />
    </div>
  );
}

function ButtonDemo() {
  return (
    <div style={{ width: "100%" }}>
      <YesNoButtons prob={0.62} />
    </div>
  );
}

function SpringTiles() {
  const reduce = useReducedMotion();
  const configs = [
    { name: "Price", cfg: { type: "spring", stiffness: 90, damping: 18 } as const },
    { name: "UI", cfg: { type: "spring", stiffness: 420, damping: 28 } as const },
  ];
  const [on, setOn] = useState(false);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      {configs.map((c) => (
        <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 11.5, color: "var(--faint)", width: 40 }}>{c.name}</span>
          <div style={{ flex: 1, height: 30, background: "var(--surface-2)", borderRadius: 999, position: "relative", border: "1px solid var(--border)" }}>
            <motion.span
              animate={{ left: on ? "calc(100% - 26px)" : 4 }}
              transition={reduce ? { duration: 0 } : c.cfg}
              style={{ position: "absolute", top: 3, width: 22, height: 22, borderRadius: 999, background: "var(--green)", display: "block" }}
            />
          </div>
        </div>
      ))}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOn((v) => !v)}
        style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 700, background: "var(--surface-2)", border: "1px solid var(--border-strong)", padding: "8px 14px", borderRadius: "var(--r-pill)" }}
      >
        Run springs
      </motion.button>
    </div>
  );
}

function JitterDemo() {
  const [tabular, setTabular] = useState(true);
  const [n, setN] = useState(61);
  return (
    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
      <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: tabular ? "tabular-nums" : "normal", minWidth: 130 }}>
        {n}
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--muted)" }}>¢</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <motion.button whileTap={{ scale: 0.94 }} onClick={() => setN(Math.floor(Math.random() * 89) + 10)} style={{ fontSize: 13, fontWeight: 700, background: "var(--surface-2)", border: "1px solid var(--border-strong)", padding: "8px 14px", borderRadius: "var(--r-pill)" }}>
          Random price
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setTabular((v) => !v)}
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: tabular ? "var(--green-deep)" : "var(--red)",
            background: tabular ? "var(--green-soft)" : "var(--red-soft)",
            border: `1px solid ${tabular ? "var(--green-line)" : "rgba(229,72,77,0.32)"}`,
            padding: "8px 14px",
            borderRadius: "var(--r-pill)",
          }}
        >
          tabular-nums: {tabular ? "on" : "off"}
        </motion.button>
      </div>
    </div>
  );
}

export default function Craft() {
  return (
    <main>
      <TopBar />
      <section className="wrap" style={{ paddingTop: 56 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} style={{ maxWidth: 660 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>02 · Craft</div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 50px)" }}>The details, live.</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.65, color: "var(--muted)", marginTop: 18 }}>
            Screenshots can&apos;t prove interaction quality, so here&apos;s the real thing. Every panel below is the
            actual component with the actual physics — and the reasoning underneath, because taste without reasons is
            just preference.
          </p>
        </motion.div>

        <div className="cards-2" style={{ marginTop: 40 }}>
          <Reveal>
            <Panel title="Price motion" why="A snapped number reads as an error; a glide reads as movement. The spring is tuned soft enough to feel organic, stiff enough to never lag the data.">
              <PriceDemo />
            </Panel>
          </Reveal>
          <Reveal delay={0.05}>
            <Panel title="Numbers that don't jitter" why="Proportional figures make prices wobble as digits change — it looks broken and feels untrustworthy. Tabular numerals fix a problem most people can only feel, not name.">
              <JitterDemo />
            </Panel>
          </Reveal>
          <Reveal delay={0.05}>
            <Panel title="The Yes/No spread" why="One bar, two truths: Yes and No always sum to 100¢. Drag the price and the complement updates — the interface teaches the market mechanic for free.">
              <SpreadDemo />
            </Panel>
          </Reveal>
          <Reveal delay={0.1}>
            <Panel title="Order buttons" why="Hover lifts and casts a colored shadow — a preview of commitment. Press compresses. Green and red never decorate; they only ever mean direction.">
              <ButtonDemo />
            </Panel>
          </Reveal>
          <Reveal delay={0.1}>
            <Panel title="Two springs, on purpose" why="Data moves on a soft spring (information, not alarm). Controls move on a snappy one (confidence under the finger). One motion system, two intents.">
              <SpringTiles />
            </Panel>
          </Reveal>
          <Reveal delay={0.15}>
            <Panel title="Reduced motion, respected" why="Every animation on this site collapses to an instant state change under prefers-reduced-motion. Accessibility is a design detail, not a checkbox.">
              <div style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.6 }}>
                Turn on <span className="mono" style={{ fontSize: 12.5, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 7px" }}>prefers-reduced-motion</span> in your OS and reload — the site still works, instantly.
              </div>
            </Panel>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}
