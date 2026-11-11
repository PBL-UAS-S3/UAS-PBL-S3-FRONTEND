'use client';

import { useMemo } from 'react';
import type { Product } from '@/types/produk';
import type { Transaksi } from '@/types/transaksi';
import { TIPE_KARANTINA } from '../constants';

export function useRingkasanRusak(products: Product[], transaksi: Transaksi[]) {
  return useMemo(() => {
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
      aktivitas: transaksi.filter((t) => TIPE_KARANTINA.includes(t.tipe)),
    };
  }, [products, transaksi]);
}