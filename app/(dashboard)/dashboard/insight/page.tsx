'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { useInsight } from './hooks/useInsight';
import { KartuInsight } from './components/KartuInsight';

export default function InsightPage() {
  const ins = useInsight();
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Peringatan Stok & AI Insight
            </h1>
            <p className="text-slate-600 text-base">
              Riwayat analisis prediktif dari histori transaksi 30 hari terakhir
            </p>
          </div>
          <button
            onClick={ins.generate}
            disabled={ins.generating}
            className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#172E6E] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            <Sparkles size={18} />
            {ins.generating ? 'Menganalisis...' : 'Generate Insight Baru'}
          </button>
        </div>

        {ins.galat && (
          <Alert jenis="error" onClose={() => ins.setGalat('')} className="mb-6">
            {ins.galat}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ins.loading && (
            <div className="md:col-span-2 text-center text-slate-600 text-base py-12">
              Memuat data...
            </div>
          )}

          {!ins.loading && ins.jumlahData === 0 && !ins.galat && (
            <div className="md:col-span-2 text-center text-slate-600 text-base py-12 bg-white border-2 border-slate-200 rounded-2xl">
              Belum ada analisis AI. Klik &quot;Generate Insight Baru&quot; untuk memulai.
            </div>
          )}

          {ins.halaman.dataHalaman.map((item) => (
            <KartuInsight
              key={item.id}
              item={item}
              jumlah={ins.jumlahTampil(item)}
              onJumlahChange={(v) => ins.ubahJumlah(item.sku, v)}
              onBuatPO={() => ins.buatPO(item.sku, ins.jumlahTampil(item), item.rekomendasi)}
              poLoading={ins.poLoadingSku === item.sku}
              poBerhasil={ins.poBerhasilSku === item.sku}
              onZoom={setZoomUrl}
            />
          ))}

          {!ins.loading && ins.halaman.totalHalaman > 1 && (
            <div className="md:col-span-2 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
              <Pagination
                garisAtas={false}
                halamanAktif={ins.halaman.halamanAktif}
                totalHalaman={ins.halaman.totalHalaman}
                onGanti={ins.halaman.setHalaman}
                totalData={ins.halaman.totalData}
                perHalaman={ins.halaman.perHalaman}
              />
            </div>
          )}
        </div>
      </div>

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}