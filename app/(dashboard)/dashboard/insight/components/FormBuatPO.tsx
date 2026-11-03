'use client';

import { CheckCircle2 } from 'lucide-react';

type Props = {
  jumlah: string;
  onJumlahChange: (v: string) => void;
  onBuat: () => void;
  loading: boolean;
  berhasil: boolean;
};

export function FormBuatPO({ jumlah, onJumlahChange, onBuat, loading, berhasil }: Props) {
  if (berhasil) {
    return (
      <div className="flex items-center gap-2 text-emerald-700 text-base font-semibold">
        <CheckCircle2 size={18} /> Purchase Order berhasil dibuat
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1 block">
        Jumlah restock (bisa diubah)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={jumlah}
          onChange={(e) => onJumlahChange(e.target.value)}
          className="w-28 bg-white border-2 border-slate-300 rounded-xl px-3 py-2 text-base font-bold text-slate-900 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
        />
        <button
          onClick={onBuat}
          disabled={loading}
          className="flex-1 bg-[#1E3A8A] text-white text-base font-semibold py-2 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50"
        >
          {loading ? 'Membuat PO...' : 'Buat PO'}
        </button>
      </div>
    </div>
  );
}