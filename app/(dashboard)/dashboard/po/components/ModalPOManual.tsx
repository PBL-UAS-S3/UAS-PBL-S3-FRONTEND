'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/format';
import { INPUT_KELAS } from '@/lib/ui';

type ProdukPilihan = {
  sku: string;
  nama: string;
  harga: number | string;
  stok_saat_ini: number;
};

type Props = {
  memproses: boolean;
  // mengembalikan pesan error, atau null kalau berhasil
  onSimpan: (data: { sku: string; jumlah: number; catatan: string }) => Promise<string | null>;
  onTutup: () => void;
};

const BATAS_OPSI = 50;

export function ModalPOManual({ memproses, onSimpan, onTutup }: Props) {
  const [produk, setProduk] = useState<ProdukPilihan[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [cari, setCari] = useState('');
  const [sku, setSku] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [catatan, setCatatan] = useState('');
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    async function muat() {
      const res = await api<ProdukPilihan[]>('/products');
      if (res.sesiHabis) return;
      if (res.ok && Array.isArray(res.data)) {
        setProduk(res.data);
      } else {
        setPesan('Gagal memuat daftar produk');
      }
      setMemuat(false);
    }
    muat();
  }, []);

  const terpilih = produk.find((p) => p.sku === sku) || null;

  const opsi = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const hasil = (
      q === ''
        ? produk
        : produk.filter(
            (p) => p.nama.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
          )
    ).slice(0, BATAS_OPSI);
    // produk yang sedang dipilih tetap tampil walau tidak cocok dengan pencarian
    if (terpilih && !hasil.some((p) => p.sku === terpilih.sku)) return [terpilih, ...hasil];
    return hasil;
  }, [produk, cari, terpilih]);

  const jumlahAngka = Number(jumlah);
  const jumlahValid = Number.isInteger(jumlahAngka) && jumlahAngka > 0;
  const estimasi = terpilih && jumlahValid ? jumlahAngka * Number(terpilih.harga || 0) : 0;

  function tutup() {
    if (!memproses) onTutup();
  }

  async function kirim() {
    setPesan('');
    if (!sku) {
      setPesan('Pilih produk terlebih dahulu');
      return;
    }
    if (!jumlahValid) {
      setPesan('Jumlah harus berupa bilangan bulat lebih dari 0');
      return;
    }
    const galat = await onSimpan({
      sku,
      jumlah: jumlahAngka,
      catatan: catatan.trim() ? `PO manual: ${catatan.trim()}` : 'PO manual',
    });
    if (galat) setPesan(galat);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={tutup}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Buat PO Manual</h2>
          <button
            onClick={tutup}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {pesan && (
            <Alert jenis="error" onClose={() => setPesan('')} className="mb-4">
              {pesan}
            </Alert>
          )}

          <label className="text-sm font-semibold text-slate-700 mb-1 block">Cari produk</label>
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Ketik nama atau SKU..."
            className={`${INPUT_KELAS} mb-3`}
            disabled={memuat}
          />

          <label className="text-sm font-semibold text-slate-700 mb-1 block">Produk</label>
          <select
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className={`${INPUT_KELAS} mb-1`}
            disabled={memuat}
          >
            <option value="">{memuat ? 'Memuat produk...' : 'Pilih produk'}</option>
            {opsi.map((p) => (
              <option key={p.sku} value={p.sku}>
                {p.nama} ({p.sku})
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mb-4">
            Menampilkan maksimal {BATAS_OPSI} produk. Persempit dengan kolom pencarian.
          </p>

          {terpilih && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3 mb-4 text-sm text-slate-700">
              Stok saat ini: <b>{terpilih.stok_saat_ini}</b> • Harga satuan:{' '}
              <b>{formatRupiah(Number(terpilih.harga || 0))}</b>
            </div>
          )}

          <label className="text-sm font-semibold text-slate-700 mb-1 block">Jumlah pesanan</label>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            placeholder="Contoh: 50"
            className={`${INPUT_KELAS} mb-3`}
          />

          <label className="text-sm font-semibold text-slate-700 mb-1 block">
            Catatan <span className="font-normal text-slate-500">(opsional)</span>
          </label>
          <textarea
            rows={2}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Misal: pesanan khusus dari supplier A"
            className={`${INPUT_KELAS} mb-3`}
          />

          {estimasi > 0 && (
            <p className="text-base text-slate-800 mb-4">
              Estimasi total: <b>{formatRupiah(estimasi)}</b>
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={kirim}
              disabled={memproses || memuat}
              className="bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-60"
            >
              {memproses ? 'Menyimpan...' : 'Buat PO'}
            </button>
            <button
              onClick={tutup}
              disabled={memproses}
              className="border-2 border-slate-300 text-slate-800 text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition disabled:opacity-60"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}