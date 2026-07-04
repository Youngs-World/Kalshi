"use client";

import { useEffect, useState } from "react";
import { SEED_MARKETS, tick, type Market } from "./markets";

/** Round-robin live ticks after mount, so updates feel organic. */
export function useLiveMarkets(intervalMs = 2000, seed: Market[] = SEED_MARKETS) {
  const [markets, setMarkets] = useState<Market[]>(seed);

  useEffect(() => {
    let cursor = 0;
    const id = window.setInterval(() => {
      setMarkets((prev) => {
        const next = [...prev];
        const i = cursor % next.length;
        next[i] = tick(next[i]);
        cursor += 1;
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return markets;
}
