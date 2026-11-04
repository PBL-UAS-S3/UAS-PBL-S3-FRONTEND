'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ambilSesi } from '@/lib/auth';

// Menjaga halaman yang butuh login: belum login atau peran tidak cocok, ke /login
export function useAuthGuard(peran = 'manager') {
  const router = useRouter();
  const [sudahDicek, setSudahDicek] = useState(false);
  const [nama, setNama] = useState('');

  useEffect(() => {
    const sesi = ambilSesi();
    if (!sesi || sesi.role !== peran) {
      router.push('/login');
      return;
    }
    setNama(sesi.nama || 'Manager');
    setSudahDicek(true);
  }, [router, peran]);

  return { sudahDicek, nama };
}