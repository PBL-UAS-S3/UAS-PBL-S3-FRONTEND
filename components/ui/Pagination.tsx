'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  halamanAktif,
  totalHalaman,
  onGanti,
  totalData,
  perHalaman = 10,
}: {
  halamanAktif: number;
  totalHalaman: number;
  onGanti: (halaman: number) => void;
  totalData: number;
  perHalaman?: number;
}) {
  if (totalHalaman <= 1) return null;

  const awal = (halamanAktif - 1) * perHalaman + 1;
  const akhir = Math.min(halamanAktif * perHalaman, totalData);

  return (
    <div className="px-5 py-3 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-600">
        Menampilkan <b className="text-slate-800">{awal}–{akhir}</b> dari{' '}
        <b className="text-slate-800">{totalData}</b> data
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
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'border-2 border-slate-300 text-slate-700 hover:bg-[#E8EEFC] hover:border-[#1E3A8A]'
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