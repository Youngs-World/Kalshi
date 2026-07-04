"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MarketCard } from "./MarketCard";
import type { Market } from "@/lib/markets";
import { spring } from "@/lib/ui";

const CATEGORIES = ["Economics", "Climate", "Politics", "Sports", "Culture", "Meta"];

let customId = 1;

export function DesignMarket({ onPublish }: { onPublish: (m: Market) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Economics");
  const [close, setClose] = useState("");
  const [price, setPrice] = useState(50);
  const [published, setPublished] = useState(false);

  const trimmed = q.trim();
  const qOk = trimmed.length >= 10 && trimmed.length <= 90;
  const qMark = trimmed.endsWith("?");
  const dateOk = close !== "" && new Date(close + "T23:59:59") > new Date();
  const valid = qOk && qMark && dateOk;

  const preview: Market = useMemo(
    () => ({
      id: "preview",
      question: trimmed || "Your question appears here — make it settle-able?",
      category: cat,
      prob: price / 100,
      volume: 1000 + trimmed.length * 37,
      dir: 0,
      history: Array.from({ length: 12 }, (_, i) => price / 100 + Math.sin(i * 1.7) * 0.012),
    }),
    [trimmed, cat, price],
  );

  const publish = () => {
    if (!valid) return;
    onPublish({ ...preview, id: `custom-${customId++}`, question: trimmed });
    setPublished(true);
    setQ("");
    setClose("");
    setPrice(50);
    window.setTimeout(() => setPublished(false), 3600);
  };

  const label: React.CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" };
  const help: React.CSSProperties = { fontSize: 12.5, lineHeight: 1.5, color: "var(--faint)", marginTop: 6 };
  const input: React.CSSProperties = {
    width: "100%",
    marginTop: 8,
    fontSize: 15,
    fontFamily: "inherit",
    color: "var(--ink)",
    background: "var(--surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: "var(--r-md)",
    padding: "11px 13px",
    outline: "none",
  };

  return (
    <div className="designer-grid">
      {/* form */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "22px 24px", boxShadow: "var(--shadow-soft)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label htmlFor="dm-q" style={label}>The question</label>
            <input
              id="dm-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Will it snow in Central Park on Dec 25?"
              maxLength={90}
              style={{ ...input, borderColor: trimmed && !(qOk && qMark) ? "var(--red)" : "var(--border-strong)" }}
            />
            <div style={help}>
              A good market is a question a stranger could settle with a public source — name the who, the what, and the when.
              {trimmed && !qMark && <b style={{ color: "var(--red)" }}> It should end with a “?”.</b>}
              {trimmed && !qOk && <b style={{ color: "var(--red)" }}> Keep it 10–90 characters.</b>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label htmlFor="dm-cat" style={label}>Category</label>
              <select id="dm-cat" value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...input, appearance: "auto" }}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <div style={help}>Where traders would look for it.</div>
            </div>
            <div>
              <label htmlFor="dm-close" style={label}>Closes</label>
              <input id="dm-close" type="date" value={close} onChange={(e) => setClose(e.target.value)} style={input} />
              <div style={help}>{dateOk || close === "" ? "The moment the answer is knowable." : <b style={{ color: "var(--red)" }}>Pick a future date.</b>}</div>
            </div>
          </div>

          <div>
            <label htmlFor="dm-price" style={label}>
              Opening price — <span className="tnum">Yes {price}¢ · No {100 - price}¢</span>
            </label>
            <input id="dm-price" type="range" min={5} max={95} value={price} onChange={(e) => setPrice(Number(e.target.value))} style={{ width: "100%", marginTop: 12, accentColor: "var(--green)" }} />
            <div style={help}>Where would honest money open? Both sides always sum to $1 — that&apos;s the whole game.</div>
          </div>

          <motion.button
            whileHover={valid ? { y: -2 } : undefined}
            whileTap={valid ? { scale: 0.97 } : undefined}
            transition={spring.snappy}
            onClick={publish}
            disabled={!valid}
            style={{
              background: valid ? "var(--green-deep)" : "var(--surface-3)",
              color: valid ? "#fff" : "var(--faint)",
              fontSize: 15,
              fontWeight: 800,
              padding: "13px 0",
              borderRadius: "var(--r-md)",
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            {published ? "Listed ✓ — it's on the board above" : "Publish to the board ↑"}
          </motion.button>
        </div>
      </div>

      {/* live preview */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 10 }}>
          Live preview — this is the review step
        </div>
        <MarketCard market={preview} badge={trimmed ? "Draft" : undefined} />
        <p style={{ fontSize: 12.5, color: "var(--faint)", lineHeight: 1.55, marginTop: 12 }}>
          The preview is the real component, not a mockup — what you publish is exactly what you saw. New listings open
          thin, so yours will sit at your price until traders show up.
        </p>
      </div>
    </div>
  );
}
