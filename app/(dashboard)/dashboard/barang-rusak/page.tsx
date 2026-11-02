'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Package, Plus, RotateCcw, Trash2, Wallet, X } from 'lucide-react';
import { Alert, useNotifikasi } from '@/components/ui/Alert';

type Product = {
  id: number;
  sku: string;
  nama: string;
  kategori: string | null;
  satuan: string | null;
  harga: number;
  gambar: string | null;
  stok_saat_ini: number;
  stok_rusak: number;
  stok_minimum: number;
};

type Transaksi = {
  id: number;
  nama: string;
  sku: string;
  gambar: string | null;
  tipe: string;
  jumlah: number;
  catatan: string | null;
  created_at: string;
  nama_staf: string;
};

type Mode = 'pisah' | 'pulih' | 'afkir';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const INPUT_KELAS =
  'w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30';

const ALASAN = [
  'Tidak berfungsi / mati',
  'Cacat produksi',
  'Rusak saat pengiriman',
  'Rusak saat penyimpanan',
  'Kedaluwarsa',
  'Lainnya (jelaskan di catatan)',
];

const TIPE_BARU: Record<Mode, string> = {
  pisah: 'rusak',
  pulih: 'pulih_rusak',
  afkir: 'buang_rusak',
};

const INFO_TIPE: Record<string, { label: string; kelas: string }> = {
  rusak: { label: 'Pisah Rusak', kelas: 'bg-violet-100 text-violet-800 border-violet-300' },
  buang_rusak: { label: 'Afkir', kelas: 'bg-slate-200 text-slate-800 border-slate-400' },
  pulih_rusak: { label: 'Dipulihkan', kelas: 'bg-sky-100 text-sky-800 border-sky-300' },
};

const JUDUL_MODAL: Record<Mode, string> = {
  pisah: 'Pisahkan Barang Rusak',
  pulih: 'Pulihkan ke Stok Layak',
  afkir: 'Afkir Barang Rusak',
};

function formatRupiah(angka: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka);
}

function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Thumbnail({ gambar, ukuran = 44 }: { gambar: string | null; ukuran?: number }) {
  if (gambar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${API_URL}${gambar}`}
        alt=""
        style={{ width: ukuran, height: ukuran }}
        className="rounded-xl object-cover border-2 border-slate-200 shrink-0"
      />
    );
  }
  return (
    <div
      style={{ width: ukuran, height: ukuran }}
      className="rounded-xl bg-[#E8EEFC] border-2 border-[#1E3A8A]/30 flex items-center justify-center text-[#1E3A8A] shrink-0"
    >
      <Package size={Math.round(ukuran * 0.45)} />
    </div>
  );
}

export default function BarangRusakPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');

  const [mode, setMode] = useState<Mode | null>(null);
  const [produkDipilih, setProdukDipilih] = useState<Product | null>(null);
  const [skuPilihan, setSkuPilihan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [alasan, setAlasan] = useState(ALASAN[0]);
  const [catatan, setCatatan] = useState('');
  const [pesanModal, setPesanModal] = useState('');
  const [memproses, setMemproses] = useState(false);

  const { notif, tampil, tutup } = useNotifikasi();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  function keLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nama');
    window.location.href = '/login';
  }

  async function muatData() {
    setLoading(true);
    setGalat('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resProduk, resTransaksi] = await Promise.all([
        fetch(`${API_URL}/products`, { headers }),
        fetch(`${API_URL}/transactions/recent`, { headers }),
      ]);

      if ([resProduk, resTransaksi].some((r) => r.status === 401)) {
        keLogin();
        return;
      }

      const dataProduk = await resProduk.json();
      const dataTransaksi = await resTransaksi.json();

      if (!resProduk.ok) {
        setGalat(dataProduk.error || 'Gagal memuat data produk');
      } else {
        setProducts(Array.isArray(dataProduk) ? dataProduk : []);
      }
      setTransaksi(Array.isArray(dataTransaksi) ? dataTransaksi : []);
    } catch (err) {
      console.error('Gagal memuat data barang rusak:', err);
      setGalat('Gagal terhubung ke server. Periksa koneksi lalu coba lagi.');
    }
    setLoading(false);
  }

  useEffect(() => {
    muatData();
  }, []);

  const produkRusak = products.filter((p) => Number(p.stok_rusak ?? 0) > 0);
  const totalUnitRusak = produkRusak.reduce((t, p) => t + Number(p.stok_rusak), 0);
  const kerugian = produkRusak.reduce(
    (t, p) => t + Number(p.stok_rusak) * Number(p.harga || 0),
    0,
  );
  const produkBisaDipisah = products
    .filter((p) => p.stok_saat_ini > 0)
    .sort((a, b) => a.nama.localeCompare(b.nama));

  const aktivitas = transaksi.filter((t) => INFO_TIPE[t.tipe]).slice(0, 8);

  // Produk yang sedang dikerjakan di dalam modal
  const produkAktif =
    mode === 'pisah'
      ? products.find((p) => p.sku === skuPilihan) ?? null
      : produkDipilih;

  const maksimal = produkAktif
    ? mode === 'pisah'
      ? produkAktif.stok_saat_ini
      : Number(produkAktif.stok_rusak)
    : 0;

  function bukaModal(m: Mode, produk?: Product) {
    setMode(m);
    setProdukDipilih(produk ?? null);
    setSkuPilihan('');
    setJumlah('');
    setAlasan(ALASAN[0]);
    setCatatan('');
    setPesanModal('');
  }

  function tutupModal() {
    if (memproses) return;
    setMode(null);
    setProdukDipilih(null);
  }

  async function kirim() {
    if (!mode) return;
    setPesanModal('');

    if (!produkAktif) {
      setPesanModal('Pilih produk terlebih dahulu');
      return;
    }

    const angka = Number(jumlah);
    if (!Number.isInteger(angka) || angka <= 0) {
      setPesanModal('Jumlah harus berupa angka bulat lebih dari 0');
      return;
    }
    if (angka > maksimal) {
      setPesanModal(
        mode === 'pisah'
          ? `Stok layak hanya ${maksimal} unit`
          : `Stok rusak hanya ${maksimal} unit`,
      );
      return;
    }

    let teksCatatan = catatan.trim();
    if (mode === 'pisah') {
      if (alasan.startsWith('Lainnya') && !teksCatatan) {
        setPesanModal('Jelaskan kondisi barang pada kolom catatan');
        return;
      }
      teksCatatan = teksCatatan ? `${alasan} — ${teksCatatan}` : alasan;
    }

    setMemproses(true);
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sku: produkAktif.sku,
          tipe: TIPE_BARU[mode],
          jumlah: angka,
          catatan: teksCatatan || null,
        }),
      });

      if (res.status === 401) {
        keLogin();
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const nama = produkAktif.nama;
        setMode(null);
        setProdukDipilih(null);
        tampil(
          'sukses',
          mode === 'pisah'
            ? `${angka} unit "${nama}" dipisahkan ke barang rusak`
            : mode === 'pulih'
              ? `${angka} unit "${nama}" dikembalikan ke stok layak`
              : `${angka} unit "${nama}" diafkir dan dihapus dari stok rusak`,
        );
        muatData();
      } else {
        setPesanModal(data.error || 'Gagal menyimpan transaksi');
      }
    } catch (err) {
      setPesanModal('Terjadi kesalahan koneksi ke server');
    }
    setMemproses(false);
  }

  const tombolKelas =
    mode === 'afkir'
      ? 'bg-red-600 hover:bg-red-700'
      : mode === 'pulih'
        ? 'bg-sky-700 hover:bg-sky-800'
        : 'bg-violet-700 hover:bg-violet-800';

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Barang Rusak</h1>
            <p className="text-slate-600 text-base">
              Karantina dan sortir barang cacat, terpisah dari stok layak
            </p>
          </div>
          <button
            onClick={() => bukaModal('pisah')}
            className="flex items-center gap-2 bg-violet-700 text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-violet-800 transition shadow-sm w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Pisahkan Barang Rusak</span>
          </button>
        </div>

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-4">
            {galat}{' '}
            <button onClick={muatData} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        {notif && (
          <Alert jenis={notif.jenis} onClose={tutup} className="mb-4">
            {notif.pesan}
          </Alert>
        )}

        {/* Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
              <AlertTriangle size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Total Unit Rusak</p>
            <p className="text-3xl font-bold text-violet-800">{loading ? '-' : totalUnitRusak}</p>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="w-12 h-12 rounded-xl bg-[#E8EEFC] text-[#1E3A8A] flex items-center justify-center mb-3">
              <Package size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Produk Terdampak</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '-' : produkRusak.length}</p>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Wallet size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Estimasi Kerugian</p>
            <p className="text-2xl md:text-3xl font-bold text-red-700 truncate">
              {loading ? '-' : formatRupiah(kerugian)}
            </p>
          </div>
        </div>

        {/* Karantina */}
        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
          Area Karantina &amp; Tersortir
        </h2>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 820 }}>
              <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Produk</th>
                  <th className="px-5 py-3.5 font-bold">Stok Rusak</th>
                  <th className="px-5 py-3.5 font-bold">Stok Layak</th>
                  <th className="px-5 py-3.5 font-bold">Estimasi Kerugian</th>
                  <th className="px-5 py-3.5 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-base">
                      Memuat data...
                    </td>
                  </tr>
                )}
                {!loading && produkRusak.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-600 text-base">
                      Tidak ada barang rusak. Gudang dalam kondisi bersih.
                    </td>
                  </tr>
                )}
                {produkRusak.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={p.gambar} />
                        <div>
                          <div className="font-semibold text-slate-900 text-base">{p.nama}</div>
                          <div className="text-sm text-slate-500 font-mono">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-violet-100 text-violet-800 border border-violet-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {Number(p.stok_rusak)} {p.satuan || 'unit'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-base">{p.stok_saat_ini}</td>
                    <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">
                      {formatRupiah(Number(p.stok_rusak) * Number(p.harga || 0))}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 whitespace-nowrap">
                        <button
                          onClick={() => bukaModal('pulih', p)}
                          className="flex items-center gap-1.5 border-2 border-sky-300 text-sky-800 hover:bg-sky-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          <RotateCcw className="w-4 h-4" /> Pulihkan
                        </button>
                        <button
                          onClick={() => bukaModal('afkir', p)}
                          className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" /> Afkir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aktivitas terbaru */}
        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
          Aktivitas Karantina Terbaru
        </h2>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 760 }}>
              <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Waktu</th>
                  <th className="px-5 py-3.5 font-bold">Produk</th>
                  <th className="px-5 py-3.5 font-bold">Tindakan</th>
                  <th className="px-5 py-3.5 font-bold">Jumlah</th>
                  <th className="px-5 py-3.5 font-bold">Oleh</th>
                  <th className="px-5 py-3.5 font-bold">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {!loading && aktivitas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-600 text-base">
                      Belum ada aktivitas barang rusak.
                    </td>
                  </tr>
                )}
                {aktivitas.map((t) => (
                  <tr key={t.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                    <td className="px-5 py-3.5 text-slate-700 text-base whitespace-nowrap">
                      {formatWaktu(t.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 text-base">{t.nama}</div>
                      <div className="text-sm text-slate-500 font-mono">{t.sku}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`${INFO_TIPE[t.tipe].kelas} border text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap`}
                      >
                        {INFO_TIPE[t.tipe].label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 text-base">{t.jumlah}</td>
                    <td className="px-5 py-3.5 text-slate-800 text-base whitespace-nowrap">{t.nama_staf}</td>
                    <td className="px-5 py-3.5 text-slate-700 text-base">{t.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal pisah / pulih / afkir */}
      {mode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={tutupModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{JUDUL_MODAL[mode]}</h2>
              <button
                onClick={tutupModal}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Alert selalu di atas isian form */}
              {pesanModal && (
                <Alert jenis="error" onClose={() => setPesanModal('')} className="mb-5">
                  {pesanModal}
                </Alert>
              )}

              {mode === 'afkir' && (
                <Alert jenis="peringatan" judul="Tindakan ini tidak bisa dibatalkan" className="mb-5">
                  Barang yang diafkir dihapus dari stok rusak dan dianggap dibuang.
                </Alert>
              )}

              {mode === 'pisah' ? (
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Produk</label>
                  <select
                    value={skuPilihan}
                    onChange={(e) => setSkuPilihan(e.target.value)}
                    className={INPUT_KELAS}
                  >
                    <option value="">Pilih produk...</option>
                    {produkBisaDipisah.map((p) => (
                      <option key={p.id} value={p.sku}>
                        {p.nama} ({p.sku}) — layak {p.stok_saat_ini}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                produkAktif && (
                  <div className="mb-4 flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl p-3">
                    <Thumbnail gambar={produkAktif.gambar} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-base truncate">
                        {produkAktif.nama}
                      </div>
                      <div className="text-sm text-slate-500 font-mono">{produkAktif.sku}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-bold text-violet-800">
                        Rusak: {Number(produkAktif.stok_rusak)}
                      </div>
                      <div className="font-semibold text-emerald-700">
                        Layak: {produkAktif.stok_saat_ini}
                      </div>
                    </div>
                  </div>
                )
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-slate-700">Jumlah</label>
                  {produkAktif && (
                    <button
                      type="button"
                      onClick={() => setJumlah(String(maksimal))}
                      className="text-sm font-semibold text-[#1E3A8A] hover:underline"
                    >
                      Isi maksimal ({maksimal})
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value.replace(/[^0-9]/g, ''))}
                  className={INPUT_KELAS}
                />
              </div>

              {mode === 'pisah' && (
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Kondisi / alasan kerusakan
                  </label>
                  <select
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    className={INPUT_KELAS}
                  >
                    {ALASAN.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">
                  {mode === 'pisah' ? 'Catatan tambahan' : 'Catatan'}{' '}
                  {!(mode === 'pisah' && alasan.startsWith('Lainnya')) && (
                    <span className="font-normal text-slate-500">(opsional)</span>
                  )}
                </label>
                <input
                  placeholder="Misal: ditemukan saat pengecekan rak C"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className={INPUT_KELAS}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={kirim}
                  disabled={memproses}
                  className={`text-white text-base font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-60 ${tombolKelas}`}
                >
                  {memproses
                    ? 'Memproses...'
                    : mode === 'pisah'
                      ? 'Pisahkan'
                      : mode === 'pulih'
                        ? 'Pulihkan'
                        : 'Afkir'}
                </button>
                <button
                  onClick={tutupModal}
                  disabled={memproses}
                  className="border-2 border-slate-300 text-slate-800 text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition disabled:opacity-60"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}