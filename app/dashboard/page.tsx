'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  sku: string;
  nama: string;
  kategori: string | null;
  satuan: string | null;
  harga: number;
  stok_saat_ini: number;
  stok_minimum: number;
};

type Transaksi = {
  id: number;
  created_at: string;
};

export default function DashboardOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const [resProduk, resTransaksi] = await Promise.all([
      fetch('http://localhost:3000/products'),
      fetch('http://localhost:3000/transactions/recent'),
    ]);
    setProducts(await resProduk.json());
    setTransaksi(await resTransaksi.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalProduk = products.length;
  const stokMenipisList = products.filter((p) => p.stok_saat_ini <= p.stok_minimum);
  const stokMenipis = stokMenipisList.length;

  const hariIni = new Date().toDateString();
  const transaksiHariIni = transaksi.filter(
    (t) => new Date(t.created_at).toDateString() === hariIni
  ).length;

  const totalStokNilai = products.reduce(
    (total, p) => total + p.stok_saat_ini * Number(p.harga || 0),
    0
  );

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(angka);
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Ringkasan kondisi gudang secara keseluruhan</p>
        </div>

        {/* Inventory Summary */}
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Inventory Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Total Produk</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : totalProduk}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Stok Menipis</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : stokMenipis}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Transaksi Hari Ini</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : transaksiHariIni}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Total Stok Nilai</p>
            <p className="text-2xl font-bold text-emerald-600">{loading ? '-' : formatRupiah(totalStokNilai)}</p>
          </div>
        </div>

        {/* Items that need restocking */}
        <div className="flex items-center gap-2 mb-3">
          <span>✨</span>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Items that need restocking</h2>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Nama Produk</th>
                <th className="px-5 py-3">Stok</th>
                <th className="px-5 py-3">Min. Stok</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>
              )}
              {!loading && stokMenipisList.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Semua stok dalam kondisi aman 🎉</td></tr>
              )}
              {stokMenipisList.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-slate-500 font-mono text-sm">{p.sku}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{p.nama}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{p.stok_saat_ini}</td>
                  <td className="px-5 py-3 text-slate-600">{p.stok_minimum}</td>
                  <td className="px-5 py-3">
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Menipis</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stokMenipisList.length > 5 && (
            <div className="px-5 py-3 border-t border-slate-100 text-right">
              <Link href="/dashboard/master-data" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Lihat Semua ({stokMenipisList.length}) →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}