'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { usePagination } from '@/hooks/usePagination';
import { ambilInsight, buatInsightBaru } from '@/services/insightService';
import { buatPurchaseOrder } from '@/services/poService';
import type { Insight } from './types';
import { useJumlahRestock } from './hooks/useJumlahRestock';
import { KartuInsight } from './components/KartuInsight';

export default function InsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [poLoadingSku, setPoLoadingSku] = useState<string | null>(null);
  const [poBerhasilSku, setPoBerhasilSku] = useState<string | null>(null);
  const [galat, setGalat] = useState('');
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const { jumlahTampil, ubahJumlah } = useJumlahRestock();
  const halaman = usePagination(insights, 10, String(insights.length));

  async function muat() {
    setLoading(true);
    setGalat('');

    const res = await ambilInsight();
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setInsights(res.data);
    } else {
      setInsights([]);
      setGalat((res.data as any)?.error || 'Gagal memuat data insight');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function generate() {
    setGenerating(true);
    setGalat('');

    const res = await buatInsightBaru();
    if (res.sesiHabis) return;

    if (res.ok) {
      await muat();
    } else {
      setGalat(res.data.error || 'Gagal membuat analisis AI');
    }
    setGenerating(false);
  }

  async function buatPO(item: Insight) {
    const jumlah = parseInt(jumlahTampil(item) || '0', 10);
    if (!jumlah || jumlah <= 0) {
      setGalat('Jumlah PO harus lebih dari 0');
      return;
    }

    setPoLoadingSku(item.sku);
    setGalat('');

    const res = await buatPurchaseOrder({
      sku: item.sku,
      jumlah,
      catatan: `Dibuat dari AI Insight: ${item.rekomendasi}`,
    });
    if (res.sesiHabis) return;

    if (res.ok) {
      setPoBerhasilSku(item.sku);
    } else {
      setGalat(res.data.error || 'Gagal membuat Purchase Order');
    }
    setPoLoadingSku(null);
  }

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
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#172E6E] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            <Sparkles size={18} />
            {generating ? 'Menganalisis...' : 'Generate Insight Baru'}
          </button>
        </div>

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-6">
            {galat}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && (
            <div className="md:col-span-2 text-center text-slate-600 text-base py-12">
              Memuat data...
            </div>
          )}

          {!loading && insights.length === 0 && !galat && (
            <div className="md:col-span-2 text-center text-slate-600 text-base py-12 bg-white border-2 border-slate-200 rounded-2xl">
              Belum ada analisis AI. Klik &quot;Generate Insight Baru&quot; untuk memulai.
            </div>
          )}

          {halaman.dataHalaman.map((item) => (
            <KartuInsight
              key={item.id}
              item={item}
              jumlah={jumlahTampil(item)}
              onJumlahChange={(v) => ubahJumlah(item.sku, v)}
              onBuatPO={() => buatPO(item)}
              poLoading={poLoadingSku === item.sku}
              poBerhasil={poBerhasilSku === item.sku}
              onZoom={setZoomUrl}
            />
          ))}

          {!loading && halaman.totalHalaman > 1 && (
            <div className="md:col-span-2 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
              <Pagination
                garisAtas={false}
                halamanAktif={halaman.halamanAktif}
                totalHalaman={halaman.totalHalaman}
                onGanti={halaman.setHalaman}
                totalData={halaman.totalData}
                perHalaman={halaman.perHalaman}
              />
            </div>
          )}
        </div>
      </div>

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}