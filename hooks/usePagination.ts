'use client';

import { useEffect, useState } from 'react';

// Memotong daftar menjadi halaman-halaman. Saat resetKey berubah
// (misalnya kata pencarian atau filter berganti), kembali ke halaman 1.
export function usePagination<T>(items: T[], perHalaman = 10, resetKey = '') {
  const [halaman, setHalaman] = useState(1);

  useEffect(() => {
    setHalaman(1);
  }, [resetKey]);

  const totalHalaman = Math.max(1, Math.ceil(items.length / perHalaman));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const dataHalaman = items.slice(
    (halamanAktif - 1) * perHalaman,
    halamanAktif * perHalaman,
  );

  return {
    halamanAktif,
    setHalaman,
    totalHalaman,
    dataHalaman,
    totalData: items.length,
    perHalaman,
  };
}