'use client';

import { useEffect, useState } from 'react';
import {
  Clock,
  Wallet,
  CheckCircle2,
  Package,
  Check,
  Eye,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { Alert, useNotifikasi } from '@/components/ui/Alert';

type StatusPO = 'pending' | 'selesai' | 'ditolak';

type PO = {
  id: number;
  nama: string;
  sku: string;
  harga: number;
  gambar: string | null;
  jumlah: number;
  status: StatusPO;
  catatan: string | null;
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const INPUT_KELAS =
  'w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30';

function KartuPO({
  label,
  nilai,
  ikon,
  warnaNilai = 'text-slate-900',
  warnaIkon = 'bg-[#E8EEFC]',
}: {
  label: string;
  nilai: string | number;
  ikon: React.ReactNode;
  warnaNilai?: string;
  warnaIkon?: string;
}) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5 min-w-0">
      <div className={`w-12 h-12 rounded-xl ${warnaIkon} flex items-center justify-center mb-3`}>{ikon}</div>
      <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold truncate ${warnaNilai}`}>{nilai}</p>
    </div>
  );
}

export default function PurchaseOrderPage() {
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [tab, setTab] = useState<'menunggu' | 'semua' | 'ditolak'>('menunggu');
  const [searchText, setSearchText] = useState('');
  const [detail, setDetail] = useState<PO | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  // modal tolak
  const [tolakTarget, setTolakTarget] = useState<PO | null>(null);
  const [alasan, setAlasan] = useState('');
  const [pesanTolak, setPesanTolak] = useState('');

  const { notif, tampil, tutup } = useNotifikasi();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  function keLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nama');
    window.location.href = '/login';
  }

  async function fetchPOs() {
    setLoading(true);
    setGalat('');
    try {
      const res = await fetch(`${API_URL}/purchase-orders`, { headers: { Authorization: `Bearer ${token}` } });

      if (res.status === 401 || res.status === 403) {
        keLogin();
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setPos(Array.isArray(data) ? data : []);
      } else {
        setPos([]);
        setGalat(data.error || 'Gagal memuat data Purchase Order');
      }
    } catch (err) {
      setPos([]);
      setGalat('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPOs();
  }, []);

  async function tandaiSelesai(po: PO) {
    setProsesId(po.id);
    try {
      const res = await fetch(`${API_URL}/purchase-orders/${po.id}/selesai`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setDetail(null);
        tampil('sukses', `${nomorPO(po)} disetujui. Stok ${po.nama} bertambah ${po.jumlah} menjadi ${data.stok_baru}.`);
        await fetchPOs();
      } else {
        tampil('error', data.error || 'Gagal menyetujui Purchase Order');
      }
    } catch (err) {
      tampil('error', 'Tidak dapat terhubung ke server');
    }
    setProsesId(null);
  }

  function bukaTolak(po: PO) {
    setTolakTarget(po);
    setAlasan('');
    setPesanTolak('');
  }

  function tutupTolak() {
    if (prosesId !== null) return;
    setTolakTarget(null);
  }

  async function kirimTolak() {
    if (!tolakTarget) return;
    setProsesId(tolakTarget.id);
    setPesanTolak('');
    try {
      const res = await fetch(`${API_URL}/purchase-orders/${tolakTarget.id}/tolak`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ alasan }),
      });
      const data = await res.json();

      if (res.ok) {
        const nomor = nomorPO(tolakTarget);
        setTolakTarget(null);
        tampil('sukses', `${nomor} ditolak. Stok tidak berubah.`);
        await fetchPOs();
      } else {
        setPesanTolak(data.error || 'Gagal menolak Purchase Order');
      }
    } catch (err) {
      setPesanTolak('Tidak dapat terhubung ke server');
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
    if (status === 'selesai') return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold px-3 py-1 rounded-full">Selesai</span>;
    if (status === 'ditolak') return <span className="bg-red-100 text-red-800 border border-red-300 text-sm font-bold px-3 py-1 rounded-full">Ditolak</span>;
    return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-sm font-bold px-3 py-1 rounded-full">Menunggu</span>;
  }

  function Thumbnail({ gambar }: { gambar: string | null }) {
    if (gambar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${API_URL}${gambar}`}
          alt=""
          className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200 cursor-zoom-in shrink-0"
          onClick={() => setZoomUrl(`${API_URL}${gambar}`)}
        />
      );
    }
    return (
      <div className="w-11 h-11 rounded-xl bg-[#E8EEFC] border-2 border-[#1E3A8A]/30 flex items-center justify-center text-[#1E3A8A] shrink-0">
        <Package className="w-5 h-5" />
      </div>
    );
  }

  const jumlahMenunggu = pos.filter((p) => p.status === 'pending').length;
  const jumlahDitolak = pos.filter((p) => p.status === 'ditolak').length;
  const jumlahSelesai = pos.filter((p) => p.status === 'selesai').length;
  const nilaiBerjalan = pos.filter((p) => p.status === 'pending').reduce((total, p) => total + p.jumlah * Number(p.harga || 0), 0);

  const daftarSesuaiTab =
    tab === 'menunggu'
      ? pos.filter((p) => p.status === 'pending')
      : tab === 'ditolak'
        ? pos.filter((p) => p.status === 'ditolak')
        : pos;

  const daftarTersaring = daftarSesuaiTab.filter((po) => {
    if (searchText === '') return true;
    return po.nama.toLowerCase().includes(searchText.toLowerCase()) || po.sku.toLowerCase().includes(searchText.toLowerCase()) || (po.catatan ?? '').toLowerCase().includes(searchText.toLowerCase());
  });

  const kelasTab = (aktif: boolean) =>
    `px-4 py-2 rounded-lg text-base font-semibold transition whitespace-nowrap ${aktif ? 'bg-[#1E3A8A] text-white shadow-sm' : 'text-slate-700 hover:bg-[#E8EEFC]'}`;

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Purchase Order</h1>
          <p className="text-slate-600 text-base">Kelola dan setujui pesanan pembelian inventori bahan dan pasokan gudang.</p>
        </div>

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-4">
            {galat}{' '}
            <button onClick={fetchPOs} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        {notif && (
          <Alert jenis={notif.jenis} onClose={tutup} className="mb-4">
            {notif.pesan}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KartuPO
            label="Menunggu Approval"
            nilai={loading ? '-' : jumlahMenunggu}
            ikon={<Clock className="w-6 h-6 text-[#1E3A8A]" />}
            warnaNilai="text-[#1E3A8A]"
          />

          {/* Kartu nilai: navy penuh sebagai penekanan */}
          <div className="bg-[#1E3A8A] rounded-2xl shadow-sm p-5 min-w-0 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center mb-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Total Nilai Berjalan</p>
            <p className="text-3xl font-bold truncate">{loading ? '-' : formatRupiah(nilaiBerjalan)}</p>
          </div>

          <KartuPO
            label="Total PO Selesai"
            nilai={loading ? '-' : jumlahSelesai}
            ikon={<CheckCircle2 className="w-6 h-6 text-emerald-700" />}
            warnaNilai="text-emerald-700"
            warnaIkon="bg-emerald-100"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="inline-flex bg-white border-2 border-slate-200 rounded-xl p-1 w-fit max-w-full overflow-x-auto">
            <button onClick={() => setTab('menunggu')} className={kelasTab(tab === 'menunggu')}>
              Menunggu Approval ({jumlahMenunggu})
            </button>
            <button onClick={() => setTab('semua')} className={kelasTab(tab === 'semua')}>
              Semua PO ({pos.length})
            </button>
            <button onClick={() => setTab('ditolak')} className={kelasTab(tab === 'ditolak')}>
              Ditolak ({jumlahDitolak})
            </button>
          </div>
          <div className="relative md:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              placeholder="Cari No. PO atau produk..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-white border-2 border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
            />
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 900 }}>
              <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">No. PO</th>
                  <th className="px-5 py-3.5 font-bold">Produk</th>
                  <th className="px-5 py-3.5 font-bold">Tanggal</th>
                  <th className="px-5 py-3.5 font-bold">Jumlah</th>
                  <th className="px-5 py-3.5 font-bold">Total</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-600 text-base">Memuat data...</td></tr>}
                {!loading && daftarTersaring.length === 0 && <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-600 text-base">Tidak ada Purchase Order yang cocok.</td></tr>}
                {daftarTersaring.map((po) => (
                  <tr key={po.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                    <td className="px-5 py-4 font-mono text-base text-slate-700 whitespace-nowrap">{nomorPO(po)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={po.gambar} />
                        <div>
                          <div className="font-semibold text-slate-900 text-base">{po.nama}</div>
                          <div className="text-sm text-slate-500 font-mono">{po.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">{formatWaktu(po.created_at)}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-base">{po.jumlah}</td>
                    <td className="px-5 py-4 text-slate-900 text-base font-semibold whitespace-nowrap">{formatRupiah(po.jumlah * Number(po.harga || 0))}</td>
                    <td className="px-5 py-4">{statusBadge(po.status)}</td>
                    <td className="px-5 py-4">
                      {po.status === 'pending' ? (
                        <div className="flex gap-2 whitespace-nowrap">
                          <button
                            onClick={() => tandaiSelesai(po)}
                            disabled={prosesId === po.id}
                            className="flex items-center gap-1.5 bg-[#1E3A8A] text-white text-base font-semibold px-4 py-2 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50"
                          >
                            {prosesId !== po.id && <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => bukaTolak(po)}
                            disabled={prosesId === po.id}
                            className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 text-base font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDetail(po)}
                          className="flex items-center gap-1.5 border-2 border-slate-300 text-slate-800 text-base font-semibold px-4 py-2 rounded-xl hover:bg-slate-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Lihat</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && (
            <div className="px-5 py-3 border-t-2 border-slate-100 text-base text-slate-600">
              Total {daftarTersaring.length} PO • Menampilkan {daftarTersaring.length} dari {daftarSesuaiTab.length} rekaman
            </div>
          )}
        </div>
      </div>

      {/* Modal detail */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{nomorPO(detail)}</h2>
              <button onClick={() => setDetail(null)} className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-base">
              <div className="flex justify-center mb-2"><Thumbnail gambar={detail.gambar} /></div>
              <div className="flex justify-between"><span className="text-slate-600">Produk</span><span className="font-semibold text-slate-900">{detail.nama}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">SKU</span><span className="font-mono text-slate-800">{detail.sku}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Jumlah</span><span className="font-semibold text-slate-900">{detail.jumlah}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Total Nilai</span><span className="font-semibold text-slate-900">{formatRupiah(detail.jumlah * Number(detail.harga || 0))}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Tanggal Dibuat</span><span className="text-slate-800">{formatWaktu(detail.created_at)}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-600">Status</span>{statusBadge(detail.status)}</div>
              <div><span className="text-slate-600 block mb-1">Catatan</span><p className="text-slate-800">{detail.catatan || '-'}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal tolak */}
      {tolakTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={tutupTolak}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Tolak Purchase Order</h2>
              <button onClick={tutupTolak} className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {pesanTolak && (
                <Alert jenis="error" onClose={() => setPesanTolak('')} className="mb-4">
                  {pesanTolak}
                </Alert>
              )}

              <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 mb-4">
                <Thumbnail gambar={tolakTarget.gambar} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-base truncate">{tolakTarget.nama}</div>
                  <div className="text-sm text-slate-500">
                    {nomorPO(tolakTarget)} • {tolakTarget.jumlah} unit • {formatRupiah(tolakTarget.jumlah * Number(tolakTarget.harga || 0))}
                  </div>
                </div>
              </div>

              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Alasan penolakan <span className="font-normal text-slate-500">(opsional)</span>
              </label>
              <textarea
                rows={3}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Misal: stok masih cukup, harga supplier naik"
                className={`${INPUT_KELAS} mb-2`}
              />
              <p className="text-sm text-slate-500 mb-5">
                PO yang ditolak tidak mengubah stok dan tidak bisa disetujui lagi. Buat PO baru dari AI Insight kalau
                masih dibutuhkan.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={kirimTolak}
                  disabled={prosesId === tolakTarget.id}
                  className="bg-red-600 text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-60"
                >
                  {prosesId === tolakTarget.id ? 'Memproses...' : 'Tolak PO'}
                </button>
                <button
                  onClick={tutupTolak}
                  disabled={prosesId === tolakTarget.id}
                  className="border-2 border-slate-300 text-slate-800 text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition disabled:opacity-60"
                >
                  Batal
                </button>
              </div>
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
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1 transition">
          <X className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}