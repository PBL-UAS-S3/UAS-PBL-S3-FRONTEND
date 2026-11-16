'use client';

import { useEffect, useState } from 'react';
import { ambilSesi } from '@/lib/auth';

// Mengecek apakah ada sesi manager yang tersimpan. Dibaca di client setelah mount
// supaya tidak terjadi hydration mismatch.
export function useSudahLogin() {
  const [sudahLogin, setSudahLogin] = useState(false);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    const sesi = ambilSesi();
    setSudahLogin(!!sesi && sesi.role === 'manager');
    setSiap(true);
  }, []);

  return { sudahLogin, siap };
}