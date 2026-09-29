'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, AlertTriangle, RefreshCw, Wallet, Sparkles, ArrowRight, PartyPopper } from 'lucide-react';

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

function KartuRingkasan({
  label,
  nilai,
  Icon,
  warnaNilai = 'text-slate-900',
  warnaIkon = 'bg-[#FEF1E6] text-[#F2842F]',
}: {
  label: string;
  nilai: string | number;
  Icon: React.ElementType;
  warnaNilai?: string;
  warnaIkon?: string;
}) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-4 md:p-5 min-w-0">
      <div className={`w-12 h-12 rounded-xl ${warnaIkon} flex items-center justify-center mb-3`}>
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${warnaNilai}`}>{nilai}</p>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState('');

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
    setNama(localStorage.getItem('nama') || 'Manager');
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

  function ukuranFontNilai(teks: string) {
    if (teks.length > 18) return 'text-lg md:text-xl';
    if (teks.length > 13) return 'text-xl md:text-2xl';
    return 'text-2xl md:text-3xl';
  }

  const teksNilai = loading ? '-' : formatRupiah(totalStokNilai);

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <p className="text-base font-semibold text-[#B9540A]">Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Halo, {nama}</h1>
            <p className="text-slate-600 text-base">Ringkasan kondisi gudang secara keseluruhan</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/insight"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-base font-semibold text-slate-800 hover:bg-[#FEF1E6] hover:border-[#F2842F] transition"
            >
              <Sparkles size={18} /> AI Insight
            </Link>
            <Link
              href="/dashboard/master-data"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2842F] text-white text-base font-semibold hover:bg-[#DD6F1B] transition shadow-sm"
            >
              <Package size={18} /> Kelola Produk
            </Link>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">Inventory Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <KartuRingkasan label="Total Produk" nilai={loading ? '-' : totalProduk} Icon={Package} />
          <KartuRingkasan
            label="Stok Menipis"
            nilai={loading ? '-' : stokMenipis}
            Icon={AlertTriangle}
            warnaNilai="text-red-700"
            warnaIkon="bg-red-100 text-red-600"
          />
          <KartuRingkasan label="Transaksi Hari Ini" nilai={loading ? '-' : transaksiHariIni} Icon={RefreshCw} />

          <div className="bg-[#F2842F] rounded-2xl shadow-sm p-4 md:p-5 min-w-0 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center mb-3">
              <Wallet size={22} />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Total Stok Nilai</p>
            <p className={`font-bold truncate ${ukuranFontNilai(teksNilai)}`} title={teksNilai}>
              {teksNilai}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-[#F2842F]" />
          <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide">Items that need restocking</h2>
          {!loading && stokMenipis > 0 && (
            <span className="bg-[#F2842F] text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
              {stokMenipis}
            </span>
          )}
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 600 }}>
              <thead className="bg-[#FDE9D6] text-[#7A3505] text-sm uppercase tracking-wide border-b-2 border-[#F2842F]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">SKU</th>
                  <th className="px-5 py-3.5 font-bold">Nama Produk</th>
                  <th className="px-5 py-3.5 font-bold">Stok</th>
                  <th className="px-5 py-3.5 font-bold">Min. Stok</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-base">Memuat data...</td></tr>
                )}
                {!loading && stokMenipisList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-base">
                      <div className="flex items-center justify-center gap-2">
                        <PartyPopper size={18} className="text-[#F2842F]" /> Semua stok dalam kondisi aman
                      </div>
                    </td>
                  </tr>
                )}
                {stokMenipisList.slice(0, 5).map((p) => (
                  <tr key={p.id} className="border-b border-slate-200 hover:bg-[#FFF8F2] transition">
                    <td className="px-5 py-4 text-slate-600 font-mono text-base">{p.sku}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 text-base">{p.nama}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-base">{p.stok_saat_ini}</td>
                    <td className="px-5 py-4 text-slate-700 text-base">{p.stok_minimum}</td>
                    <td className="px-5 py-4">
                      <span className="bg-red-100 text-red-800 border border-red-300 text-sm font-bold px-3 py-1 rounded-full">Menipis</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stokMenipisList.length > 5 && (
            <div className="px-5 py-3 border-t-2 border-slate-100 text-right">
              <Link href="/dashboard/master-data" className="inline-flex items-center gap-1 text-[#B9540A] hover:text-[#7A3505] text-base font-semibold">
                Lihat Semua ({stokMenipisList.length}) <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}