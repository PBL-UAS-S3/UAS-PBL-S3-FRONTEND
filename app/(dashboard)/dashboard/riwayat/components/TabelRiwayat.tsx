'use client';

import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatWaktu } from '@/lib/format';
import type { Transaksi } from '@/types/transaksi';
import { infoTipe } from '../constants';
import { TipeBadge } from './TipeBadge';

export function TabelRiwayat({
  data,
  loading,
  kosong,
  onZoom,
}: {
  data: Transaksi[];
  loading: boolean;
  kosong: boolean;
  onZoom: (url: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth: 800 }}>
        <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
          <tr>
            <th className="px-5 py-3.5 font-bold whitespace-nowrap">Waktu</th>
            <th className="px-5 py-3.5 font-bold whitespace-nowrap">Produk</th>
            <th className="px-5 py-3.5 font-bold whitespace-nowrap">Tipe</th>
            <th className="px-5 py-3.5 font-bold whitespace-nowrap">Jumlah</th>
            <th className="px-5 py-3.5 font-bold whitespace-nowrap">Staf</th>
            <th className="px-5 py-3.5 font-bold whitespace-nowrap">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-600 text-base">
                Memuat data...
              </td>
            </tr>
          )}
          {!loading && kosong && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-600 text-base">
                Tidak ada transaksi yang cocok.
              </td>
            </tr>
          )}
          {data.map((t) => (
            <tr key={t.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
              <td className="px-5 py-4 text-slate-700 text-base whitespace-nowrap">{formatWaktu(t.created_at)}</td>
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <Thumbnail gambar={t.gambar} onZoom={onZoom} />
                  <div>
                    <div className="font-semibold text-slate-900 text-base">{t.nama}</div>
                    <div className="text-sm text-slate-500 font-mono">{t.sku}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <TipeBadge tipe={t.tipe} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="font-bold text-slate-900 text-base">{t.jumlah}</div>
                {infoTipe(t.tipe).alur && (
                  <div className="text-xs text-slate-500 mt-0.5">{infoTipe(t.tipe).alur}</div>
                )}
              </td>
              <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">{t.nama_staf}</td>
              <td className="px-5 py-4 text-slate-700 text-base">{t.catatan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}