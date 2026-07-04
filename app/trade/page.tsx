"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar, Footer } from "@/components/Nav";
import { MarketCard } from "@/components/MarketCard";
import { useLiveMarkets } from "@/lib/useLiveMarkets";
import { SEED_MARKETS, type Market } from "@/lib/markets";
import { META_MARKET, STARTING_BALANCE, fmtUsd, positionCost, positionValue, sideCents, type Position, type Side } from "@/lib/trade";
import { spring } from "@/lib/ui";

const TRADE_SEED: Market[] = [META_MARKET, ...SEED_MARKETS.slice(0, 3)];

let positionId = 1;

export default function Trade() {
  const markets = useLiveMarkets(2000, TRADE_SEED);
  const byId = useMemo(() => Object.fromEntries(markets.map((m) => [m.id, m])), [markets]);

  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [positions, setPositions] = useState<Position[]>([]);
  const [ticket, setTicket] = useState<{ marketId: string; side: Side } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const openValue = positions.reduce((s, p) => s + (p.status === "open" ? positionValue(p, byId[p.marketId]) : 0), 0);
  const totalPL = positions.reduce((s, p) => s + positionValue(p, byId[p.marketId]) - positionCost(p), 0);

  const say = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const place = (marketId: string, side: Side, contracts: number) => {
    const m = byId[marketId];
    if (!m) return;
    const price = sideCents(m, side);
    const cost = contracts * price;
    if (cost > balance) return;
    setPositions((ps) => [
      { id: positionId++, marketId, question: m.question, side, contracts, avgCents: price, status: "open" },
      ...ps,
    ]);
    setBalance((b) => b - cost);
    setTicket(null);
    say(`Filled — ${contracts} ${side.toUpperCase()} @ ${price}¢`);
  };

  const close = (id: number) => {
    setPositions((ps) =>
      ps.map((p) => {
        if (p.id !== id || p.status !== "open") return p;
        const exit = sideCents(byId[p.marketId], p.side);
        setBalance((b) => b + p.contracts * exit);
        say(`Closed at ${exit}¢ — ${fmtUsd(p.contracts * exit - positionCost(p))} P&L`);
        return { ...p, status: "closed", exitCents: exit };
      }),
    );
  };

  const resolve = (id: number) => {
    setPositions((ps) =>
      ps.map((p) => {
        if (p.id !== id || p.status !== "open") return p;
        const m = byId[p.marketId];
        const outcome: Side = p.marketId === "meta" ? "yes" : m.prob >= 0.5 ? "yes" : "no";
        const won = outcome === p.side;
        if (won) setBalance((b) => b + p.contracts * 100);
        say(won ? `Resolved ${outcome.toUpperCase()} — paid ${fmtUsd(p.contracts * 100)} 🎉` : `Resolved ${outcome.toUpperCase()} — better luck next market`);
        return { ...p, status: "resolved", exitCents: won ? 100 : 0, won };
      }),
    );
  };

  return (
    <main>
      <TopBar />

      {/* portfolio strip */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="wrap" style={{ display: "flex", gap: 26, alignItems: "baseline", padding: "13px 26px", flexWrap: "wrap" }}>
          <Stat label="Cash" value={fmtUsd(balance)} />
          <Stat label="In positions" value={fmtUsd(openValue)} />
          <Stat label="Total P&L" value={`${totalPL >= 0 ? "+" : ""}${fmtUsd(totalPL)}`} color={totalPL > 0 ? "var(--green-deep)" : totalPL < 0 ? "var(--red)" : undefined} />
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--faint)" }}>
            Paper trading — the money is fake, the product thinking isn&apos;t.
          </span>
        </div>
      </div>

      <section className="wrap" style={{ paddingTop: 40 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring.soft} style={{ maxWidth: 660 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Trade — a playable demo</div>
          <h1 style={{ fontSize: "clamp(30px, 4.6vw, 44px)" }}>You have $100. Prove you&apos;d hire me.</h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "var(--muted)", marginTop: 14 }}>
            The full loop — pick a side, get a ticket, hold a live position, settle at resolution. One of these markets
            is about this application. It&apos;s trading at 94¢ for a reason.
          </p>
        </motion.div>

        <div className="trade-grid" style={{ marginTop: 30 }}>
          {/* board */}
          <div className="board">
            {markets.map((m) => (
              <MarketCard key={m.id} market={m} onOrder={(side) => setTicket({ marketId: m.id, side })} badge={m.id === "meta" ? "This site" : undefined} />
            ))}
          </div>

          {/* rail */}
          <div className="trade-rail">
            <AnimatePresence mode="wait">
              {ticket ? (
                <Ticket
                  key={`${ticket.marketId}-${ticket.side}`}
                  market={byId[ticket.marketId]}
                  side={ticket.side}
                  balance={balance}
                  onPlace={place}
                  onCancel={() => setTicket(null)}
                />
              ) : (
                <motion.div key="hint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring.soft}
                  style={{ background: "var(--surface)", border: "1px dashed var(--border-strong)", borderRadius: "var(--r-lg)", padding: "18px 20px" }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 8 }}>How this works</div>
                  <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7, color: "var(--muted)" }}>
                    <li>Tap <b style={{ color: "var(--green-deep)" }}>Yes</b> or <b style={{ color: "var(--red)" }}>No</b> on any market.</li>
                    <li>Set your size — the ticket does the cents math.</li>
                    <li>Watch the position breathe, then close it or fast-forward to resolution.</li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>

            {/* toast */}
            <AnimatePresence>
              {toast && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring.snappy}
                  style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: "var(--green-deep)", background: "var(--green-soft)", border: "1px solid var(--green-line)", borderRadius: "var(--r-md)", padding: "10px 14px" }}>
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>

            {/* positions */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 10 }}>
                Positions {positions.length > 0 && `(${positions.length})`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <AnimatePresence initial={false}>
                  {positions.length === 0 && (
                    <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 13.5, color: "var(--faint)" }}>
                      No positions yet. The 94¢ one is right there.
                    </motion.div>
                  )}
                  {positions.map((p) => (
                    <PositionCard key={p.id} p={p} m={byId[p.marketId]} onClose={() => close(p.id)} onResolve={() => resolve(p.id)} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "baseline" }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--faint)" }}>{label}</span>
      <span className="tnum" style={{ fontSize: 17, fontWeight: 800, color: color || "var(--ink)" }}>{value}</span>
    </span>
  );
}

function Ticket({
  market,
  side,
  balance,
  onPlace,
  onCancel,
}: {
  market: Market;
  side: Side;
  balance: number;
  onPlace: (marketId: string, side: Side, contracts: number) => void;
  onCancel: () => void;
}) {
  const [contracts, setContracts] = useState(10);
  const price = sideCents(market, side);
  const maxAffordable = Math.max(1, Math.floor(balance / price));
  const n = Math.min(contracts, maxAffordable);
  const cost = n * price;
  const payout = n * 100;
  const isYes = side === "yes";
  const accent = isYes ? "var(--green-deep)" : "var(--red)";
  const accentSoft = isYes ? "var(--green-soft)" : "var(--red-soft)";
  const accentLine = isYes ? "var(--green-line)" : "rgba(229,72,77,0.32)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={spring.soft}
      style={{ background: "var(--surface)", border: `1px solid ${accentLine}`, borderRadius: "var(--r-lg)", padding: "18px 20px", boxShadow: "var(--shadow)" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, background: accentSoft, border: `1px solid ${accentLine}`, padding: "3px 10px", borderRadius: "var(--r-pill)" }}>
          Buy {side}
        </span>
        <button onClick={onCancel} aria-label="Cancel order" style={{ fontSize: 13, fontWeight: 700, color: "var(--faint)" }}>✕</button>
      </div>

      <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.35, marginTop: 10 }}>{market.question}</div>

      {/* size stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
        <Step onClick={() => setContracts(Math.max(1, n - 5))} label="−5" />
        <div className="tnum" style={{ flex: 1, textAlign: "center", fontSize: 26, fontWeight: 800 }}>
          {n}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--faint)", marginLeft: 6 }}>contracts</span>
        </div>
        <Step onClick={() => setContracts(Math.min(maxAffordable, n + 5))} label="+5" />
      </div>

      {/* math */}
      <div style={{ marginTop: 14, borderTop: "1px dashed var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5 }}>
        <Row k={`Price (live)`} v={`${price}¢`} />
        <Row k="Cost" v={fmtUsd(cost)} />
        <Row k="Payout if right" v={fmtUsd(payout)} strong />
        <Row k="Profit if right" v={`+${fmtUsd(payout - cost)}`} color="var(--green-deep)" />
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={spring.snappy}
        onClick={() => onPlace(market.id, side, n)}
        style={{ width: "100%", marginTop: 14, background: isYes ? "var(--green-deep)" : "var(--red)", color: "#fff", fontSize: 15, fontWeight: 800, padding: "13px 0", borderRadius: "var(--r-md)" }}
      >
        Place order — {fmtUsd(cost)}
      </motion.button>
      <div style={{ fontSize: 11.5, color: "var(--faint)", textAlign: "center", marginTop: 8 }}>
        Price keeps moving while you decide — just like the real thing.
      </div>
    </motion.div>
  );
}

function Step({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick}
      style={{ width: 46, height: 40, borderRadius: "var(--r-md)", border: "1px solid var(--border-strong)", background: "var(--surface-2)", fontSize: 14, fontWeight: 800 }}>
      {label}
    </motion.button>
  );
}

function Row({ k, v, strong, color }: { k: string; v: string; strong?: boolean; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "var(--muted)" }}>{k}</span>
      <span className="tnum" style={{ fontWeight: strong ? 800 : 700, color: color || "var(--ink)" }}>{v}</span>
    </div>
  );
}

function PositionCard({ p, m, onClose, onResolve }: { p: Position; m: Market | undefined; onClose: () => void; onResolve: () => void }) {
  const value = positionValue(p, m);
  const pl = value - positionCost(p);
  const plColor = pl > 0 ? "var(--green-deep)" : pl < 0 ? "var(--red)" : "var(--muted)";
  const sideColor = p.side === "yes" ? "var(--green-deep)" : "var(--red)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={spring.soft}
      style={{ position: "relative", overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "14px 16px", boxShadow: "var(--shadow-soft)" }}
    >
      {p.status === "resolved" && p.won && <Confetti />}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, flex: 1 }}>{p.question}</span>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: sideColor }}>{p.side}</span>
      </div>
      <div className="tnum" style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
        {p.contracts} @ {p.avgCents}¢ · cost {fmtUsd(positionCost(p))}
      </div>

      {p.status === "open" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
            <span className="tnum" style={{ fontSize: 16, fontWeight: 800 }}>{fmtUsd(value)}</span>
            <span className="tnum" style={{ fontSize: 13.5, fontWeight: 800, color: plColor }}>
              {pl >= 0 ? "+" : ""}{fmtUsd(pl)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <SmallBtn onClick={onClose} label="Close at market" />
            <SmallBtn onClick={onResolve} label="⏩ Resolve" primary />
          </div>
        </>
      ) : (
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: p.status === "resolved" ? (p.won ? "var(--green-deep)" : "var(--red)") : "var(--muted)" }}>
          {p.status === "resolved"
            ? p.won
              ? `Resolved ${p.side.toUpperCase()} — paid ${fmtUsd(p.contracts * 100)}`
              : `Resolved against you — ${fmtUsd(0)}`
            : `Closed at ${p.exitCents}¢ — ${pl >= 0 ? "+" : ""}${fmtUsd(pl)}`}
        </div>
      )}
    </motion.div>
  );
}

function SmallBtn({ onClick, label, primary }: { onClick: () => void; label: string; primary?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} whileHover={{ y: -1 }} transition={spring.snappy} onClick={onClick}
      style={{
        flex: 1,
        fontSize: 12.5,
        fontWeight: 800,
        padding: "9px 0",
        borderRadius: "var(--r-md)",
        border: primary ? "1px solid var(--green-line)" : "1px solid var(--border-strong)",
        background: primary ? "var(--green-soft)" : "var(--surface-2)",
        color: primary ? "var(--green-deep)" : "var(--ink)",
      }}>
      {label}
    </motion.button>
  );
}

function Confetti() {
  const bits = Array.from({ length: 22 }, (_, i) => i);
  const colors = ["var(--green)", "var(--green-deep)", "#ffd166", "var(--red)"];
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {bits.map((i) => {
        const angle = (i / bits.length) * Math.PI * 2;
        const dist = 60 + (i % 5) * 26;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.7 + 20, opacity: 0, scale: 0.4, rotate: 200 + i * 30 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
            style={{ position: "absolute", left: "50%", top: "40%", width: 7, height: 10, borderRadius: 2, background: colors[i % colors.length] }}
          />
        );
      })}
    </div>
  );
}
