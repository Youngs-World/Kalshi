// Motion tokens + shared facts.
import type { Transition } from "framer-motion";

export const spring = {
  soft: { type: "spring", stiffness: 120, damping: 20 } as Transition,
  snappy: { type: "spring", stiffness: 420, damping: 28 } as Transition,
  price: { type: "spring", stiffness: 90, damping: 18, mass: 1 } as Transition,
};

export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: spring.soft },
};

export const LINKS = {
  github: "https://github.com/Youngs-World",
  repo: "https://github.com/Youngs-World/Kalshi",
  sip: "https://apps.apple.com/us/app/sip-drinks-abroad/id6781859543",
  firecode: "https://firecodeai.com/",
  marketpulse: "https://polymarket-resume.pages.dev",
  anthropic: "https://anthropic-resume.pages.dev",
  relay: "https://xai-resume.pages.dev",
  email: "claytonryanyoung@gmail.com",
  resumePdf: "/Clayton-Young-Kalshi-Resume.pdf",
};
