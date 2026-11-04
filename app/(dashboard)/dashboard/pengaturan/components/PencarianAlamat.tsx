'use client';

import { Loader2, MapPin, Search } from 'lucide-react';
import { INPUT_KELAS } from '@/lib/ui';
import type { HasilPencarian } from '../types';

export function PencarianAlamat({
  query,
  onQueryChange,
  hasil,
  sedangCari,
  onPilih,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  hasil: HasilPencarian[];
  sedangCari: boolean;
  onPilih: (item: HasilPencarian) => void;
}) {
  return (
    <div className="relative">
      <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
        <Search size={14} /> Cari Alamat
      </label>
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ketik nama jalan, kecamatan, atau tempat..."
          className={`${INPUT_KELAS} pl-11 pr-10`}
        />
        {sedangCari && (
          <Loader2 className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 animate-spin" />
        )}
      </div>

      {hasil.length > 0 && (
        <div className="absolute z-10 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden">
          {hasil.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onPilih(item)}
              className="w-full flex items-start gap-2 text-left px-4 py-2.5 hover:bg-[#F4F7FF] text-sm text-slate-700 border-b border-slate-100 last:border-0"
            >
              <MapPin size={14} className="text-[#1E3A8A] mt-0.5 shrink-0" />
              <span>{item.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}