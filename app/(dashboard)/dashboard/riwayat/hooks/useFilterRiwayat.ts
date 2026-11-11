'use client';

import { useMemo, useState } from 'react';
import { usePagination } from '@/hooks/usePagination';
import type { Transaksi } from '@/types/transaksi';

export function useFilterRiwayat(transaksi: Transaksi[]) {
  const [searchText, setSearchText] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');

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
    daftarStaf,
    jumlahCocok: tersaring.length,
    halaman,
    filter: { searchText, setSearchText, tipeFilter, setTipeFilter, staffFilter, setStaffFilter },
  };
}