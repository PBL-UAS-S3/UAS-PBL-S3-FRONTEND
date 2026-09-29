"use client";

import { useEffect, useState } from "react";

type Insight = {
  id: number;
  nama: string;
  sku: string;
  gambar: string | null;
  stok_saat_ini: number;
  stok_minimum: number;
  rekomendasi: string;
  jumlah_restock_disarankan: number;
  generated_at: string;
  is_terbaru: number;
};

const BASE_URL = "http://localhost:3000";

export default function InsightPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [poLoadingSku, setPoLoadingSku] = useState<string | null>(null);
  const [poBerhasilSku, setPoBerhasilSku] = useState<string | null>(null);
  const [customJumlah, setCustomJumlah] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState("");
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function fetchInsights() {
    setLoading(true);
    setPesan("");
    try {
      const res = await fetch(`${BASE_URL}/ai-insights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setInsights(data);
      } else {
        setInsights([]);
        setPesan(data.error || "Gagal memuat data insight");
      }
    } catch (err) {
      setInsights([]);
      setPesan("Tidak dapat terhubung ke server");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchInsights();
  }, []);

  async function generateInsight() {
    setGenerating(true);
    setPesan("");
    try {
      const res = await fetch(`${BASE_URL}/ai-insights/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        await fetchInsights();
      } else {
        setPesan(data.error || "Gagal membuat analisis AI");
      }
    } catch (err) {
      setPesan("Tidak dapat terhubung ke server");
    }
    setGenerating(false);
  }

  async function buatPO(sku: string, jumlahStr: string, rekomendasi: string) {
    const jumlah = parseInt(jumlahStr || "0", 10);
    if (!jumlah || jumlah <= 0) {
      setPesan("Jumlah PO harus lebih dari 0");
      return;
    }
    setPoLoadingSku(sku);
    setPesan("");
    try {
      const res = await fetch(`${BASE_URL}/purchase-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sku,
          jumlah,
          catatan: `Dibuat dari AI Insight: ${rekomendasi}`,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPoBerhasilSku(sku);
      } else {
        setPesan(data.error || "Gagal membuat Purchase Order");
      }
    } catch (err) {
      setPesan("Tidak dapat terhubung ke server");
    }
    setPoLoadingSku(null);
  }

  function formatWaktu(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function sudahAman(item: Insight) {
    return item.stok_saat_ini > item.stok_minimum;
  }

  function tampilkanTombolPO(item: Insight) {
    return (
      item.is_terbaru === 1 &&
      !sudahAman(item) &&
      item.jumlah_restock_disarankan > 0
    );
  }

  function restockBadge(item: Insight) {
    if (sudahAman(item)) {
      return (
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Aman
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
        Perlu restock
      </span>
    );
  }

  function getJumlahDisplay(item: Insight) {
    return customJumlah[item.sku] ?? String(item.jumlah_restock_disarankan);
  }

  function handleJumlahChange(sku: string, raw: string) {
    let bersih = raw.replace(/[^0-9]/g, "");
    if (bersih.length > 1) {
      bersih = bersih.replace(/^0+/, "") || "0";
    }
    setCustomJumlah({ ...customJumlah, [sku]: bersih });
  }

  function Thumbnail({ gambar }: { gambar: string | null }) {
    if (gambar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE_URL}${gambar}`}
          alt=""
          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200 cursor-zoom-in shrink-0"
          onClick={() => setZoomUrl(`${BASE_URL}${gambar}`)}
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-xl bg-[#FEF1E6] border-2 border-[#F2842F]/30 flex items-center justify-center text-[#F2842F] shrink-0">
        📦
      </div>
    );
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
            onClick={generateInsight}
            disabled={generating}
            className="bg-[#F2842F] text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#DD6F1B] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-fit"
          >
            {generating ? "Menganalisis..." : "✨ Generate Insight Baru"}
          </button>
        </div>

        {pesan && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 text-base font-medium rounded-xl px-4 py-3 mb-6">
            {pesan}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && (
            <div className="md:col-span-2 text-center text-slate-600 text-base py-12">
              Memuat data...
            </div>
          )}
          {!loading && insights.length === 0 && !pesan && (
            <div className="md:col-span-2 text-center text-slate-600 text-base py-12 bg-white border-2 border-slate-200 rounded-2xl">
              Belum ada analisis AI. Klik &quot;Generate Insight Baru&quot;
              untuk memulai.
            </div>
          )}
          {insights.map((item) => (
            <div
              key={item.id}
              className={`bg-white border-2 rounded-2xl shadow-sm p-5 ${
                item.is_terbaru === 1 ? "border-slate-200" : "border-slate-200 opacity-90"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Thumbnail gambar={item.gambar} />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-lg truncate">
                      {item.nama}
                    </div>
                    <div className="text-sm text-slate-500 font-mono">
                      {item.sku}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {restockBadge(item)}
                  {item.is_terbaru === 0 && (
                    <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Riwayat
                    </span>
                  )}
                </div>
              </div>

              <p className="text-base text-slate-800 mb-4">{item.rekomendasi}</p>

              <div className="flex flex-wrap items-center justify-between gap-1 text-sm text-slate-600 border-t-2 border-slate-100 pt-3 mb-3">
                <span>
                  Stok saat ini:{" "}
                  <b className="text-slate-900">{item.stok_saat_ini}</b> (min.{" "}
                  {item.stok_minimum})
                </span>
                <span>{formatWaktu(item.generated_at)}</span>
              </div>

              {tampilkanTombolPO(item) &&
                (poBerhasilSku === item.sku ? (
                  <div className="text-emerald-700 text-base font-semibold">
                    ✓ Purchase Order berhasil dibuat
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">
                      Jumlah restock (bisa diubah)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={getJumlahDisplay(item)}
                        onChange={(e) =>
                          handleJumlahChange(item.sku, e.target.value)
                        }
                        className="w-28 bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-base font-bold text-slate-900 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30"
                      />
                      <button
                        onClick={() =>
                          buatPO(
                            item.sku,
                            getJumlahDisplay(item),
                            item.rekomendasi,
                          )
                        }
                        disabled={poLoadingSku === item.sku}
                        className="flex-1 bg-[#F2842F] text-white text-base font-semibold py-2 rounded-xl hover:bg-[#DD6F1B] transition disabled:opacity-50"
                      >
                        {poLoadingSku === item.sku
                          ? "Membuat PO..."
                          : "Buat PO"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}

function ModalZoomGambar({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="relative max-w-lg w-full">
        <button onClick={onClose} className="absolute -top-10 right-0 text-white text-2xl leading-none">✕</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}