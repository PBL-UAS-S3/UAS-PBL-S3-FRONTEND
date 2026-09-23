'use client';

import { useEffect, useState } from 'react';

type Transaksi = {
  id: number;
  nama: string;
  sku: string;
  gambar: string | null;
  tipe: 'in' | 'out';
  jumlah: number;
  catatan: string | null;
  created_at: string;
  nama_staf: string;
};

const BASE_URL = 'http://localhost:3000';

export default function RiwayatPage() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');

  async function fetchRiwayat() {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/transactions/recent`);
    const data = await res.json();
    setTransaksi(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchRiwayat();
  }, []);

  function formatWaktu(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function tipeBadge(tipe: 'in' | 'out') {
    if (tipe === 'in') return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">Masuk</span>;
    return <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">Keluar</span>;
  }

  function Thumbnail({ gambar }: { gambar: string | null }) {
    if (gambar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE_URL}${gambar}`}
          alt=""
          className="w-9 h-9 rounded-lg object-cover border border-slate-200 cursor-zoom-in shrink-0"
          onClick={() => setZoomUrl(`${BASE_URL}${gambar}`)}
        />
      );
    }
    return <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 text-sm shrink-0">📦</div>;
  }

  const daftarStaf = Array.from(new Set(transaksi.map((t) => t.nama_staf)));

  const transaksiTersaring = transaksi.filter((t) => {
    const cocokSearch = searchText === '' || t.nama.toLowerCase().includes(searchText.toLowerCase()) || t.sku.toLowerCase().includes(searchText.toLowerCase()) || (t.catatan ?? '').toLowerCase().includes(searchText.toLowerCase());
    const cocokTipe = tipeFilter === '' || t.tipe === tipeFilter;
    const cocokStaf = staffFilter === '' || t.nama_staf === staffFilter;
    return cocokSearch && cocokTipe && cocokStaf;
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Riwayat Transaksi</h1>
          <p className="text-slate-500 text-sm md:text-base">50 transaksi stok masuk/keluar terbaru</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            placeholder="Cari produk, SKU, atau catatan..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)} className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Tipe</option>
            <option value="in">Masuk</option>
            <option value="out">Keluar</option>
          </select>
          <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Staf</option>
            {daftarStaf.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 750 }}>
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
                {loading && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>}
                {!loading && transaksiTersaring.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Tidak ada transaksi yang cocok.</td></tr>}
                {transaksiTersaring.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-500 text-sm whitespace-nowrap">{formatWaktu(t.created_at)}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={t.gambar} />
                        <div>
                          <div className="font-medium text-slate-900">{t.nama}</div>
                          <div className="text-xs text-slate-400 font-mono">{t.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">{tipeBadge(t.tipe)}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900 whitespace-nowrap">{t.jumlah}</td>
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{t.nama_staf}</td>
                    <td className="px-5 py-3 text-slate-500 text-sm">{t.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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