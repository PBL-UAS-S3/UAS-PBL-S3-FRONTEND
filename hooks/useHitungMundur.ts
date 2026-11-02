'use client';

import { useEffect, useState } from 'react';

// Hitung mundur dalam detik (dipakai untuk jeda "kirim ulang kode")
export function useHitungMundur(awal = 0) {
  const [sisa, setSisa] = useState(awal);

  useEffect(() => {
    if (sisa <= 0) return;
    const t = setTimeout(() => setSisa((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [sisa]);

  return {
    sisa,
    mulai: (detik: number) => setSisa(detik),
    reset: () => setSisa(0),
  };
}