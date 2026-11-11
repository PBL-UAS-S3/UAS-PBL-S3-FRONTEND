'use client';

import { useMemo, useState } from 'react';
import { usePagination } from '@/hooks/usePagination';
import type { Product } from '@/types/produk';
import { PRESET_SATUAN } from '../constants';
import { rusakDari, statusKey } from '../helpers';

export function useFilterProduk(products: Product[]) {
  const [searchText, setSearchText] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const daftarKategori = useMemo(
    () => Array.from(new Set(products.map((p) => p.kategori).filter((k): k is string => !!k))),
    [products],
  );

  const daftarSatuan = useMemo(
    () =>
      Array.from(
        new Set([
          ...PRESET_SATUAN,
          ...products.map((p) => p.satuan).filter((s): s is string => !!s),
        ]),
      ),
    [products],
  );

  const tersaring = useMemo(() => {
    const q = searchText.toLowerCase();
    return products.filter((p) => {
      const cocokSearch =
        q === '' || p.nama.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const cocokKategori = kategoriFilter === '' || p.kategori === kategoriFilter;
      const cocokStatus =
        statusFilter === '' ||
        (statusFilter === 'rusak' ? rusakDari(p) > 0 : statusKey(p) === statusFilter);
      return cocokSearch && cocokKategori && cocokStatus;
    });
  }, [products, searchText, kategoriFilter, statusFilter]);

  const halaman = usePagination(tersaring, 10, `${searchText}|${kategoriFilter}|${statusFilter}`);

  return {
    daftarKategori,
    daftarSatuan,
    jumlahCocok: tersaring.length,
    halaman,
    filter: {
      searchText, setSearchText,
      kategoriFilter, setKategoriFilter,
      statusFilter, setStatusFilter,
    },
  };
}