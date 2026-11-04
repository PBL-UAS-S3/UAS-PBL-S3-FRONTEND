'use client';

import { Alert } from '@/components/ui/Alert';
import { useDashboard } from './hooks/useDashboard';
import { HeaderDashboard } from './components/HeaderDashboard';
import { RingkasanDashboard } from './components/RingkasanDashboard';
import { BannerRusak } from './components/BannerRusak';
import { TabelRestock } from './components/TabelRestock';

export default function DashboardOverviewPage() {
  const d = useDashboard();

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <HeaderDashboard nama={d.nama} />

        {d.galat && (
          <Alert jenis="error" onClose={() => d.setGalat('')} className="mb-6">
            {d.galat}{' '}
            <button onClick={d.muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <RingkasanDashboard
          loading={d.loading}
          totalProduk={d.totalProduk}
          stokMenipis={d.perluRestock.length}
          transaksiHariIni={d.transaksiHariIni}
          nilaiStok={d.nilaiStok}
        />

        {!d.loading && <BannerRusak totalUnit={d.totalUnitRusak} jumlahProduk={d.produkRusak} />}

        <TabelRestock data={d.perluRestock} loading={d.loading} />
      </div>
    </main>
  );
}