// Paper-trading model — all money in cents to keep the math honest.
import type { Market } from "./markets";

export type Side = "yes" | "no";

export type Position = {
  id: number;
  marketId: string;
  question: string;
  side: Side;
  contracts: number;
  /** entry price per contract, cents */
  avgCents: number;
  status: "open" | "closed" | "resolved";
  /** per-contract value at exit (close price, or 0/100 at resolution) */
  exitCents?: number;
  won?: boolean;
};

export const STARTING_BALANCE = 10_000; // $100.00 in cents

/** Current per-side price in cents for a market. */
export const sideCents = (m: Market, side: Side) => {
  const yes = Math.min(99, Math.max(1, Math.round(m.prob * 100)));
  return side === "yes" ? yes : 100 - yes;
};

export const positionCost = (p: Position) => p.contracts * p.avgCents;

/** Mark-to-market value of an open position, cents. */
export const positionValue = (p: Position, m: Market | undefined) => {
  if (p.status !== "open") return (p.exitCents ?? 0) * p.contracts;
  if (!m) return positionCost(p);
  return p.contracts * sideCents(m, p.side);
};

export const fmtUsd = (cents: number) => {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${(abs / 100).toFixed(2)}`;
};

/** The market this whole site exists to move. */
export const META_MARKET: Market = {
  id: "meta",
  question: "Will Kalshi interview Clayton?",
  category: "Meta",
  prob: 0.94,
  volume: 2_119,
  dir: 1,
  history: [0.5, 0.55, 0.62, 0.66, 0.71, 0.75, 0.78, 0.83, 0.86, 0.9, 0.92, 0.94],
};
