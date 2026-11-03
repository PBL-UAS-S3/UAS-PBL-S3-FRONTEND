'use client';

import { Pencil, QrCode, Trash2 } from 'lucide-react';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatRupiah } from '@/lib/format';
import type { Product } from '@/types/produk';
import { rusakDari, statusKey } from '../helpers';
import { StatusBadgeProduk } from './StatusBadgeProduk';

type Props = {
  data: Product[];
  loading: boolean;
  kosong: boolean;
  onEdit: (p: Product) => void;
  onBarcode: (p: Product) => void;
  onHapus: (p: Product) => void;
  onZoom: (url: string) => void;
};

export function TabelProduk({ data, loading, kosong, onEdit, onBarcode, onHapus, onZoom }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ minWidth: 1050 }}>
        <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
          <tr>
            <th className="px-5 py-3.5 font-bold">Produk</th>
            <th className="px-5 py-3.5 font-bold">Kategori</th>
            <th className="px-5 py-3.5 font-bold">Satuan</th>
            <th className="px-5 py-3.5 font-bold">Harga</th>
            <th className="px-5 py-3.5 font-bold">Stok Layak</th>
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
                Tidak ada produk yang cocok dengan pencarian/filter.
              </td>
            </tr>
          )}
          {data.map((p) => (
            <tr key={p.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Thumbnail gambar={p.gambar} ukuran={48} onZoom={onZoom} />
                  <div>
                    <div className="font-semibold text-slate-900 text-base">{p.nama}</div>
                    <div className="text-sm text-slate-500 font-mono">{p.sku}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-800 text-base">{p.kategori || '-'}</td>
              <td className="px-5 py-4 text-slate-800 text-base">{p.satuan || '-'}</td>
              <td className="px-5 py-4 text-slate-800 text-base whitespace-nowrap">
                {formatRupiah(p.harga || 0)}
              </td>
              <td className="px-5 py-4">
                <div className="font-bold text-slate-900 text-base">{p.stok_saat_ini}</div>
                {rusakDari(p) > 0 && (
                  <span className="inline-block mt-1 bg-violet-100 text-violet-800 border border-violet-300 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {rusakDari(p)} rusak
                  </span>
                )}
              </td>
              <td className="px-5 py-4">
                <StatusBadgeProduk status={statusKey(p)} />
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(p)}
                    title="Edit produk"
                    aria-label="Edit produk"
                    className="flex items-center gap-1.5 border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#E8EEFC] font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onBarcode(p)}
                    title="Barcode / QR"
                    aria-label="Barcode produk"
                    className="flex items-center gap-1.5 border-2 border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onHapus(p)}
                    title="Hapus produk"
                    aria-label="Hapus produk"
                    className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
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