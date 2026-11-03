'use client';

import { Search } from 'lucide-react';
import { TabSwitch } from '@/components/ui/TabSwitch';
import type { TabPO } from '../types';

type Props = {
  tab: TabPO;
  setTab: (t: TabPO) => void;
  jumlahMenunggu: number;
  jumlahSemua: number;
  jumlahDitolak: number;
  searchText: string;
  setSearchText: (v: string) => void;
};

export function ToolbarPO({
  tab,
  setTab,
  jumlahMenunggu,
  jumlahSemua,
  jumlahDitolak,
  searchText,
  setSearchText,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <TabSwitch<TabPO>
        opsi={[
          { nilai: 'menunggu', label: `Menunggu Approval (${jumlahMenunggu})` },
          { nilai: 'semua', label: `Semua PO (${jumlahSemua})` },
          { nilai: 'ditolak', label: `Ditolak (${jumlahDitolak})` },
        ]}
        nilai={tab}
        onGanti={setTab}
      />
      <div className="relative md:w-80">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          placeholder="Cari No. PO atau produk..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-white border-2 border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
        />
      </div>
    </div>
  );
}