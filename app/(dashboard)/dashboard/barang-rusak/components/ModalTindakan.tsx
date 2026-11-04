'use client';

import { X } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { INPUT_KELAS } from '@/lib/ui';
import type { Product } from '@/types/produk';
import { ALASAN, JUDUL_MODAL } from '../constants';
import type { useTindakan } from '../hooks/useTindakan';

export function ModalTindakan({
  t,
  produkBisaDipisah,
}: {
  t: ReturnType<typeof useTindakan>;
  produkBisaDipisah: Product[];
}) {
  if (!t.mode) return null;
  const mode = t.mode;
  const aktif = t.produkAktif;

  const tombolKelas =
    mode === 'afkir'
      ? 'bg-red-600 hover:bg-red-700'
      : mode === 'pulih'
        ? 'bg-sky-700 hover:bg-sky-800'
        : 'bg-violet-700 hover:bg-violet-800';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={t.tutup}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{JUDUL_MODAL[mode]}</h2>
          <button
            onClick={t.tutup}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Alert selalu di atas isian form */}
          {t.pesan && (
            <Alert jenis="error" onClose={() => t.setPesan('')} className="mb-5">
              {t.pesan}
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
                value={t.skuPilihan}
                onChange={(e) => t.setSkuPilihan(e.target.value)}
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
            aktif && (
              <div className="mb-4 flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl p-3">
                <Thumbnail gambar={aktif.gambar} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-base truncate">{aktif.nama}</div>
                  <div className="text-sm text-slate-500 font-mono">{aktif.sku}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-bold text-violet-800">Rusak: {Number(aktif.stok_rusak)}</div>
                  <div className="font-semibold text-emerald-700">Layak: {aktif.stok_saat_ini}</div>
                </div>
              </div>
            )
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-slate-700">Jumlah</label>
              {aktif && (
                <button
                  type="button"
                  onClick={() => t.setJumlah(String(t.maksimal))}
                  className="text-sm font-semibold text-[#1E3A8A] hover:underline"
                >
                  Isi maksimal ({t.maksimal})
                </button>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={t.jumlah}
              onChange={(e) => t.setJumlah(e.target.value.replace(/[^0-9]/g, ''))}
              className={INPUT_KELAS}
            />
          </div>

          {mode === 'pisah' && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Kondisi / alasan kerusakan
              </label>
              <select
                value={t.alasan}
                onChange={(e) => t.setAlasan(e.target.value)}
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
              {!(mode === 'pisah' && t.alasan.startsWith('Lainnya')) && (
                <span className="font-normal text-slate-500">(opsional)</span>
              )}
            </label>
            <input
              placeholder="Misal: ditemukan saat pengecekan rak C"
              value={t.catatan}
              onChange={(e) => t.setCatatan(e.target.value)}
              className={INPUT_KELAS}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={t.kirim}
              disabled={t.memproses}
              className={`text-white text-base font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-60 ${tombolKelas}`}
            >
              {t.memproses
                ? 'Memproses...'
                : mode === 'pisah'
                  ? 'Pisahkan'
                  : mode === 'pulih'
                    ? 'Pulihkan'
                    : 'Afkir'}
            </button>
            <button
              onClick={t.tutup}
              disabled={t.memproses}
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