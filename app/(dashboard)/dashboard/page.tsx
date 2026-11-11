'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { ambilSesi } from '@/lib/auth';
import { ambilProduk } from '@/services/produkService';
import { ambilTransaksiTerbaru } from '@/services/transaksiService';
import type { Product } from '@/types/produk';
import type { Transaksi } from '@/types/transaksi';
import { useRingkasanDashboard } from './hooks/useRingkasanDashboard';
import { HeaderDashboard } from './components/HeaderDashboard';
import { RingkasanDashboard } from './components/RingkasanDashboard';
import { BannerRusak } from './components/BannerRusak';
import { TabelRestock } from './components/TabelRestock';

export default function DashboardOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [nama, setNama] = useState('');

  const ringkasan = useRingkasanDashboard(products, transaksi);

  async function muat() {
    setLoading(true);
    setGalat('');

    const [resProduk, resTransaksi] = await Promise.all([
      ambilProduk(),
      ambilTransaksiTerbaru(),
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

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <HeaderDashboard nama={nama} />

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-6">
            {galat}{' '}
            <button onClick={muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <RingkasanDashboard
          loading={loading}
          totalProduk={ringkasan.totalProduk}
          stokMenipis={ringkasan.perluRestock.length}
          transaksiHariIni={ringkasan.transaksiHariIni}
          nilaiStok={ringkasan.nilaiStok}
        />

        {!loading && (
          <BannerRusak totalUnit={ringkasan.totalUnitRusak} jumlahProduk={ringkasan.produkRusak} />
        )}

        <TabelRestock data={ringkasan.perluRestock} loading={loading} />
      </div>
    </main>
  );
}