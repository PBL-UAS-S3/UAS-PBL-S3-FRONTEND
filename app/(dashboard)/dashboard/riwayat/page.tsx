'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { ambilTransaksiTerbaru } from '@/services/transaksiService';
import type { Transaksi } from '@/types/transaksi';
import { useFilterRiwayat } from './hooks/useFilterRiwayat';
import { FilterRiwayat } from './components/FilterRiwayat';
import { TabelRiwayat } from './components/TabelRiwayat';

export default function RiwayatPage() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const { daftarStaf, jumlahCocok, halaman, filter } = useFilterRiwayat(transaksi);

  async function muat() {
    setLoading(true);
    setGalat('');

    const res = await ambilTransaksiTerbaru();
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setTransaksi(res.data);
    } else {
      setGalat((res.data as any)?.error || 'Gagal memuat riwayat transaksi');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

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