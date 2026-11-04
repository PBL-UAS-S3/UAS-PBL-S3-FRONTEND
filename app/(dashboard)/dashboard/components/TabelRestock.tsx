import Link from 'next/link';
import { ArrowRight, PartyPopper, Sparkles } from 'lucide-react';
import type { Product } from '@/types/produk';

const BATAS_TAMPIL = 5;

export function TabelRestock({ data, loading }: { data: Product[]; loading: boolean }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-[#1E3A8A]" />
        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide">
          Items that need restocking
        </h2>
        {!loading && data.length > 0 && (
          <span className="bg-[#1E3A8A] text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
            {data.length}
          </span>
        )}
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 600 }}>
            <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
              <tr>
                <th className="px-5 py-3.5 font-bold">SKU</th>
                <th className="px-5 py-3.5 font-bold">Nama Produk</th>
                <th className="px-5 py-3.5 font-bold">Stok Layak</th>
                <th className="px-5 py-3.5 font-bold">Min. Stok</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-base">
                    Memuat data...
                  </td>
                </tr>
              )}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-base">
                    <div className="flex items-center justify-center gap-2">
                      <PartyPopper size={18} className="text-[#1E3A8A]" /> Semua stok dalam kondisi aman
                    </div>
                  </td>
                </tr>
              )}
              {data.slice(0, BATAS_TAMPIL).map((p) => {
                const habis = p.stok_saat_ini <= 0;
                const rusak = Number(p.stok_rusak ?? 0);
                return (
                  <tr key={p.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                    <td className="px-5 py-4 text-slate-600 font-mono text-base">{p.sku}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900 text-base">{p.nama}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-base">{p.stok_saat_ini}</div>
                      {rusak > 0 && (
                        <span className="inline-block mt-1 bg-violet-100 text-violet-800 border border-violet-300 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          {rusak} rusak
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700 text-base">{p.stok_minimum}</td>
                    <td className="px-5 py-4">
                      {habis ? (
                        <span className="bg-red-100 text-red-700 border border-red-300 text-sm font-bold px-3 py-1 rounded-full">
                          Habis
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-sm font-bold px-3 py-1 rounded-full">
                          Menipis
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.length > BATAS_TAMPIL && (
          <div className="px-5 py-3 border-t-2 border-slate-100 text-right">
            <Link
              href="/dashboard/master-data"
              className="inline-flex items-center gap-1 text-[#1E3A8A] hover:text-[#172554] text-base font-semibold"
            >
              Lihat Semua ({data.length}) <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}