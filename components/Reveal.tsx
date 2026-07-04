"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/ui";

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...spring.soft, delay }}
    >
      {children}
    </motion.div>
  );
}
