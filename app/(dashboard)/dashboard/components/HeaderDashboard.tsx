import Link from 'next/link';
import { Package, Sparkles } from 'lucide-react';

export function HeaderDashboard({ nama }: { nama: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
      <div>
        <p className="text-base font-semibold text-[#1E3A8A]">Dashboard</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Halo, {nama}</h1>
        <p className="text-slate-600 text-base">Ringkasan kondisi gudang secara keseluruhan</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/insight"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-base font-semibold text-slate-800 hover:bg-[#E8EEFC] hover:border-[#1E3A8A] transition"
        >
          <Sparkles size={18} /> AI Insight
        </Link>
        <Link
          href="/dashboard/master-data"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-base font-semibold hover:bg-[#172E6E] transition shadow-sm"
        >
          <Package size={18} /> Kelola Produk
        </Link>
      </div>
    </div>
  );
}