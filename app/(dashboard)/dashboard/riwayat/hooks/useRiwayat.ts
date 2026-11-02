'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { usePagination } from '@/hooks/usePagination';
import type { Transaksi } from '@/types/transaksi';

export function useRiwayat() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');

  const [searchText, setSearchText] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');

  async function muat() {
    setLoading(true);
    setGalat('');

    const res = await api<Transaksi[]>('/transactions/recent');
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setTransaksi(res.data);
    } else {
      setGalat((res.data as any)?.error || 'Gagal memuat riwayat transaksi');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  const daftarStaf = useMemo(
    () => Array.from(new Set(transaksi.map((t) => t.nama_staf))),
    [transaksi],
  );

  const tersaring = useMemo(() => {
    const q = searchText.toLowerCase();
    return transaksi.filter((t) => {
      const cocokSearch =
        q === '' ||
        t.nama.toLowerCase().includes(q) ||
        t.sku.toLowerCase().includes(q) ||
        (t.catatan ?? '').toLowerCase().includes(q);
      const cocokTipe = tipeFilter === '' || t.tipe === tipeFilter;
      const cocokStaf = staffFilter === '' || t.nama_staf === staffFilter;
      return cocokSearch && cocokTipe && cocokStaf;
    });
  }, [transaksi, searchText, tipeFilter, staffFilter]);

  const halaman = usePagination(tersaring, 10, `${searchText}|${tipeFilter}|${staffFilter}`);

  return {
    loading,
    galat,
    setGalat,
    muat,
    daftarStaf,
    jumlahCocok: tersaring.length,
    halaman,
    filter: { searchText, setSearchText, tipeFilter, setTipeFilter, staffFilter, setStaffFilter },
  };
}