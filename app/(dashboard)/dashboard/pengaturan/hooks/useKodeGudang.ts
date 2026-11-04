'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { useSalinTeks } from '@/hooks/useSalinTeks';

export function useKodeGudang() {
  const [kode, setKode] = useState('');
  const [membuat, setMembuat] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const notif = useNotifikasi();
  const salinan = useSalinTeks(() =>
    notif.tampil('error', 'Gagal menyalin otomatis, salin manual dari kotak kode.'),
  );

  useEffect(() => {
    async function muat() {
      const res = await api<{ kode?: string }>('/gudang/saya');
      if (res.ok) setKode(res.data.kode || '');
    }
    muat();
  }, []);

  async function buatBaru() {
    setMembuat(true);
    const res = await api<{ kode?: string; error?: string }>('/gudang/kode-baru', {
      method: 'POST',
    });
    if (res.sesiHabis) return;

    if (res.ok && res.data.kode) {
      setKode(res.data.kode);
      notif.tampil(
        'sukses',
        `Kode gudang diganti menjadi ${res.data.kode}. Kode lama tidak berlaku lagi.`,
      );
    } else {
      notif.tampil('error', res.data.error || 'Gagal membuat kode baru');
    }
    setMembuat(false);
    setKonfirmasi(false);
  }

  return {
    kode,
    tersalin: salinan.tersalin,
    salin: () => salinan.salin(kode),
    membuat,
    konfirmasi,
    setKonfirmasi,
    buatBaru,
    notif,
  };
}   