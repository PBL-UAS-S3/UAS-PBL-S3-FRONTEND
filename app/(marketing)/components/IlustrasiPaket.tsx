'use client';

import { motion } from 'framer-motion';

export function IlustrasiPaket({ ukuran = 'lg' }: { ukuran?: 'lg' | 'md' }) {
  const lebar = ukuran === 'lg' ? 'max-w-sm' : 'max-w-xs';
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="will-change-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/paket6.png"
        alt="Ilustrasi Paket Gudang"
        className={`w-full h-auto ${lebar} object-contain drop-shadow-xl`}
      />
    </motion.div>
  );
}