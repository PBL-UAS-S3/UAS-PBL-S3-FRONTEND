'use client';

import { History } from 'lucide-react';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatWaktu } from '@/lib/format';
import type { Insight } from '../types';
import { tampilkanTombolPO } from '../helpers';
import { BadgeRestock } from './BadgeRestock';
import { FormBuatPO } from './FormBuatPO';

type Props = {
  item: Insight;
  jumlah: string;
  onJumlahChange: (v: string) => void;
  onBuatPO: () => void;
  poLoading: boolean;
  poBerhasil: boolean;
  onZoom: (url: string) => void;
};

export function KartuInsight({
  item,
  jumlah,
  onJumlahChange,
  onBuatPO,
  poLoading,
  poBerhasil,
  onZoom,
}: Props) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Thumbnail gambar={item.gambar} ukuran={48} onZoom={onZoom} />
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-lg truncate">{item.nama}</div>
            <div className="text-sm text-slate-500 font-mono">{item.sku}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <BadgeRestock item={item} />
          {item.is_terbaru === 0 && (
            <span className="flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full">
              <History size={12} /> Riwayat
            </span>
          )}
        </div>
      </div>

      <p className="text-base text-slate-800 mb-4">{item.rekomendasi}</p>

      <div className="flex flex-wrap items-center justify-between gap-1 text-sm text-slate-600 border-t-2 border-slate-100 pt-3 mb-3">
        <span>
          Stok saat ini: <b className="text-slate-900">{item.stok_saat_ini}</b> (min.{' '}
          {item.stok_minimum})
        </span>
        <span>{formatWaktu(item.generated_at)}</span>
      </div>

      {tampilkanTombolPO(item) && (
        <FormBuatPO
          jumlah={jumlah}
          onJumlahChange={onJumlahChange}
          onBuat={onBuatPO}
          loading={poLoading}
          berhasil={poBerhasil}
        />
      )}
    </div>
  );
}