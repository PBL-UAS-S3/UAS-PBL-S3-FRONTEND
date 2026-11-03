'use client';

import { X } from 'lucide-react';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatRupiah, formatTanggal } from '@/lib/format';
import type { PO } from '../types';
import { nomorPO, totalPO } from '../helpers';
import { StatusBadgePO } from './StatusBadgePO';

export function ModalDetailPO({
  po,
  onTutup,
  onZoom,
}: {
  po: PO;
  onTutup: () => void;
  onZoom: (url: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onTutup}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{nomorPO(po)}</h2>
          <button
            onClick={onTutup}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-3 text-base">
          <div className="flex justify-center mb-2">
            <Thumbnail gambar={po.gambar} onZoom={onZoom} />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Produk</span>
            <span className="font-semibold text-slate-900">{po.nama}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">SKU</span>
            <span className="font-mono text-slate-800">{po.sku}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Jumlah</span>
            <span className="font-semibold text-slate-900">{po.jumlah}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Total Nilai</span>
            <span className="font-semibold text-slate-900">{formatRupiah(totalPO(po))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Tanggal Dibuat</span>
            <span className="text-slate-800">{formatTanggal(po.created_at)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Status</span>
            <StatusBadgePO status={po.status} />
          </div>
          <div>
            <span className="text-slate-600 block mb-1">Catatan</span>
            <p className="text-slate-800">{po.catatan || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}