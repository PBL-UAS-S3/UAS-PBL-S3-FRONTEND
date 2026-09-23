'use client';

import { useEffect, useState } from 'react';

type PO = {
  id: number;
  nama: string;
  sku: string;
  harga: number;
  gambar: string | null;
  jumlah: number;
  status: 'pending' | 'selesai';
  catatan: string | null;
  created_at: string;
};

const BASE_URL = 'http://localhost:3000';

export default function PurchaseOrderPage() {
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [pesan, setPesan] = useState('');
  const [tab, setTab] = useState<'menunggu' | 'semua'>('menunggu');
  const [searchText, setSearchText] = useState('');
  const [detail, setDetail] = useState<PO | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchPOs() {
    setLoading(true);
    setPesan('');
    try {
      const res = await fetch(`${BASE_URL}/purchase-orders`, { headers: { Authorization: `Bearer ${token}` } });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('nama');
        window.location.href = '/';
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setPos(data);
      } else {
        setPos([]);
        setPesan(data.error || 'Gagal memuat data Purchase Order');
      }
    } catch (err) {
      setPos([]);
      setPesan('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPOs();
  }, []);

  async function tandaiSelesai(id: number) {
    setProsesId(id);
    setPesan('');
    try {
      const res = await fetch(`${BASE_URL}/purchase-orders/${id}/selesai`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      if (res.ok) {
        setDetail(null);
        await fetchPOs();
      } else {
        setPesan(data.error || 'Gagal menandai PO selesai');
      }
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setProsesId(null);
  }

  function formatWaktu(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  }

  function nomorPO(po: PO) {
    const tahun = new Date(po.created_at).getFullYear();
    return `PO-${tahun}-${String(po.id).padStart(3, '0')}`;
  }

  function statusBadge(status: string) {
    if (status === 'selesai') return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Selesai</span>;
    return <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Menunggu</span>;
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

  const jumlahMenunggu = pos.filter((p) => p.status === 'pending').length;
  const nilaiBerjalan = pos.filter((p) => p.status === 'pending').reduce((total, p) => total + p.jumlah * Number(p.harga || 0), 0);
  const jumlahSelesai = pos.filter((p) => p.status === 'selesai').length;

  const daftarSesuaiTab = tab === 'menunggu' ? pos.filter((p) => p.status === 'pending') : pos;

  const daftarTersaring = daftarSesuaiTab.filter((po) => {
    if (searchText === '') return true;
    return po.nama.toLowerCase().includes(searchText.toLowerCase()) || po.sku.toLowerCase().includes(searchText.toLowerCase()) || (po.catatan ?? '').toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Purchase Order</h1>
          <p className="text-slate-500 text-sm md:text-base">Kelola dan setujui pesanan pembelian inventori bahan dan pasokan gudang.</p>
        </div>

        {pesan && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">{pesan}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Menunggu Approval</p>
            <p className="text-2xl font-bold text-amber-600">{loading ? '-' : jumlahMenunggu}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Total Nilai Berjalan</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '-' : formatRupiah(nilaiBerjalan)}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-xs text-slate-400 mb-1">Total PO Selesai</p>
            <p className="text-2xl font-bold text-emerald-600">{loading ? '-' : jumlahSelesai}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="inline-flex bg-slate-100 rounded-lg p-1 w-fit">
            <button onClick={() => setTab('menunggu')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${tab === 'menunggu' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
              Menunggu Approval ({jumlahMenunggu})
            </button>
            <button onClick={() => setTab('semua')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${tab === 'semua' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
              Semua PO ({pos.length})
            </button>
          </div>
          <input
            placeholder="Cari No. PO atau produk..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-72"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 850 }}>
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">No. PO</th>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Jumlah</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>}
                {!loading && daftarTersaring.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Tidak ada Purchase Order yang cocok.</td></tr>}
                {daftarTersaring.map((po) => (
                  <tr key={po.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-5 py-3 font-mono text-sm text-slate-600 whitespace-nowrap">{nomorPO(po)}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={po.gambar} />
                        <div>
                          <div className="font-medium text-slate-900">{po.nama}</div>
                          <div className="text-xs text-slate-400 font-mono">{po.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{formatWaktu(po.created_at)}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{po.jumlah}</td>
                    <td className="px-5 py-3 text-slate-900 whitespace-nowrap">{formatRupiah(po.jumlah * Number(po.harga || 0))}</td>
                    <td className="px-5 py-3">{statusBadge(po.status)}</td>
                    <td className="px-5 py-3">
                      {po.status === 'pending' ? (
                        <button onClick={() => tandaiSelesai(po.id)} disabled={prosesId === po.id} className="bg-slate-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-800 transition disabled:opacity-50">
                          {prosesId === po.id ? 'Memproses...' : '✓ Approve'}
                        </button>
                      ) : (
                        <button onClick={() => setDetail(po)} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-200 transition">Lihat</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && (
            <div className="px-5 py-3 border-t border-slate-100 text-sm text-slate-500">
              Total {daftarTersaring.length} PO • Menampilkan {daftarTersaring.length} dari {daftarSesuaiTab.length} rekaman
            </div>
          )}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{nomorPO(detail)}</h2>
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-center mb-2"><Thumbnail gambar={detail.gambar} /></div>
              <div className="flex justify-between"><span className="text-slate-500">Produk</span><span className="font-medium text-slate-900">{detail.nama}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">SKU</span><span className="font-mono text-slate-700">{detail.sku}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Jumlah</span><span className="font-medium text-slate-900">{detail.jumlah}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Total Nilai</span><span className="font-medium text-slate-900">{formatRupiah(detail.jumlah * Number(detail.harga || 0))}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tanggal Dibuat</span><span className="text-slate-700">{formatWaktu(detail.created_at)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span>{statusBadge(detail.status)}</div>
              <div><span className="text-slate-500 block mb-1">Catatan</span><p className="text-slate-700">{detail.catatan || '-'}</p></div>
            </div>
          </div>
        </div>
      )}

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