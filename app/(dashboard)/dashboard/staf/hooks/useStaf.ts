'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { useSalinTeks } from '@/hooks/useSalinTeks';
import type { AksiStaf, Staf } from '../types';

export function useStaf() {
  const [staf, setStaf] = useState<Staf[]>([]);
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [prosesId, setProsesId] = useState<number | null>(null);
  const notif = useNotifikasi();
  const salinan = useSalinTeks(() =>
    notif.tampil('error', 'Gagal menyalin otomatis, salin manual dari kotak kode.'),
  );

  async function muat() {
    setLoading(true);
    setGalat('');

    const [resStaf, resGudang] = await Promise.all([
      api<Staf[]>('/gudang/staf'),
      api<{ kode?: string }>('/gudang/saya'),
    ]);
    if (resStaf.sesiHabis || resGudang.sesiHabis) return;

    if (resStaf.ok && Array.isArray(resStaf.data)) {
      setStaf(resStaf.data);
    } else {
      setGalat((resStaf.data as any)?.error || 'Gagal memuat daftar staf');
    }

    if (resGudang.ok) setKode(resGudang.data.kode || '');
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function jalankan(s: Staf, endpoint: 'setujui' | 'keluarkan', pesanSukses: string) {
    setProsesId(s.id);
    const res = await api<{ error?: string }>(`/gudang/staf/${s.id}/${endpoint}`, {
      method: 'PUT',
    });
    if (res.sesiHabis) return;

    if (res.ok) {
      notif.tampil('sukses', pesanSukses);
      await muat();
    } else {
      notif.tampil('error', res.data.error || 'Aksi gagal diproses');
    }
    setProsesId(null);
  }

  function setujui(s: Staf) {
    return jalankan(s, 'setujui', `${s.nama} sekarang tergabung di gudang kamu`);
  }

  // Tolak permintaan atau keluarkan staf: di backend keduanya sama (akun tidak dihapus)
  function hapusAkses(s: Staf, aksi: AksiStaf) {
    return jalankan(
      s,
      'keluarkan',
      aksi === 'tolak'
        ? `Permintaan ${s.nama} ditolak`
        : `${s.nama} sudah dikeluarkan dari gudang`,
    );
  }

  const menunggu = useMemo(() => staf.filter((s) => s.status_anggota === 'menunggu'), [staf]);
  const aktif = useMemo(() => staf.filter((s) => s.status_anggota !== 'menunggu'), [staf]);

  return {
    loading,
    galat,
    setGalat,
    muat,
    kode,
    tersalin: salinan.tersalin,
    salinKode: () => salinan.salin(kode),
    prosesId,
    notif,
    menunggu,
    aktif,
    setujui,
    hapusAkses,
  };
}