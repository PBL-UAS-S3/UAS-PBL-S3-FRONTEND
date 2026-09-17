"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Transaksi = {
  id: number;
  nama: string;
  sku: string;
  tipe: "in" | "out";
  jumlah: number;
  catatan: string | null;
  created_at: string;
  nama_staf: string;
};

export default function RiwayatPage() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRiwayat() {
    setLoading(true);
    const res = await fetch("http://localhost:3000/transactions/recent");
    const data = await res.json();
    setTransaksi(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchRiwayat();
  }, []);

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

  function tipeBadge(tipe: "in" | "out") {
    if (tipe === "in") {
      return (
        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
          Masuk
        </span>
      );
    }
    return (
      <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
        Keluar
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-4 text-sm">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Master Data
          </Link>
          <span className="text-slate-900 font-semibold">
            Riwayat Transaksi
          </span>
          <Link
            href="/dashboard/insight"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            AI Insight
          </Link>
          <Link
            href="/dashboard/po"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Purchase Order
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Riwayat Transaksi
          </h1>
          <p className="text-slate-500">
            50 transaksi stok masuk/keluar terbaru
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 700 }}>
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap">Waktu</th>
                  <th className="px-5 py-3 whitespace-nowrap">Produk</th>
                  <th className="px-5 py-3 whitespace-nowrap">Tipe</th>
                  <th className="px-5 py-3 whitespace-nowrap">Jumlah</th>
                  <th className="px-5 py-3 whitespace-nowrap">Staf</th>
                  <th className="px-5 py-3 whitespace-nowrap">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Memuat data...
                    </td>
                  </tr>
                )}
                {!loading && transaksi.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Belum ada transaksi tercatat.
                    </td>
                  </tr>
                )}
                {transaksi.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-5 py-3 text-slate-500 text-sm whitespace-nowrap">
                      {formatWaktu(t.created_at)}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{t.nama}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {t.sku}
                      </div>
                    </td>
                    <td className="px-5 py-3">{tipeBadge(t.tipe)}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {t.jumlah}
                    </td>
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                      {t.nama_staf}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-sm">
                      {t.catatan || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}