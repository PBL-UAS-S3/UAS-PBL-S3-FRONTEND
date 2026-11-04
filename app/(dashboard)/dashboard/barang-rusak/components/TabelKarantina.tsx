'use client';

import { RotateCcw, Trash2 } from 'lucide-react';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatRupiah } from '@/lib/format';
import type { Product } from '@/types/produk';

export function TabelKarantina({
  data,
  loading,
  onPulihkan,
  onAfkir,
}: {
  data: Product[];
  loading: boolean;
  onPulihkan: (p: Product) => void;
  onAfkir: (p: Product) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth: 820 }}>
        <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
          <tr>
            <th className="px-5 py-3.5 font-bold">Produk</th>
            <th className="px-5 py-3.5 font-bold">Stok Rusak</th>
            <th className="px-5 py-3.5 font-bold">Stok Layak</th>
            <th className="px-5 py-3.5 font-bold">Estimasi Kerugian</th>
            <th className="px-5 py-3.5 font-bold">Aksi</th>
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
              <td colSpan={5} className="px-5 py-10 text-center text-slate-600 text-base">
                Tidak ada barang rusak. Gudang dalam kondisi bersih.
              </td>
            </tr>
          )}
          {data.map((p) => (
            <tr key={p.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Thumbnail gambar={p.gambar} />
                  <div>
                    <div className="font-semibold text-slate-900 text-base">{p.nama}</div>
                    <div className="text-sm text-slate-500 font-mono">{p.sku}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="bg-violet-100 text-violet-800 border border-violet-300 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {Number(p.stok_rusak)} {p.satuan || 'unit'}
                </span>
              </td>
              <td className="px-5 py-4 font-bold text-slate-900 text-base">{p.stok_saat_ini}</td>
              <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">
                {formatRupiah(Number(p.stok_rusak) * Number(p.harga || 0))}
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => onPulihkan(p)}
                    className="flex items-center gap-1.5 border-2 border-sky-300 text-sky-800 hover:bg-sky-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Pulihkan
                  </button>
                  <button
                    onClick={() => onAfkir(p)}
                    className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" /> Afkir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}