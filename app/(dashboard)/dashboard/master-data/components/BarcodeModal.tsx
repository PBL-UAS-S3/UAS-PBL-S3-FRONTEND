'use client';

import { Download, X } from 'lucide-react';
import type { Product } from '@/types/produk';

export function BarcodeModal({
  produk,
  onUnduh,
  onTutup,
}: {
  produk: Product;
  onUnduh: () => void;
  onTutup: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Barcode Produk</h2>
          <button
            onClick={onTutup}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(produk.sku)}`}
            alt="QR Code"
            className="w-56 h-56 border-2 border-slate-200 rounded-xl mb-4"
          />
          <p className="text-2xl font-bold text-slate-900 tracking-wide">{produk.sku}</p>
          <p className="text-base text-slate-600 mb-6">{produk.nama}</p>
          <button
            onClick={onUnduh}
            className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition"
          >
            <Download className="w-5 h-5" />
            <span>Download QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}