import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TAUTAN } from '../constants';

export function DaftarTautan() {
  return (
    <>
      <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
        Akun &amp; Bantuan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TAUTAN.map(({ href, Ikon, label, desk }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-[#1E3A8A] hover:bg-[#F4F7FF] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8EEFC] text-[#1E3A8A] flex items-center justify-center shrink-0">
              <Ikon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-base">{label}</p>
              <p className="text-sm text-slate-500">{desk}</p>
            </div>
            <ChevronRight size={18} className="text-slate-400 shrink-0" />
          </Link>
        ))}
      </div>
    </>
  );
}