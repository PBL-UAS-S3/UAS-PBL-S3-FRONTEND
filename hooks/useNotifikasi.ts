'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { JenisAlert, Notif } from '@/types/ui';

// Notifikasi sementara: sukses hilang sendiri dalam 4 detik, error dalam 7 detik
export function useNotifikasi() {
  const [notif, setNotif] = useState<Notif>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tutup = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setNotif(null);
  }, []);

  const tampil = useCallback((jenis: JenisAlert, pesan: string) => {
    if (timer.current) clearTimeout(timer.current);
    setNotif({ jenis, pesan });
    timer.current = setTimeout(() => setNotif(null), jenis === 'error' ? 7000 : 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { notif, tampil, tutup };
}