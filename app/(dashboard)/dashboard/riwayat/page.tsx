'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { useRiwayat } from './hooks/useRiwayat';
import { FilterRiwayat } from './components/FilterRiwayat';
import { TabelRiwayat } from './components/TabelRiwayat';

export default function RiwayatPage() {
  const { loading, galat, setGalat, muat, daftarStaf, jumlahCocok, halaman, filter } = useRiwayat();
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Riwayat Transaksi</h1>
          <p className="text-slate-600 text-base">
            50 transaksi stok terbaru, termasuk pemisahan barang rusak
          </p>
        </div>

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-4">
            {galat}{' '}
            <button onClick={muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <FilterRiwayat {...filter} daftarStaf={daftarStaf} />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelRiwayat
            data={halaman.dataHalaman}
            loading={loading}
            kosong={jumlahCocok === 0}
            onZoom={setZoomUrl}
          />
          <Pagination
            halamanAktif={halaman.halamanAktif}
            totalHalaman={halaman.totalHalaman}
            onGanti={halaman.setHalaman}
            totalData={halaman.totalData}
            perHalaman={halaman.perHalaman}
          />
        </div>
      </div>

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}