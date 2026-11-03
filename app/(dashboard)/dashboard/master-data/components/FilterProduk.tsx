'use client';

import { Search } from 'lucide-react';
import { SELECT_KELAS } from '@/lib/ui';

type Props = {
  searchText: string;
  setSearchText: (v: string) => void;
  kategoriFilter: string;
  setKategoriFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  daftarKategori: string[];
};

export function FilterProduk({
  searchText,
  setSearchText,
  kategoriFilter,
  setKategoriFilter,
  statusFilter,
  setStatusFilter,
  daftarKategori,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          placeholder="Cari nama produk atau SKU..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-white border-2 border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
        />
      </div>
      <select
        value={kategoriFilter}
        onChange={(e) => setKategoriFilter(e.target.value)}
        className={SELECT_KELAS}
      >
        <option value="">Semua Kategori</option>
        {daftarKategori.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className={SELECT_KELAS}
      >
        <option value="">Semua Status</option>
        <option value="aman">Aman</option>
        <option value="menipis">Menipis</option>
        <option value="habis">Habis</option>
        <option value="rusak">Ada stok rusak</option>
      </select>
    </div>
  );
}