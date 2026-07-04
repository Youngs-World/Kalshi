"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { SpringOptions } from "framer-motion";
import { spring } from "@/lib/ui";
import { cents, usd, type Market } from "@/lib/markets";
import { Sparkline } from "./Sparkline";

const priceSpring: SpringOptions = { stiffness: 90, damping: 18, mass: 1 };

/** Big YES price in cents, gliding on a spring. Tabular nums = no jitter. */
export function PriceTicker({ prob, dir, size = 40 }: { prob: number; dir: 1 | -1 | 0; size?: number }) {
  const reduce = useReducedMotion();
  const mv = useSpring(prob, priceSpring);
  useEffect(() => {
    if (reduce) mv.jump(prob);
    else mv.set(prob);
  }, [prob, reduce, mv]);
  const c = useTransform(mv, (v) => `${cents(v)}`);
  const color = dir === 1 ? "var(--green)" : dir === -1 ? "var(--red)" : "var(--faint)";
  const glyph = dir === 1 ? "▲" : dir === -1 ? "▼" : "•";

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <div className="tnum" style={{ fontSize: size, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
        <motion.span>{c}</motion.span>
        <span style={{ fontSize: size * 0.5, fontWeight: 700, color: "var(--muted)" }}>¢</span>
      </div>
      <motion.span
        key={dir}
        initial={reduce ? false : { opacity: 0.4, y: dir === 1 ? 4 : -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.snappy}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          fontWeight: 700,
          color,
          background: dir === 1 ? "var(--green-soft)" : dir === -1 ? "var(--red-soft)" : "transparent",
          padding: "3px 8px",
          borderRadius: "var(--r-pill)",
        }}
      >
        <span style={{ fontSize: 9 }}>{glyph}</span> Yes
      </motion.span>
    </div>
  );
}

export function YesNoButtons({ prob, onOrder }: { prob: number; onOrder?: (side: "yes" | "no") => void }) {
  const yes = cents(prob);
  const no = 100 - yes;
  const base: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "11px 14px",
    borderRadius: "var(--r-md)",
    fontSize: 14,
    fontWeight: 700,
  };
  return (
    <div style={{ display: "flex", gap: 9 }}>
      <motion.button
        whileHover={{ y: -2, boxShadow: "0 12px 26px -14px var(--green)" }}
        whileTap={{ scale: 0.97 }}
        transition={spring.snappy}
        onClick={onOrder ? () => onOrder("yes") : undefined}
        aria-label={`Buy Yes at ${yes} cents`}
        style={{ ...base, color: "var(--green-deep)", background: "var(--green-soft)", border: "1px solid var(--green-line)", cursor: onOrder ? "pointer" : "default" }}
      >
        <span>Yes</span>
        <span className="tnum">{yes}¢</span>
      </motion.button>
      <motion.button
        whileHover={{ y: -2, boxShadow: "0 12px 26px -14px var(--red)" }}
        whileTap={{ scale: 0.97 }}
        transition={spring.snappy}
        onClick={onOrder ? () => onOrder("no") : undefined}
        aria-label={`Buy No at ${no} cents`}
        style={{ ...base, color: "var(--red)", background: "var(--red-soft)", border: "1px solid rgba(229,72,77,0.32)", cursor: onOrder ? "pointer" : "default" }}
      >
        <span>No</span>
        <span className="tnum">{no}¢</span>
      </motion.button>
    </div>
  );
}

export function MarketCard({
  market,
  featured = false,
  onOrder,
  badge,
}: {
  market: Market;
  featured?: boolean;
  onOrder?: (side: "yes" | "no") => void;
  badge?: string;
}) {
  const lineColor = market.dir === -1 ? "var(--red)" : "var(--green)";
  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "var(--shadow)" }}
      transition={spring.snappy}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        padding: featured ? 22 : 18,
        boxShadow: "var(--shadow-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 13,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--muted)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              padding: "3px 9px",
              borderRadius: "var(--r-pill)",
            }}
          >
            {market.category}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--green-deep)",
                background: "var(--green-soft)",
                border: "1px solid var(--green-line)",
                padding: "3px 9px",
                borderRadius: "var(--r-pill)",
              }}
            >
              {badge}
            </span>
          )}
        </span>
        <span className="tnum" style={{ fontSize: 12, color: "var(--faint)", fontWeight: 600 }}>
          {usd(market.volume)} vol
        </span>
      </div>

      <h3 style={{ fontSize: featured ? 19 : 16, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.3 }}>{market.question}</h3>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>
        <PriceTicker prob={market.prob} dir={market.dir} size={featured ? 40 : 30} />
        <div style={{ flex: 1, maxWidth: featured ? 190 : 140 }}>
          <Sparkline data={market.history} color={lineColor} height={featured ? 48 : 38} />
        </div>
      </div>

      <YesNoButtons prob={market.prob} onOrder={onOrder} />
    </motion.article>
  );
}
