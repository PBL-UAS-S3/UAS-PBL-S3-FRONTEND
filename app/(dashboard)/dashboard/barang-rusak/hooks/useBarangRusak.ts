'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import type { Product } from '@/types/produk';
import type { Transaksi } from '@/types/transaksi';
import { TIPE_KARANTINA } from '../constants';

export function useBarangRusak() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const notif = useNotifikasi();

  async function muat() {
    setLoading(true);
    setGalat('');

    const [resProduk, resTransaksi] = await Promise.all([
      api<Product[]>('/products'),
      api<Transaksi[]>('/transactions/recent'),
    ]);
    if (resProduk.sesiHabis || resTransaksi.sesiHabis) return;

    if (resProduk.ok && Array.isArray(resProduk.data)) {
      setProducts(resProduk.data);
    } else {
      setGalat((resProduk.data as any)?.error || 'Gagal memuat data produk');
    }
    setTransaksi(Array.isArray(resTransaksi.data) ? resTransaksi.data : []);
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  const turunan = useMemo(() => {
    const produkRusak = products.filter((p) => Number(p.stok_rusak ?? 0) > 0);

    return {
      produkRusak,
      totalUnitRusak: produkRusak.reduce((t, p) => t + Number(p.stok_rusak), 0),
      kerugian: produkRusak.reduce(
        (t, p) => t + Number(p.stok_rusak) * Number(p.harga || 0),
        0,
      ),
      produkBisaDipisah: products
        .filter((p) => p.stok_saat_ini > 0)
        .sort((a, b) => a.nama.localeCompare(b.nama)),
      aktivitas: transaksi.filter((t) => TIPE_KARANTINA.includes(t.tipe)).slice(0, 8),
    };
  }, [products, transaksi]);

  return { products, loading, galat, setGalat, muat, notif, ...turunan };
}