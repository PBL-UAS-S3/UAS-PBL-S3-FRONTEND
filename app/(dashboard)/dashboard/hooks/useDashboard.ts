'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { ambilSesi } from '@/lib/auth';
import type { Product } from '@/types/produk';
import type { Transaksi } from '@/types/transaksi';

export function useDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [nama, setNama] = useState('');

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
      setGalat((resProduk.data as any)?.error || 'Gagal memuat data dashboard');
    }
    setTransaksi(Array.isArray(resTransaksi.data) ? resTransaksi.data : []);
    setLoading(false);
  }

  useEffect(() => {
    setNama(ambilSesi()?.nama || 'Manager');
    muat();
  }, []);

  const ringkasan = useMemo(() => {
    const perluRestock = products.filter((p) => p.stok_saat_ini <= p.stok_minimum);
    const hariIni = new Date().toDateString();

    return {
      totalProduk: products.length,
      perluRestock,
      transaksiHariIni: transaksi.filter((t) => new Date(t.created_at).toDateString() === hariIni)
        .length,
      produkRusak: products.filter((p) => Number(p.stok_rusak ?? 0) > 0).length,
      totalUnitRusak: products.reduce((total, p) => total + Number(p.stok_rusak ?? 0), 0),
      // Nilai stok hanya menghitung stok layak
      nilaiStok: products.reduce(
        (total, p) => total + p.stok_saat_ini * Number(p.harga || 0),
        0,
      ),
    };
  }, [products, transaksi]);

  return { loading, galat, setGalat, muat, nama, ...ringkasan };
}