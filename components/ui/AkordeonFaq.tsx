'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type ItemFaq = { q: string; a: string };

// Daftar pertanyaan yang bisa dibuka-tutup. Satu pertanyaan terbuka dalam satu waktu.
// ringkas = ukuran kecil untuk halaman Home.
export function AkordeonFaq({
  daftar,
  bukaAwal = 0,
  ringkas = false,
}: {
  daftar: ItemFaq[];
  bukaAwal?: number | null;
  ringkas?: boolean;
}) {
  const [terbuka, setTerbuka] = useState<number | null>(bukaAwal);

  return (
    <div className="space-y-3">
      {daftar.map((item, idx) => (
        <div
          key={item.q}
          className={`bg-white border-2 border-slate-200 overflow-hidden ${
            ringkas ? 'rounded-xl' : 'rounded-2xl shadow-sm'
          }`}
        >
          <button
            onClick={() => setTerbuka(terbuka === idx ? null : idx)}
            className={`w-full flex items-center justify-between gap-3 text-left ${
              ringkas ? 'p-4' : 'p-5'
            }`}
          >
            <span
              className={`font-semibold text-slate-900 ${ringkas ? 'text-sm md:text-base' : 'text-base'}`}
            >
              {item.q}
            </span>
            <ChevronDown
              size={ringkas ? 18 : 20}
              className={`text-slate-500 shrink-0 transition-transform ${terbuka === idx ? 'rotate-180' : ''}`}
            />
          </button>
          {terbuka === idx && (
            <div
              className={`border-t-2 border-slate-100 ${
                ringkas
                  ? 'px-4 pb-4 pt-3 text-slate-600 text-sm'
                  : 'px-5 pb-5 pt-4 text-slate-700 text-base'
              }`}
            >
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}