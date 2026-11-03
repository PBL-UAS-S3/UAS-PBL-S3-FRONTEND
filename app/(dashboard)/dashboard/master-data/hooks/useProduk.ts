'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { usePagination } from '@/hooks/usePagination';
import type { Product } from '@/types/produk';
import { PRESET_SATUAN } from '../constants';
import { rusakDari, statusKey } from '../helpers';

export function useProduk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [menghapus, setMenghapus] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const notif = useNotifikasi();

  async function muat() {
    setLoading(true);
    setGalat('');
    const res = await api<Product[]>('/products');
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setProducts(res.data);
    } else {
      setGalat((res.data as any)?.error || 'Gagal memuat data produk');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function hapus(p: Product) {
    setMenghapus(true);
    const res = await api<{ error?: string }>(`/products/${p.id}`, { method: 'DELETE' });
    if (res.sesiHabis) return;

    if (res.ok) {
      notif.tampil('sukses', `Produk "${p.nama}" berhasil dihapus`);
      await muat();
    } else {
      notif.tampil('error', res.data.error || 'Gagal menghapus produk');
    }
    setMenghapus(false);
  }

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
    loading,
    galat,
    setGalat,
    muat,
    notif,
    menghapus,
    hapus,
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