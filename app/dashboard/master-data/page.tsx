'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  sku: string;
  nama: string;
  kategori: string | null;
  satuan: string | null;
  harga: number;
  gambar: string | null;
  stok_saat_ini: number;
  stok_minimum: number;
};

const BASE_URL = 'http://localhost:3000';

const PRESET_SATUAN = [
  'Pcs', 'Lusin', 'Kodi', 'Gross', 'Rim', 'Pasang',
  'Dus', 'Kotak', 'Karton', 'Pak', 'Bal', 'Sachet', 'Renceng',
  'Kg', 'Gram', 'Ons', 'Liter', 'Ml', 'Meter', 'Cm',
];

type FormState = {
  nama: string;
  kategori: string;
  satuan: string;
  harga: string;
  gambar: string;
  stok_saat_ini: string;
  stok_minimum: string;
};

const FORM_KOSONG: FormState = {
  nama: '', kategori: '', satuan: '', harga: '', gambar: '', stok_saat_ini: '', stok_minimum: '',
};

export default function MasterDataPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSku, setEditingSku] = useState('');
  const [form, setForm] = useState<FormState>(FORM_KOSONG);
  const [pesan, setPesan] = useState('');
  const [uploading, setUploading] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function bukaModalTambah() {
    setForm(FORM_KOSONG);
    setEditingId(null);
    setEditingSku('');
    setPesan('');
    setShowModal(true);
  }

  function bukaModalEdit(p: Product) {
    setEditingId(p.id);
    setEditingSku(p.sku);
    setForm({
      nama: p.nama,
      kategori: p.kategori ?? '',
      satuan: p.satuan ?? '',
      harga: String(p.harga ?? 0),
      gambar: p.gambar ?? '',
      stok_saat_ini: String(p.stok_saat_ini ?? 0),
      stok_minimum: String(p.stok_minimum ?? 0),
    });
    setPesan('');
    setShowModal(true);
  }

  function handleAngkaChange(field: 'harga' | 'stok_saat_ini' | 'stok_minimum', raw: string) {
    let bersih = raw.replace(/[^0-9]/g, '');
    if (bersih.length > 1) bersih = bersih.replace(/^0+/, '') || '0';
    setForm({ ...form, [field]: bersih });
  }

  function formatRibuan(digits: string) {
    if (!digits) return '';
    return Number(digits).toLocaleString('id-ID');
  }

  async function unggahGambar(file: File) {
    setUploading(true);
    setPesan('');
    try {
      const formData = new FormData();
      formData.append('gambar', file);

      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({ ...prev, gambar: data.url }));
      } else {
        setPesan(data.error || 'Gagal mengunggah gambar');
      }
    } catch (err) {
      setPesan('Gagal mengunggah gambar');
    }
    setUploading(false);
  }

  async function simpanProduk() {
    setPesan('');
    const url = editingId ? `${BASE_URL}/products/${editingId}` : `${BASE_URL}/products`;
    const method = editingId ? 'PUT' : 'POST';

    const payload = {
      nama: form.nama,
      kategori: form.kategori,
      satuan: form.satuan,
      harga: Number(form.harga || 0),
      gambar: form.gambar,
      stok_saat_ini: Number(form.stok_saat_ini || 0),
      stok_minimum: Number(form.stok_minimum || 0),
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setShowModal(false);
      fetchProducts();
    } else {
      setPesan(data.error || 'Gagal menyimpan produk');
    }
  }

  async function hapusProduk(id: number) {
    if (!confirm('Yakin hapus produk ini?')) return;
    await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  }

  function cetakBarcode(sku: string) {
    const urlQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(sku)}`;
    const jendela = window.open('', '_blank', 'width=400,height=550');
    if (!jendela) return;
    jendela.document.write(`
      <html>
        <head><title>Barcode ${sku}</title></head>
        <body style="text-align:center; font-family: sans-serif; padding: 24px;">
          <img src="${urlQr}" style="width:250px;height:250px;" onload="window.print()" />
          <p style="font-size:20px; font-weight:bold; margin-top:16px; letter-spacing:1px;">${sku}</p>
          <p style="font-size:12px; color:#888;">Tempel label ini di kemasan produk</p>
        </body>
      </html>
    `);
    jendela.document.close();
  }

  function statusKey(p: Product): 'aman' | 'perlu' | 'menipis' {
    if (p.stok_saat_ini <= p.stok_minimum) return 'menipis';
    if (p.stok_saat_ini <= p.stok_minimum * 1.5) return 'perlu';
    return 'aman';
  }

  function statusBadge(p: Product) {
    const key = statusKey(p);
    if (key === 'menipis') return <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Stok Menipis</span>;
    if (key === 'perlu') return <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Perlu Dipantau</span>;
    return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Aman</span>;
  }

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  }

  function Thumbnail({ gambar, ukuran = 44, bisaDiklik = false }: { gambar: string | null; ukuran?: number; bisaDiklik?: boolean }) {
    if (gambar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${BASE_URL}${gambar}`}
          alt=""
          style={{ width: ukuran, height: ukuran }}
          className={`rounded-lg object-cover border border-slate-200 ${bisaDiklik ? 'cursor-zoom-in' : ''}`}
          onClick={bisaDiklik ? () => setZoomUrl(`${BASE_URL}${gambar}`) : undefined}
        />
      );
    }
    return (
      <div style={{ width: ukuran, height: ukuran }} className="rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0">📦</div>
    );
  }

  const daftarKategori = Array.from(new Set(products.map((p) => p.kategori).filter((k): k is string => !!k)));
  const daftarSatuanGabungan = Array.from(
    new Set([...PRESET_SATUAN, ...products.map((p) => p.satuan).filter((s): s is string => !!s)])
  );

  const produkTersaring = products.filter((p) => {
    const cocokSearch = searchText === '' || p.nama.toLowerCase().includes(searchText.toLowerCase()) || p.sku.toLowerCase().includes(searchText.toLowerCase());
    const cocokKategori = kategoriFilter === '' || p.kategori === kategoriFilter;
    const cocokStatus = statusFilter === '' || statusKey(p) === statusFilter;
    return cocokSearch && cocokKategori && cocokStatus;
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Master Data Inventory</h1>
            <p className="text-slate-500 text-sm md:text-base">Kelola data produk dan pantau status stok gudang</p>
          </div>
          <button onClick={bukaModalTambah} className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition w-fit">
            + Tambah Produk
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            placeholder="Cari nama produk atau SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Kategori</option>
            {daftarKategori.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Status</option>
            <option value="aman">Aman</option>
            <option value="perlu">Perlu Dipantau</option>
            <option value="menipis">Stok Menipis</option>
          </select>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1000 }}>
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Satuan</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Stok</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produkTersaring.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={p.gambar} bisaDiklik />
                        <div>
                          <div className="font-medium text-slate-900">{p.nama}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{p.kategori || '-'}</td>
                    <td className="px-5 py-3 text-slate-600">{p.satuan || '-'}</td>
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{formatRupiah(p.harga || 0)}</td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{p.stok_saat_ini}</td>
                    <td className="px-5 py-3">{statusBadge(p)}</td>
                    <td className="px-5 py-3 flex gap-3 whitespace-nowrap">
                      <button onClick={() => bukaModalEdit(p)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                      <button onClick={() => cetakBarcode(p.sku)} className="text-slate-600 hover:text-slate-900 font-medium text-sm">🏷️ Barcode</button>
                      <button onClick={() => hapusProduk(p.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Hapus</button>
                    </td>
                  </tr>
                ))}
                {produkTersaring.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Tidak ada produk yang cocok dengan pencarian/filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="text-xs font-medium text-slate-500 mb-2 block">Foto Produk</label>
                <div className="flex items-center gap-4">
                  <Thumbnail gambar={form.gambar} ukuran={72} />
                  <div>
                    <label className="inline-block bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-200 transition">
                      {uploading ? 'Mengunggah...' : 'Pilih Foto'}
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) unggahGambar(file);
                        }}
                      />
                    </label>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, atau WEBP, maks 2MB</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Kode SKU</label>
                <div className="w-full border border-dashed border-slate-300 rounded-lg px-3 py-2 text-slate-500 bg-slate-50 text-sm">
                  {editingId ? editingSku : 'Akan dibuat otomatis oleh sistem setelah disimpan'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Nama Produk</label>
                  <input
                    placeholder="Contoh: Kabel HDMI"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Kategori (pilih atau ketik baru)</label>
                  <input
                    list="daftar-kategori-input"
                    placeholder="Contoh: Aksesoris"
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="daftar-kategori-input">
                    {daftarKategori.map((k) => <option key={k} value={k} />)}
                  </datalist>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Satuan (pilih atau ketik baru)</label>
                  <input
                    list="daftar-satuan-input"
                    placeholder="Contoh: Pcs, Kg, Dus"
                    value={form.satuan}
                    onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="daftar-satuan-input">
                    {daftarSatuanGabungan.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Harga per Unit (Rp)</label>
                  <input
                    type="text" inputMode="numeric"
                    placeholder="0"
                    value={formatRibuan(form.harga)}
                    onChange={(e) => handleAngkaChange('harga', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Stok Saat Ini</label>
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    placeholder="0"
                    value={form.stok_saat_ini}
                    onChange={(e) => handleAngkaChange('stok_saat_ini', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Stok Minimum (batas peringatan)</label>
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    placeholder="0"
                    value={form.stok_minimum}
                    onChange={(e) => handleAngkaChange('stok_minimum', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {pesan && <p className="text-red-600 mb-3 text-sm font-medium">{pesan}</p>}

              <div className="flex gap-3">
                <button onClick={simpanProduk} disabled={uploading} className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  {editingId ? 'Update Produk' : 'Tambah Produk'}
                </button>
                <button onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-200 transition">Batal</button>
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
        <button onClick={onClose} className="absolute -top-10 right-0 text-white text-2xl leading-none">✕</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}