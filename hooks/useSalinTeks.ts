'use client';

import { useState } from 'react';

// Menyalin teks ke clipboard, dengan tanda "Tersalin" selama 2 detik
export function useSalinTeks(onGagal?: () => void) {
  const [tersalin, setTersalin] = useState(false);

  async function salin(teks: string) {
    if (!teks) return;
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch (err) {
      onGagal?.();
    }
  }

  return { tersalin, salin };
}