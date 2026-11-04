import { TipeBadge } from '@/components/ui/TipeBadge';
import { formatWaktu } from '@/lib/format';
import type { Transaksi } from '@/types/transaksi';

export function TabelAktivitas({ data, loading }: { data: Transaksi[]; loading: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth: 760 }}>
        <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
          <tr>
            <th className="px-5 py-3.5 font-bold">Waktu</th>
            <th className="px-5 py-3.5 font-bold">Produk</th>
            <th className="px-5 py-3.5 font-bold">Tindakan</th>
            <th className="px-5 py-3.5 font-bold">Jumlah</th>
            <th className="px-5 py-3.5 font-bold">Oleh</th>
            <th className="px-5 py-3.5 font-bold">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-600 text-base">
                Belum ada aktivitas barang rusak.
              </td>
            </tr>
          )}
          {data.map((t) => (
            <tr key={t.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
              <td className="px-5 py-3.5 text-slate-700 text-base whitespace-nowrap">
                {formatWaktu(t.created_at)}
              </td>
              <td className="px-5 py-3.5">
                <div className="font-semibold text-slate-900 text-base">{t.nama}</div>
                <div className="text-sm text-slate-500 font-mono">{t.sku}</div>
              </td>
              <td className="px-5 py-3.5">
                <TipeBadge tipe={t.tipe} />
              </td>
              <td className="px-5 py-3.5 font-bold text-slate-900 text-base">{t.jumlah}</td>
              <td className="px-5 py-3.5 text-slate-800 text-base whitespace-nowrap">{t.nama_staf}</td>
              <td className="px-5 py-3.5 text-slate-700 text-base">{t.catatan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}