// Kalshi-style event contracts — YES/NO priced in cents (1–99¢).
// Seed history is deterministic so SSR and first client render match;
// randomness only runs after mount inside useLiveMarkets.

export type Market = {
  id: string;
  question: string;
  category: string;
  /** YES price as probability 0..1 → cents = round(prob*100) */
  prob: number;
  history: number[];
  volume: number;
  dir: 1 | -1 | 0;
};

export const SEED_MARKETS: Market[] = [
  {
    id: "rain",
    question: "Will it rain in NYC tomorrow?",
    category: "Climate",
    prob: 0.63,
    volume: 812_400,
    dir: 1,
    history: [0.48, 0.5, 0.53, 0.51, 0.55, 0.58, 0.56, 0.6, 0.62, 0.61, 0.64, 0.63],
  },
  {
    id: "fed",
    question: "Fed cuts rates at the September meeting?",
    category: "Economics",
    prob: 0.67,
    volume: 4_812_400,
    dir: 1,
    history: [0.52, 0.5, 0.55, 0.58, 0.56, 0.6, 0.63, 0.61, 0.64, 0.66, 0.65, 0.67],
  },
  {
    id: "cpi",
    question: "CPI above 3.0% this month?",
    category: "Economics",
    prob: 0.34,
    volume: 2_140_300,
    dir: -1,
    history: [0.42, 0.44, 0.41, 0.4, 0.42, 0.39, 0.37, 0.38, 0.36, 0.35, 0.36, 0.34],
  },
  {
    id: "temp",
    question: "Highest temperature in LA above 90°F this week?",
    category: "Climate",
    prob: 0.52,
    volume: 977_800,
    dir: 0,
    history: [0.5, 0.49, 0.51, 0.52, 0.5, 0.51, 0.53, 0.52, 0.54, 0.53, 0.52, 0.52],
  },
];

const MAX_HISTORY = 28;
const clamp = (n: number, lo = 0.04, hi = 0.96) => Math.min(hi, Math.max(lo, n));

/** Advance one market by a small mean-reverting random step. Client-only. */
export function tick(m: Market): Market {
  const pull = (0.5 - m.prob) * 0.04;
  const noise = (Math.random() - 0.5) * 0.05;
  const next = clamp(m.prob + pull + noise);
  const delta = next - m.prob;
  const dir: Market["dir"] = Math.abs(delta) < 0.0015 ? 0 : delta > 0 ? 1 : -1;
  return { ...m, prob: next, dir, history: [...m.history, next].slice(-MAX_HISTORY) };
}

export const cents = (p: number) => Math.min(99, Math.max(1, Math.round(p * 100)));

export const usd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
