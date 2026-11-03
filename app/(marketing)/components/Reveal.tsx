'use client';

import { motion } from 'framer-motion';

// Animasi muncul halus saat elemen masuk layar (dipaksa lewat GPU supaya ringan)
export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="transform-gpu"
    >
      {children}
    </motion.div>
  );
}