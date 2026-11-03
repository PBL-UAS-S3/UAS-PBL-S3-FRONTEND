'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function useHubungiKami() {
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [galat, setGalat] = useState('');
  const [sukses, setSukses] = useState('');

  async function kirim() {
    setGalat('');
    setSukses('');

    if (!pesan.trim()) {
      setGalat('Pesan tidak boleh kosong');
      return;
    }

    setLoading(true);
    const res = await api<{ message?: string; error?: string }>('/keluhan', {
      method: 'POST',
      body: { pesan },
    });
    if (res.sesiHabis) return;

    if (res.ok) {
      setSukses(res.data.message || 'Pesan berhasil dikirim');
      setPesan('');
    } else {
      setGalat(res.data.error || 'Gagal mengirim pesan');
    }
    setLoading(false);
  }

  return { pesan, setPesan, loading, galat, setGalat, sukses, setSukses, kirim };
}