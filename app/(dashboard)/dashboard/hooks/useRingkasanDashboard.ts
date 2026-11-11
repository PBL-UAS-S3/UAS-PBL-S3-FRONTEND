'use client';

import { useMemo } from 'react';
import type { Product } from '@/types/produk';
import type { Transaksi } from '@/types/transaksi';

export function useRingkasanDashboard(products: Product[], transaksi: Transaksi[]) {
  return useMemo(() => {
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
}