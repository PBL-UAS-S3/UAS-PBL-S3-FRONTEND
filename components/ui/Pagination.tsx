'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Daftar nomor halaman yang ditampilkan: halaman pertama, terakhir, dan sekitar halaman aktif.
// "..." menggantikan bagian yang disembunyikan supaya tombol tidak meluber kalau datanya banyak.
function buatDaftarHalaman(aktif: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  let awal = Math.max(2, aktif - 1);
  let akhir = Math.min(total - 1, aktif + 1);

  if (aktif <= 3) {
    awal = 2;
    akhir = 4;
  } else if (aktif >= total - 2) {
    awal = total - 3;
    akhir = total - 1;
  }

  const daftar: (number | '...')[] = [1];
  if (awal > 2) daftar.push('...');
  for (let i = awal; i <= akhir; i++) daftar.push(i);
  if (akhir < total - 1) daftar.push('...');
  daftar.push(total);
  return daftar;
}

export function Pagination({
  halamanAktif,
  totalHalaman,
  onGanti,
  totalData,
  perHalaman = 10,
  garisAtas = true,
}: {
  halamanAktif: number;
  totalHalaman: number;
  onGanti: (halaman: number) => void;
  totalData: number;
  perHalaman?: number;
  // false kalau Pagination ditaruh di dalam kartu sendiri (tanpa garis pemisah di atas)
  garisAtas?: boolean;
}) {
  if (totalHalaman <= 1) return null;

  const awal = (halamanAktif - 1) * perHalaman + 1;
  const akhir = Math.min(halamanAktif * perHalaman, totalData);
  const daftar = buatDaftarHalaman(halamanAktif, totalHalaman);

  return (
    <div
      className={`px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 ${
        garisAtas ? 'border-t-2 border-slate-100' : ''
      }`}
    >
      <p className="text-sm text-slate-600">
        Menampilkan <b className="text-slate-800">{awal}–{akhir}</b> dari{' '}
        <b className="text-slate-800">{totalData}</b> data
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => onGanti(halamanAktif - 1)}
          disabled={halamanAktif === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-[#E8EEFC] hover:border-[#1E3A8A] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-300 transition"
        >
          <ChevronLeft size={18} />
        </button>
        {daftar.map((p, i) =>
          p === '...' ? (
            <span key={`titik-${i}`} className="w-6 text-center text-slate-400 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onGanti(p)}
              className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition ${
                p === halamanAktif
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'border-2 border-slate-300 text-slate-700 hover:bg-[#E8EEFC] hover:border-[#1E3A8A]'
              }`}
            >
              {p}
            </button>
          )
        )}
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