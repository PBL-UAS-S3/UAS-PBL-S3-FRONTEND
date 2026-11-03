'use client';

import { Check, Eye, XCircle } from 'lucide-react';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatRupiah, formatTanggal } from '@/lib/format';
import type { PO } from '../types';
import { nomorPO, totalPO } from '../helpers';
import { StatusBadgePO } from './StatusBadgePO';

type Props = {
  data: PO[];
  loading: boolean;
  kosong: boolean;
  prosesId: number | null;
  onSetujui: (po: PO) => void;
  onTolak: (po: PO) => void;
  onLihat: (po: PO) => void;
  onZoom: (url: string) => void;
};

export function TabelPO({
  data,
  loading,
  kosong,
  prosesId,
  onSetujui,
  onTolak,
  onLihat,
  onZoom,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth: 900 }}>
        <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
          <tr>
            <th className="px-5 py-3.5 font-bold">No. PO</th>
            <th className="px-5 py-3.5 font-bold">Produk</th>
            <th className="px-5 py-3.5 font-bold">Tanggal</th>
            <th className="px-5 py-3.5 font-bold">Jumlah</th>
            <th className="px-5 py-3.5 font-bold">Total</th>
            <th className="px-5 py-3.5 font-bold">Status</th>
            <th className="px-5 py-3.5 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-slate-600 text-base">
                Memuat data...
              </td>
            </tr>
          )}
          {!loading && kosong && (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-slate-600 text-base">
                Tidak ada Purchase Order yang cocok.
              </td>
            </tr>
          )}
          {data.map((po) => (
            <tr key={po.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
              <td className="px-5 py-4 font-mono text-base text-slate-700 whitespace-nowrap">
                {nomorPO(po)}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <Thumbnail gambar={po.gambar} onZoom={onZoom} />
                  <div>
                    <div className="font-semibold text-slate-900 text-base">{po.nama}</div>
                    <div className="text-sm text-slate-500 font-mono">{po.sku}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">
                {formatTanggal(po.created_at)}
              </td>
              <td className="px-5 py-4 font-bold text-slate-900 text-base">{po.jumlah}</td>
              <td className="px-5 py-4 text-slate-900 text-base font-semibold whitespace-nowrap">
                {formatRupiah(totalPO(po))}
              </td>
              <td className="px-5 py-4">
                <StatusBadgePO status={po.status} />
              </td>
              <td className="px-5 py-4">
                {po.status === 'pending' ? (
                  <div className="flex gap-2 whitespace-nowrap">
                    <button
                      onClick={() => onSetujui(po)}
                      disabled={prosesId === po.id}
                      title="Setujui PO (Approve)"
                      aria-label="Setujui PO"
                      className="flex items-center justify-center w-10 h-10 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onTolak(po)}
                      disabled={prosesId === po.id}
                      title="Tolak PO (Reject)"
                      aria-label="Tolak PO"
                      className="flex items-center justify-center w-10 h-10 border-2 border-red-300 text-red-700 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onLihat(po)}
                    className="flex items-center gap-1.5 border-2 border-slate-300 text-slate-800 text-base font-semibold px-4 py-2 rounded-xl hover:bg-slate-100 transition"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}