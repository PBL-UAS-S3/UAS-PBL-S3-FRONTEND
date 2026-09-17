'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Insight = {
  id: number;
  nama: string;
  sku: string;
  stok_saat_ini: number;
  stok_minimum: number;
  rekomendasi: string;
  jumlah_restock_disarankan: number;
  generated_at: string;
  is_terbaru: number;
};

export default function InsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [poLoadingSku, setPoLoadingSku] = useState<string | null>(null);
  const [poBerhasilSku, setPoBerhasilSku] = useState<string | null>(null);
  const [customJumlah, setCustomJumlah] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchInsights() {
    setLoading(true);
    setPesan('');
    try {
      const res = await fetch('http://localhost:3000/ai-insights');
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchInsights();
  }, []);

  async function generateInsight() {
    setGenerating(true);
    setPesan('');
    try {
      const res = await fetch('http://localhost:3000/ai-insights/generate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        await fetchInsights();
      } else {
        setPesan(data.error || 'Gagal membuat analisis AI');
      }
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setGenerating(false);
  }

  async function buatPO(sku: string, jumlahStr: string, rekomendasi: string) {
    const jumlah = parseInt(jumlahStr || '0', 10);
    if (!jumlah || jumlah <= 0) {
      setPesan('Jumlah PO harus lebih dari 0');
      return;
    }
    setPoLoadingSku(sku);
    setPesan('');
    try {
      const res = await fetch('http://localhost:3000/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sku, jumlah, catatan: `Dibuat dari AI Insight: ${rekomendasi}` }),
      });
      const data = await res.json();

      if (res.ok) {
        setPoBerhasilSku(sku);
      } else {
        setPesan(data.error || 'Gagal membuat Purchase Order');
      }
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setPoLoadingSku(null);
  }

  function formatWaktu(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function sudahAman(item: Insight) {
    return item.stok_saat_ini > item.stok_minimum;
  }

  function tampilkanTombolPO(item: Insight) {
    return item.is_terbaru === 1 && !sudahAman(item) && item.jumlah_restock_disarankan > 0;
  }

  function restockBadge(item: Insight) {
    if (sudahAman(item)) {
      return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Aman</span>;
    }
    return <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Perlu restock</span>;
  }

  function getJumlahDisplay(item: Insight) {
    return customJumlah[item.sku] ?? String(item.jumlah_restock_disarankan);
  }

  function handleJumlahChange(sku: string, raw: string) {
    let bersih = raw.replace(/[^0-9]/g, '');
    if (bersih.length > 1) {
      bersih = bersih.replace(/^0+/, '') || '0';
    }
    setCustomJumlah({ ...customJumlah, [sku]: bersih });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-4 text-sm">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">Master Data</Link>
          <Link href="/dashboard/riwayat" className="text-blue-600 hover:text-blue-800 font-medium">Riwayat Transaksi</Link>
          <span className="text-slate-900 font-semibold">AI Insight</span>
          <Link href="/dashboard/po" className="text-blue-600 hover:text-blue-800 font-medium">Purchase Order</Link>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Peringatan Stok & AI Insight</h1>
            <p className="text-slate-500">Riwayat analisis prediktif dari histori transaksi 30 hari terakhir</p>
          </div>
          <button
            onClick={generateInsight}
            disabled={generating}
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Menganalisis...' : '✨ Generate Insight Baru'}
          </button>
        </div>

        {pesan && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {pesan}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && (
            <div className="col-span-2 text-center text-slate-400 py-12">Memuat data...</div>
          )}
          {!loading && insights.length === 0 && (
            <div className="col-span-2 text-center text-slate-400 py-12 bg-white border border-slate-200 rounded-2xl">
              Belum ada analisis AI. Klik &quot;Generate Insight Baru&quot; untuk memulai.
            </div>
          )}
          {insights.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-slate-900">{item.nama}</div>
                  <div className="text-xs text-slate-400 font-mono">{item.sku}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {restockBadge(item)}
                  {item.is_terbaru === 0 && (
                    <span className="text-slate-400 text-xs">Riwayat</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-3">{item.rekomendasi}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3 mb-3">
                <span>Stok saat ini: <b className="text-slate-700">{item.stok_saat_ini}</b> (min. {item.stok_minimum})</span>
                <span>{formatWaktu(item.generated_at)}</span>
              </div>

              {tampilkanTombolPO(item) && (
                poBerhasilSku === item.sku ? (
                  <div className="text-emerald-600 text-sm font-medium">✓ Purchase Order berhasil dibuat</div>
                ) : (
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Jumlah restock (bisa diubah)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={getJumlahDisplay(item)}
                        onChange={(e) => handleJumlahChange(item.sku, e.target.value)}
                        className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => buatPO(item.sku, getJumlahDisplay(item), item.rekomendasi)}
                        disabled={poLoadingSku === item.sku}
                        className="flex-1 bg-amber-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                      >
                        {poLoadingSku === item.sku ? 'Membuat PO...' : 'Buat PO'}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}