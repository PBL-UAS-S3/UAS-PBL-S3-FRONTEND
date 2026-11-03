'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { usePagination } from '@/hooks/usePagination';
import type { PO, TabPO } from '../types';
import { nomorPO, totalPO } from '../helpers';

export function usePO() {
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [tab, setTab] = useState<TabPO>('menunggu');
  const [searchText, setSearchText] = useState('');
  const notif = useNotifikasi();

  async function muat() {
    setLoading(true);
    setGalat('');
    const res = await api<PO[]>('/purchase-orders');
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setPos(res.data);
    } else {
      setPos([]);
      setGalat((res.data as any)?.error || 'Gagal memuat data Purchase Order');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function setujui(po: PO) {
    setProsesId(po.id);
    const res = await api<{ stok_baru?: number; error?: string }>(
      `/purchase-orders/${po.id}/selesai`,
      { method: 'PUT' },
    );
    if (res.sesiHabis) return;

    if (res.ok) {
      notif.tampil(
        'sukses',
        `${nomorPO(po)} disetujui. Stok ${po.nama} bertambah ${po.jumlah} menjadi ${res.data.stok_baru}.`,
      );
      await muat();
    } else {
      notif.tampil('error', res.data.error || 'Gagal menyetujui Purchase Order');
    }
    setProsesId(null);
  }

  // Mengembalikan pesan error, atau null kalau berhasil
  async function tolak(po: PO, alasan: string): Promise<string | null> {
    setProsesId(po.id);
    const res = await api<{ error?: string }>(`/purchase-orders/${po.id}/tolak`, {
      method: 'PUT',
      body: { alasan },
    });
    if (res.sesiHabis) return null;
    setProsesId(null);

    if (res.ok) {
      notif.tampil('sukses', `${nomorPO(po)} ditolak. Stok tidak berubah.`);
      await muat();
      return null;
    }
    return res.data.error || 'Gagal menolak Purchase Order';
  }

  const jumlahMenunggu = pos.filter((p) => p.status === 'pending').length;
  const jumlahDitolak = pos.filter((p) => p.status === 'ditolak').length;
  const jumlahSelesai = pos.filter((p) => p.status === 'selesai').length;
  const nilaiBerjalan = pos
    .filter((p) => p.status === 'pending')
    .reduce((total, p) => total + totalPO(p), 0);

  const sesuaiTab = useMemo(() => {
    if (tab === 'menunggu') return pos.filter((p) => p.status === 'pending');
    if (tab === 'ditolak') return pos.filter((p) => p.status === 'ditolak');
    return pos;
  }, [pos, tab]);

  const tersaring = useMemo(() => {
    const q = searchText.toLowerCase();
    if (q === '') return sesuaiTab;
    return sesuaiTab.filter(
      (po) =>
        po.nama.toLowerCase().includes(q) ||
        po.sku.toLowerCase().includes(q) ||
        (po.catatan ?? '').toLowerCase().includes(q),
    );
  }, [sesuaiTab, searchText]);

  const halaman = usePagination(tersaring, 10, `${tab}|${searchText}`);

  return {
    loading,
    galat,
    setGalat,
    muat,
    prosesId,
    notif,
    tab, setTab,
    searchText, setSearchText,
    jumlahMenunggu, jumlahDitolak, jumlahSelesai, nilaiBerjalan,
    jumlahPO: pos.length,
    jumlahSesuaiTab: sesuaiTab.length,
    jumlahTersaring: tersaring.length,
    halaman,
    setujui,
    tolak,
  };
}