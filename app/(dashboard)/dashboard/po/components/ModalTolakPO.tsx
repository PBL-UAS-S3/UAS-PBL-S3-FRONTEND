'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatRupiah } from '@/lib/format';
import { INPUT_KELAS } from '@/lib/ui';
import type { PO } from '../types';
import { nomorPO, totalPO } from '../helpers';

export function ModalTolakPO({
  po,
  memproses,
  onTolak,
  onTutup,
}: {
  po: PO;
  memproses: boolean;
  // mengembalikan pesan error, atau null kalau berhasil
  onTolak: (alasan: string) => Promise<string | null>;
  onTutup: () => void;
}) {
  const [alasan, setAlasan] = useState('');
  const [pesan, setPesan] = useState('');

  function tutup() {
    if (!memproses) onTutup();
  }

  async function kirim() {
    setPesan('');
    const galat = await onTolak(alasan);
    if (galat) setPesan(galat);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={tutup}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Tolak Purchase Order</h2>
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

          <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 mb-4">
            <Thumbnail gambar={po.gambar} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 text-base truncate">{po.nama}</div>
              <div className="text-sm text-slate-500">
                {nomorPO(po)} • {po.jumlah} unit • {formatRupiah(totalPO(po))}
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
            PO yang ditolak tidak mengubah stok dan tidak bisa disetujui lagi. Buat PO baru dari AI
            Insight kalau masih dibutuhkan.
          </p>

          <div className="flex gap-3">
            <button
              onClick={kirim}
              disabled={memproses}
              className="bg-red-600 text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-60"
            >
              {memproses ? 'Memproses...' : 'Tolak PO'}
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