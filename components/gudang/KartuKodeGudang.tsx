'use client';

import { Check, Copy, KeyRound, RefreshCw } from 'lucide-react';

export function KartuKodeGudang({
  kode,
  deskripsi,
  tersalin,
  onSalin,
  onBuatBaru,
  membuat = false,
  children,
}: {
  kode: string;
  deskripsi: React.ReactNode;
  tersalin: boolean;
  onSalin: () => void;
  // kalau diisi, tombol "Buat Kode Baru" muncul
  onBuatBaru?: () => void;
  membuat?: boolean;
  // tempat alert (di atas kotak kode)
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
        <KeyRound size={20} className="text-[#1E3A8A]" /> Kode Gudang
      </h2>
      <p className="text-sm text-slate-500 mb-4">{deskripsi}</p>

      {children}

      <div className="flex flex-wrap items-center gap-3">
        <div className="px-5 py-3 rounded-xl bg-[#E8EEFC] border-2 border-[#1E3A8A]/30 text-2xl font-bold tracking-[0.3em] text-[#1E3A8A] font-mono min-w-[190px] text-center">
          {kode || '------'}
        </div>
        <button
          onClick={onSalin}
          disabled={!kode}
          className="flex items-center gap-2 border-2 border-[#1E3A8A] text-[#1E3A8A] text-base font-semibold px-4 py-2.5 rounded-xl hover:bg-[#E8EEFC] transition disabled:opacity-50"
        >
          {tersalin ? <Check size={18} /> : <Copy size={18} />}
          {tersalin ? 'Tersalin' : 'Salin Kode'}
        </button>
        {onBuatBaru && (
          <button
            onClick={onBuatBaru}
            disabled={membuat}
            className="flex items-center gap-2 border-2 border-slate-300 text-slate-800 text-base font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={membuat ? 'animate-spin' : ''} />
            {membuat ? 'Membuat...' : 'Buat Kode Baru'}
          </button>
        )}
      </div>
    </div>
  );
}