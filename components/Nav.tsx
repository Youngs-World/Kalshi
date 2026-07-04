"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Green tick-mark logo — a rising price line in a rounded square. */
export function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="7" fill="var(--green)" />
      <path d="M6.5 17.5 L11 13 L14.5 16 L21.5 9.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21.5" cy="9.5" r="2.1" fill="#fff" />
    </svg>
  );
}

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/craft", label: "Craft" },
  { href: "/markets", label: "Markets" },
  { href: "/resume", label: "Résumé" },
];

export function TopBar() {
  const path = usePathname();
  return (
    <div style={{ borderBottom: "1px solid var(--border)", background: "rgba(247,251,249,0.88)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 20 }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }} aria-label="Home">
          <Mark />
          <span style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "-0.02em" }}>Clayton Young</span>
        </Link>
        <nav style={{ display: "flex", gap: 2 }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`navlink${path === n.href ? " active" : ""}`}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <div style={{ borderTop: "1px solid var(--border)", marginTop: 72 }}>
      <div
        className="wrap"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", padding: "22px 26px", fontSize: 13.5, color: "var(--faint)" }}
      >
        <span>
          Designed &amp; built from scratch for this application — React · Next.js · TypeScript · Framer Motion.{" "}
          <a href="https://github.com/Youngs-World/Kalshi" target="_blank" rel="noreferrer" style={{ color: "var(--green-deep)", fontWeight: 600 }}>
            Source ↗
          </a>
        </span>
        <a href="mailto:claytonryanyoung@gmail.com" style={{ color: "var(--muted)", fontWeight: 600 }}>
          claytonryanyoung@gmail.com
        </a>
      </div>
    </div>
  );
}
