'use client';

import { useMemo, useState } from 'react';
import { usePagination } from '@/hooks/usePagination';
import type { PO, TabPO } from '../types';

export function useFilterPO(pos: PO[]) {
  const [tab, setTab] = useState<TabPO>('menunggu');
  const [searchText, setSearchText] = useState('');

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
    tab, setTab,
    searchText, setSearchText,
    jumlahSesuaiTab: sesuaiTab.length,
    jumlahTersaring: tersaring.length,
    halaman,
  };
}