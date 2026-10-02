'use client';

import { useEffect, useState } from 'react';
import { Package, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
const ITEM_PER_HALAMAN = 10;

const SELECT_KELAS =
  'bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30';

function Pagination({
  halamanAktif,
  totalHalaman,
  onGanti,
  totalData,
}: {
  halamanAktif: number;
  totalHalaman: number;
  onGanti: (halaman: number) => void;
  totalData: number;
}) {
  if (totalHalaman <= 1) return null;

  const awal = (halamanAktif - 1) * ITEM_PER_HALAMAN + 1;
  const akhir = Math.min(halamanAktif * ITEM_PER_HALAMAN, totalData);

  return (
    <div className="px-5 py-3 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-600">
        Menampilkan <b className="text-slate-800">{awal}–{akhir}</b> dari <b className="text-slate-800">{totalData}</b> data
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onGanti(halamanAktif - 1)}
          disabled={halamanAktif === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-[#FEF1E6] hover:border-[#F2842F] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-300 transition"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onGanti(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
              p === halamanAktif
                ? 'bg-[#F2842F] text-white shadow-sm'
                : 'border-2 border-slate-300 text-slate-700 hover:bg-[#FEF1E6] hover:border-[#F2842F]'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onGanti(halamanAktif + 1)}
          disabled={halamanAktif === totalHalaman}
          className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-[#FEF1E6] hover:border-[#F2842F] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-300 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function RiwayatPage() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [halamanAktif, setHalamanAktif] = useState(1);

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

  useEffect(() => {
    setHalamanAktif(1);
  }, [searchText, tipeFilter, staffFilter]);

  function formatWaktu(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function tipeBadge(tipe: 'in' | 'out') {
    if (tipe === 'in') return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">Masuk</span>;
    return <span className="bg-red-100 text-red-800 border border-red-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">Keluar</span>;
  }

  function Thumbnail({ gambar }: { gambar: string | null }) {
    if (gambar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE_URL}${gambar}`}
          alt=""
          className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200 cursor-zoom-in shrink-0"
          onClick={() => setZoomUrl(`${BASE_URL}${gambar}`)}
        />
      );
    }
    return <div className="w-11 h-11 rounded-xl bg-[#FEF1E6] border-2 border-[#F2842F]/30 flex items-center justify-center text-[#F2842F] shrink-0"><Package size={20} /></div>;
  }

  const daftarStaf = Array.from(new Set(transaksi.map((t) => t.nama_staf)));

  const transaksiTersaring = transaksi.filter((t) => {
    const cocokSearch = searchText === '' || t.nama.toLowerCase().includes(searchText.toLowerCase()) || t.sku.toLowerCase().includes(searchText.toLowerCase()) || (t.catatan ?? '').toLowerCase().includes(searchText.toLowerCase());
    const cocokTipe = tipeFilter === '' || t.tipe === tipeFilter;
    const cocokStaf = staffFilter === '' || t.nama_staf === staffFilter;
    return cocokSearch && cocokTipe && cocokStaf;
  });

  const totalHalaman = Math.max(1, Math.ceil(transaksiTersaring.length / ITEM_PER_HALAMAN));
  const transaksiHalamanIni = transaksiTersaring.slice(
    (halamanAktif - 1) * ITEM_PER_HALAMAN,
    halamanAktif * ITEM_PER_HALAMAN
  );

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Riwayat Transaksi</h1>
          <p className="text-slate-600 text-base">50 transaksi stok masuk/keluar terbaru</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            placeholder="Cari produk, SKU, atau catatan..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30"
          />
          <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)} className={SELECT_KELAS}>
            <option value="">Semua Tipe</option>
            <option value="in">Masuk</option>
            <option value="out">Keluar</option>
          </select>
          <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className={SELECT_KELAS}>
            <option value="">Semua Staf</option>
            {daftarStaf.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 800 }}>
              <thead className="bg-[#FDE9D6] text-[#7A3505] text-sm uppercase tracking-wide border-b-2 border-[#F2842F]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold whitespace-nowrap">Waktu</th>
                  <th className="px-5 py-3.5 font-bold whitespace-nowrap">Produk</th>
                  <th className="px-5 py-3.5 font-bold whitespace-nowrap">Tipe</th>
                  <th className="px-5 py-3.5 font-bold whitespace-nowrap">Jumlah</th>
                  <th className="px-5 py-3.5 font-bold whitespace-nowrap">Staf</th>
                  <th className="px-5 py-3.5 font-bold whitespace-nowrap">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-600 text-base">Memuat data...</td></tr>}
                {!loading && transaksiTersaring.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-600 text-base">Tidak ada transaksi yang cocok.</td></tr>}
                {transaksiHalamanIni.map((t) => (
                  <tr key={t.id} className="border-b border-slate-200 hover:bg-[#FFF8F2] transition">
                    <td className="px-5 py-4 text-slate-700 text-base whitespace-nowrap">{formatWaktu(t.created_at)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={t.gambar} />
                        <div>
                          <div className="font-semibold text-slate-900 text-base">{t.nama}</div>
                          <div className="text-sm text-slate-500 font-mono">{t.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{tipeBadge(t.tipe)}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-base whitespace-nowrap">{t.jumlah}</td>
                    <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">{t.nama_staf}</td>
                    <td className="px-5 py-4 text-slate-700 text-base">{t.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            halamanAktif={halamanAktif}
            totalHalaman={totalHalaman}
            onGanti={setHalamanAktif}
            totalData={transaksiTersaring.length}
          />
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
        <button onClick={onClose} className="absolute -top-10 right-0 text-white">
          <X size={26} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}