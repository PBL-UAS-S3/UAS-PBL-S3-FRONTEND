import { Sparkles } from 'lucide-react';

export function MockupAIInsight() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-2.5 text-[9px]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles size={12} className="text-[#1E3A8A]" />
        <span className="font-bold text-slate-900">Mouse Wireless</span>
        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[8px] font-bold">
          Perlu restock
        </span>
      </div>
      <p className="text-slate-500 leading-snug mb-2">
        Stok diperkirakan habis dalam 4 hari berdasarkan rata-rata keluar 30 hari terakhir.
      </p>
      <div className="flex gap-1.5 items-center">
        <div className="bg-slate-100 rounded px-2 py-1 font-bold text-slate-700">25</div>
        <div className="flex-1 bg-[#1E3A8A] text-white text-center rounded py-1 font-semibold">
          Buat PO
        </div>
      </div>
    </div>
  );
}