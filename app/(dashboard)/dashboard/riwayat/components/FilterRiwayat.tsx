'use client';

import { SELECT_KELAS } from '@/lib/ui';

type Props = {
  searchText: string;
  setSearchText: (v: string) => void;
  tipeFilter: string;
  setTipeFilter: (v: string) => void;
  staffFilter: string;
  setStaffFilter: (v: string) => void;
  daftarStaf: string[];
};

export function FilterRiwayat({
  searchText,
  setSearchText,
  tipeFilter,
  setTipeFilter,
  staffFilter,
  setStaffFilter,
  daftarStaf,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <input
        placeholder="Cari produk, SKU, atau catatan..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
      />
      <select value={tipeFilter} onChange={(e) => setTipeFilter(e.target.value)} className={SELECT_KELAS}>
        <option value="">Semua Tipe</option>
        <option value="in">Masuk</option>
        <option value="out">Keluar</option>
        <option value="rusak">Pisah Rusak</option>
        <option value="buang_rusak">Afkir</option>
        <option value="pulih_rusak">Dipulihkan</option>
      </select>
      <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className={SELECT_KELAS}>
        <option value="">Semua Staf</option>
        {daftarStaf.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}