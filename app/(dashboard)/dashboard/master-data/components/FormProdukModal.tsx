'use client';

import { Upload, X } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { SelectDenganLainnya } from '@/components/ui/SelectDenganLainnya';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { INPUT_KELAS } from '@/lib/ui';
import { formatRibuan } from '../helpers';
import type { useFormProduk } from '../hooks/useFormProduk';

type Props = {
  fp: ReturnType<typeof useFormProduk>;
  daftarKategori: string[];
  daftarSatuan: string[];
};

const KATEGORI_BAWAAN = ['Aksesoris', 'Alat Tulis', 'Elektronik', 'Makanan', 'Minuman', 'Perkakas'];
const SATUAN_BAWAAN = ['pcs', 'box', 'kg', 'pack', 'lusin', 'dus', 'liter', 'meter'];

// Gabungkan nilai dari data produk dengan template bawaan, tanpa duplikat (tidak peka huruf besar/kecil)
function gabung(dariData: string[], bawaan: string[]) {
  const peta = new Map<string, string>();
  for (const x of [...dariData, ...bawaan]) {
    const bersih = (x ?? '').trim();
    if (bersih && !peta.has(bersih.toLowerCase())) peta.set(bersih.toLowerCase(), bersih);
  }
  return [...peta.values()].sort((a, b) => a.localeCompare(b));
}

export function FormProdukModal({ fp, daftarKategori, daftarSatuan }: Props) {
  if (!fp.buka) return null;

  const edit = !!fp.editingId;
  const opsiKategori = gabung(daftarKategori, KATEGORI_BAWAAN);
  const opsiSatuan = gabung(daftarSatuan, SATUAN_BAWAAN);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            {edit ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button
            onClick={fp.tutup}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Alert selalu di atas isian form */}
          {fp.pesan && (
            <Alert jenis="error" onClose={() => fp.setPesan('')} className="mb-5">
              {fp.pesan}
            </Alert>
          )}

          {edit && fp.editingRusak > 0 && (
            <Alert jenis="rusak" className="mb-5">
              Produk ini punya <b>{fp.editingRusak} unit stok rusak</b>. Stok rusak dikelola dari
              aplikasi mobile dan halaman Barang Rusak, tidak diubah di sini.
            </Alert>
          )}

          <div className="mb-5">
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Foto Produk</label>
            <div className="flex items-center gap-4">
              <Thumbnail gambar={fp.form.gambar || null} ukuran={80} />
              <div>
                <label className="inline-flex items-center gap-2 border-2 border-[#1E3A8A] text-[#1E3A8A] text-base font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-[#E8EEFC] transition">
                  <Upload className="w-5 h-5" />
                  <span>{fp.uploading ? 'Mengunggah...' : 'Pilih Foto'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={fp.uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) fp.unggahGambar(file);
                    }}
                  />
                </label>
                <p className="text-sm text-slate-500 mt-1">JPG, PNG, atau WEBP, maks 2MB</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Kode SKU</label>
            <div className="w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-2.5 text-slate-600 bg-slate-50 text-base">
              {edit ? fp.editingSku : 'Akan dibuat otomatis oleh sistem setelah disimpan'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Nama Produk</label>
              <input
                placeholder="Contoh: Kabel HDMI"
                value={fp.form.nama}
                onChange={(e) => fp.ubahTeks('nama', e.target.value)}
                className={INPUT_KELAS}
              />
            </div>

            <SelectDenganLainnya
              label="Kategori"
              value={fp.form.kategori || ''}
              onChange={(v) => fp.ubahTeks('kategori', v)}
              opsi={opsiKategori}
              placeholderKetik="Contoh: Aksesoris"
            />

            <SelectDenganLainnya
              label="Satuan"
              value={fp.form.satuan || ''}
              onChange={(v) => fp.ubahTeks('satuan', v)}
              opsi={opsiSatuan}
              placeholderKetik="Contoh: Pcs, Kg, Dus"
            />

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Harga per Unit (Rp)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatRibuan(fp.form.harga)}
                onChange={(e) => fp.ubahAngka('harga', e.target.value)}
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
                value={fp.form.stok_saat_ini}
                onChange={(e) => fp.ubahAngka('stok_saat_ini', e.target.value)}
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
                value={fp.form.stok_minimum}
                onChange={(e) => fp.ubahAngka('stok_minimum', e.target.value)}
                className={INPUT_KELAS}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fp.simpan}
              disabled={fp.uploading || fp.menyimpan}
              className="bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50"
            >
              {fp.menyimpan ? 'Menyimpan...' : edit ? 'Update Produk' : 'Tambah Produk'}
            </button>
            <button
              onClick={fp.tutup}
              className="border-2 border-slate-300 text-slate-800 text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}