"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  QrCode,
  Pencil,
  Trash2,
  Package,
  Upload,
  Download,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Alert, DialogKonfirmasi, useNotifikasi } from "../../components/alert";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const ITEM_PER_HALAMAN = 10;

const PRESET_SATUAN = [
  "Pcs",
  "Lusin",
  "Kodi",
  "Gross",
  "Rim",
  "Pasang",
  "Dus",
  "Kotak",
  "Karton",
  "Pak",
  "Bal",
  "Sachet",
  "Renceng",
  "Kg",
  "Gram",
  "Ons",
  "Liter",
  "Ml",
  "Meter",
  "Cm",
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
  nama: "",
  kategori: "",
  satuan: "",
  harga: "",
  gambar: "",
  stok_saat_ini: "",
  stok_minimum: "",
};

const INPUT_KELAS =
  "w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30";

const SELECT_KELAS =
  "bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30";

type StatusKey = "aman" | "menipis" | "habis";

// Sama dengan aplikasi mobile: Habis, Menipis, Aman (dihitung dari stok layak saja)
function statusKey(p: Product): StatusKey {
  if (p.stok_saat_ini <= 0) return "habis";
  if (p.stok_saat_ini <= p.stok_minimum) return "menipis";
  return "aman";
}

function rusakDari(p: Product): number {
  return Number(p.stok_rusak ?? 0);
}

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
        Menampilkan{" "}
        <b className="text-slate-800">
          {awal}–{akhir}
        </b>{" "}
        dari <b className="text-slate-800">{totalData}</b> data
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onGanti(halamanAktif - 1)}
          disabled={halamanAktif === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-[#E8EEFC] hover:border-[#1E3A8A] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-300 transition"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onGanti(p)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
              p === halamanAktif
                ? "bg-[#1E3A8A] text-white shadow-sm"
                : "border-2 border-slate-300 text-slate-700 hover:bg-[#E8EEFC] hover:border-[#1E3A8A]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onGanti(halamanAktif + 1)}
          disabled={halamanAktif === totalHalaman}
          className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-[#E8EEFC] hover:border-[#1E3A8A] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-300 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function MasterDataPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSku, setEditingSku] = useState("");
  const [editingRusak, setEditingRusak] = useState(0);
  const [form, setForm] = useState<FormState>(FORM_KOSONG);
  const [pesan, setPesan] = useState("");
  const [uploading, setUploading] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);
  const [hapusTarget, setHapusTarget] = useState<Product | null>(null);
  const [menghapus, setMenghapus] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [halamanAktif, setHalamanAktif] = useState(1);

  const { notif, tampil, tutup } = useNotifikasi();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("nama");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      tampil("error", "Gagal memuat data produk. Periksa koneksi ke server.");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setHalamanAktif(1);
  }, [searchText, kategoriFilter, statusFilter]);

  function bukaModalTambah() {
    setForm(FORM_KOSONG);
    setEditingId(null);
    setEditingSku("");
    setEditingRusak(0);
    setPesan("");
    setShowModal(true);
  }

  function bukaModalEdit(p: Product) {
    setEditingId(p.id);
    setEditingSku(p.sku);
    setEditingRusak(rusakDari(p));
    setForm({
      nama: p.nama,
      kategori: p.kategori ?? "",
      satuan: p.satuan ?? "",
      harga: String(p.harga ?? 0),
      gambar: p.gambar ?? "",
      stok_saat_ini: String(p.stok_saat_ini ?? 0),
      stok_minimum: String(p.stok_minimum ?? 0),
    });
    setPesan("");
    setShowModal(true);
  }

  function handleAngkaChange(
    field: "harga" | "stok_saat_ini" | "stok_minimum",
    raw: string,
  ) {
    let bersih = raw.replace(/[^0-9]/g, "");
    if (bersih.length > 1) bersih = bersih.replace(/^0+/, "") || "0";
    setForm({ ...form, [field]: bersih });
  }

  function formatRibuan(digits: string) {
    if (!digits) return "";
    return Number(digits).toLocaleString("id-ID");
  }

  async function unggahGambar(file: File) {
    setUploading(true);
    setPesan("");
    try {
      const formData = new FormData();
      formData.append("gambar", file);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({ ...prev, gambar: data.url }));
      } else {
        setPesan(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      setPesan("Gagal mengunggah gambar");
    }
    setUploading(false);
  }

  async function simpanProduk() {
    setPesan("");

    if (!form.nama || form.nama.trim().length < 3) {
      setPesan("Nama produk wajib diisi (minimal 3 karakter)");
      return;
    }
    if (!form.kategori) {
      setPesan("Kategori produk wajib diisi");
      return;
    }
    if (!form.satuan) {
      setPesan("Satuan produk wajib diisi");
      return;
    }
    if (Number(form.harga || 0) <= 0) {
      setPesan("Harga per unit wajib lebih dari 0");
      return;
    }
    // Saat edit, stok layak boleh 0 (produk yang sudah habis tetap bisa diedit)
    if (!editingId && Number(form.stok_saat_ini || 0) <= 0) {
      setPesan("Stok saat ini wajib lebih dari 0");
      return;
    }
    if (Number(form.stok_minimum || 0) <= 0) {
      setPesan("Stok minimum wajib lebih dari 0");
      return;
    }

    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;
    const method = editingId ? "PUT" : "POST";

    const payload = {
      nama: form.nama,
      kategori: form.kategori,
      satuan: form.satuan,
      harga: Number(form.harga || 0),
      gambar: form.gambar,
      stok_saat_ini: Number(form.stok_saat_ini || 0),
      stok_minimum: Number(form.stok_minimum || 0),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        tampil(
          "sukses",
          editingId
            ? `Produk "${form.nama}" berhasil diperbarui`
            : `Produk "${form.nama}" berhasil ditambahkan`,
        );
        fetchProducts();
      } else {
        setPesan(data.error || "Gagal menyimpan produk");
      }
    } catch (err) {
      setPesan("Terjadi kesalahan koneksi ke server");
    }
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) return;
    setMenghapus(true);
    try {
      const res = await fetch(`${API_URL}/products/${hapusTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        tampil("sukses", `Produk "${hapusTarget.nama}" berhasil dihapus`);
        fetchProducts();
      } else {
        tampil("error", data.error || "Gagal menghapus produk");
      }
    } catch (err) {
      tampil("error", "Terjadi kesalahan koneksi ke server");
    }
    setMenghapus(false);
    setHapusTarget(null);
  }

  async function downloadBarcode(sku: string, nama: string) {
    const urlQr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(sku)}`;

    try {
      const res = await fetch(urlQr);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 480;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 30, 300, 300);

        ctx.textAlign = "center";
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(sku, canvas.width / 2, 365);

        ctx.fillStyle = "#64748b";
        ctx.font = "15px sans-serif";
        ctx.fillText(nama, canvas.width / 2, 395);

        canvas.toBlob((finalBlob) => {
          if (!finalBlob) return;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(finalBlob);
          link.download = `barcode-${sku}.png`;
          link.click();
        });

        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } catch (err) {
      tampil("error", "Gagal membuat file barcode untuk diunduh");
    }
  }

  function statusBadge(p: Product) {
    const key = statusKey(p);
    if (key === "habis")
      return (
        <span className="bg-red-100 text-red-800 border border-red-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Habis
        </span>
      );
    if (key === "menipis")
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Menipis
        </span>
      );
    return (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
        Aman
      </span>
    );
  }

  function formatRupiah(angka: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  }

  function Thumbnail({
    gambar,
    ukuran = 48,
    bisaDiklik = false,
  }: {
    gambar: string | null;
    ukuran?: number;
    bisaDiklik?: boolean;
  }) {
    if (gambar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${API_URL}${gambar}`}
          alt=""
          style={{ width: ukuran, height: ukuran }}
          className={`rounded-xl object-cover border-2 border-slate-200 shrink-0 ${bisaDiklik ? "cursor-zoom-in" : ""}`}
          onClick={
            bisaDiklik ? () => setZoomUrl(`${API_URL}${gambar}`) : undefined
          }
        />
      );
    }
    return (
      <div
        style={{ width: ukuran, height: ukuran }}
        className="rounded-xl bg-[#E8EEFC] border-2 border-[#1E3A8A]/30 flex items-center justify-center text-[#1E3A8A] shrink-0"
      >
        <Package className="w-6 h-6" />
      </div>
    );
  }

  const daftarKategori = Array.from(
    new Set(products.map((p) => p.kategori).filter((k): k is string => !!k)),
  );
  const daftarSatuanGabungan = Array.from(
    new Set([
      ...PRESET_SATUAN,
      ...products.map((p) => p.satuan).filter((s): s is string => !!s),
    ]),
  );

  const produkTersaring = products.filter((p) => {
    const cocokSearch =
      searchText === "" ||
      p.nama.toLowerCase().includes(searchText.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchText.toLowerCase());
    const cocokKategori =
      kategoriFilter === "" || p.kategori === kategoriFilter;
    const cocokStatus =
      statusFilter === "" ||
      (statusFilter === "rusak"
        ? rusakDari(p) > 0
        : statusKey(p) === statusFilter);
    return cocokSearch && cocokKategori && cocokStatus;
  });

  const totalHalaman = Math.max(
    1,
    Math.ceil(produkTersaring.length / ITEM_PER_HALAMAN),
  );
  const produkHalamanIni = produkTersaring.slice(
    (halamanAktif - 1) * ITEM_PER_HALAMAN,
    halamanAktif * ITEM_PER_HALAMAN,
  );

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Master Data Inventory
            </h1>
            <p className="text-slate-600 text-base">
              Kelola data produk dan pantau status stok gudang
            </p>
          </div>
          <button
            onClick={bukaModalTambah}
            className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#172E6E] transition shadow-sm w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Produk</span>
          </button>
        </div>

        {notif && (
          <Alert jenis={notif.jenis} onClose={tutup} className="mb-4">
            {notif.pesan}
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              placeholder="Cari nama produk atau SKU..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-white border-2 border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
            />
          </div>
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className={SELECT_KELAS}
          >
            <option value="">Semua Kategori</option>
            {daftarKategori.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={SELECT_KELAS}
          >
            <option value="">Semua Status</option>
            <option value="aman">Aman</option>
            <option value="menipis">Menipis</option>
            <option value="habis">Habis</option>
            <option value="rusak">Ada stok rusak</option>
          </select>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 1050 }}>
              <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Produk</th>
                  <th className="px-5 py-3.5 font-bold">Kategori</th>
                  <th className="px-5 py-3.5 font-bold">Satuan</th>
                  <th className="px-5 py-3.5 font-bold">Harga</th>
                  <th className="px-5 py-3.5 font-bold">Stok Layak</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produkHalamanIni.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-200 hover:bg-[#F4F7FF] transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Thumbnail gambar={p.gambar} bisaDiklik />
                        <div>
                          <div className="font-semibold text-slate-900 text-base">
                            {p.nama}
                          </div>
                          <div className="text-sm text-slate-500 font-mono">
                            {p.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-800 text-base">
                      {p.kategori || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-800 text-base">
                      {p.satuan || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">
                      {formatRupiah(p.harga || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-base">
                        {p.stok_saat_ini}
                      </div>
                      {rusakDari(p) > 0 && (
                        <span className="inline-block mt-1 bg-violet-100 text-violet-800 border border-violet-300 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          {rusakDari(p)} rusak
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">{statusBadge(p)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 whitespace-nowrap">
                        <button
                          onClick={() => bukaModalEdit(p)}
                          className="flex items-center gap-1.5 border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#E8EEFC] font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBarcodeProduct(p)}
                          className="flex items-center gap-1.5 border-2 border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setHapusTarget(p)}
                          className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {produkTersaring.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-slate-600 text-base"
                    >
                      Tidak ada produk yang cocok dengan pencarian/filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            halamanAktif={halamanAktif}
            totalHalaman={totalHalaman}
            onGanti={setHalamanAktif}
            totalData={produkTersaring.length}
          />
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Alert selalu di atas isian form */}
              {pesan && (
                <Alert jenis="error" onClose={() => setPesan("")} className="mb-5">
                  {pesan}
                </Alert>
              )}

              {editingId && editingRusak > 0 && (
                <Alert jenis="rusak" className="mb-5">
                  Produk ini punya <b>{editingRusak} unit stok rusak</b>. Stok
                  rusak dikelola dari aplikasi mobile dan tidak ikut diubah di
                  sini.
                </Alert>
              )}

              <div className="mb-5">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Foto Produk
                </label>
                <div className="flex items-center gap-4">
                  <Thumbnail gambar={form.gambar} ukuran={80} />
                  <div>
                    <label className="inline-flex items-center gap-2 border-2 border-[#1E3A8A] text-[#1E3A8A] text-base font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#E8EEFC] transition">
                      <Upload className="w-5 h-5" />
                      <span>{uploading ? "Mengunggah..." : "Pilih Foto"}</span>
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
                    <p className="text-sm text-slate-500 mt-1">
                      JPG, PNG, atau WEBP, maks 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">
                  Kode SKU
                </label>
                <div className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-2.5 text-slate-600 bg-slate-50 text-base">
                  {editingId
                    ? editingSku
                    : "Akan dibuat otomatis oleh sistem setelah disimpan"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Nama Produk
                  </label>
                  <input
                    placeholder="Contoh: Kabel HDMI"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className={INPUT_KELAS}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Kategori (pilih atau ketik baru)
                  </label>
                  <input
                    list="daftar-kategori-input"
                    placeholder="Contoh: Aksesoris"
                    value={form.kategori}
                    onChange={(e) =>
                      setForm({ ...form, kategori: e.target.value })
                    }
                    className={INPUT_KELAS}
                  />
                  <datalist id="daftar-kategori-input">
                    {daftarKategori.map((k) => (
                      <option key={k} value={k} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Satuan (pilih atau ketik baru)
                  </label>
                  <input
                    list="daftar-satuan-input"
                    placeholder="Contoh: Pcs, Kg, Dus"
                    value={form.satuan}
                    onChange={(e) =>
                      setForm({ ...form, satuan: e.target.value })
                    }
                    className={INPUT_KELAS}
                  />
                  <datalist id="daftar-satuan-input">
                    {daftarSatuanGabungan.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Harga per Unit (Rp)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={formatRibuan(form.harga)}
                    onChange={(e) => handleAngkaChange("harga", e.target.value)}
                    className={INPUT_KELAS}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Stok Layak Saat Ini
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={form.stok_saat_ini}
                    onChange={(e) =>
                      handleAngkaChange("stok_saat_ini", e.target.value)
                    }
                    className={INPUT_KELAS}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">
                    Stok Minimum (batas peringatan)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={form.stok_minimum}
                    onChange={(e) =>
                      handleAngkaChange("stok_minimum", e.target.value)
                    }
                    className={INPUT_KELAS}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={simpanProduk}
                  disabled={uploading}
                  className="bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50"
                >
                  {editingId ? "Update Produk" : "Tambah Produk"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="border-2 border-slate-300 text-slate-800 text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Barcode */}
      {barcodeProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Barcode Produk
              </h2>
              <button
                onClick={() => setBarcodeProduct(null)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(barcodeProduct.sku)}`}
                alt="QR Code"
                className="w-56 h-56 border-2 border-slate-200 rounded-xl mb-4"
              />
              <p className="text-2xl font-bold text-slate-900 tracking-wide">
                {barcodeProduct.sku}
              </p>
              <p className="text-base text-slate-600 mb-6">
                {barcodeProduct.nama}
              </p>
              <button
                onClick={() =>
                  downloadBarcode(barcodeProduct.sku, barcodeProduct.nama)
                }
                className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition"
              >
                <Download className="w-5 h-5" />
                <span>Download QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <DialogKonfirmasi
        buka={!!hapusTarget}
        judul="Hapus produk ini?"
        pesan={
          hapusTarget
            ? `"${hapusTarget.nama}" (${hapusTarget.sku}) akan dihapus dan tidak bisa dikembalikan.`
            : ""
        }
        labelYa="Ya, hapus"
        memproses={menghapus}
        onYa={konfirmasiHapus}
        onBatal={() => !menghapus && setHapusTarget(null)}
      />

      {zoomUrl && (
        <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />
      )}
    </main>
  );
}

function ModalZoomGambar({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white p-1 hover:text-slate-300 transition"
        >
          <X className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          className="w-full rounded-xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}