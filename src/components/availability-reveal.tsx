"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AvailabilityReveal({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, ease: "easeOut" }}>{children}</motion.div>;
}
