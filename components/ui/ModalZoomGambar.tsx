'use client';

import { X } from 'lucide-react';

export function ModalZoomGambar({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white p-1 hover:text-slate-300 transition"
        >
          <X className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" className="w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}