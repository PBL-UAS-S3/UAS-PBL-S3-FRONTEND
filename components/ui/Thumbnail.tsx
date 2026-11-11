'use client';

import { Package } from 'lucide-react';
import { API_URL } from '@/lib/config';

function urlGambar(gambar: string) {
  return /^https?:\/\//.test(gambar) ? gambar : `${API_URL}${gambar}`;
}

export function Thumbnail({
  gambar,
  ukuran = 44,
  onZoom,
}: {
  gambar: string | null;
  ukuran?: number;
  onZoom?: (url: string) => void;
}) {
  if (gambar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlGambar(gambar)}
        alt=""
        style={{ width: ukuran, height: ukuran }}
        className={`rounded-xl object-cover border-2 border-slate-200 shrink-0 ${onZoom ? 'cursor-zoom-in' : ''}`}
        onClick={onZoom ? () => onZoom(urlGambar(gambar)) : undefined}
      />
    );
  }

  return (
    <div
      style={{ width: ukuran, height: ukuran }}
      className="rounded-xl bg-[#E8EEFC] border-2 border-[#1E3A8A]/30 flex items-center justify-center text-[#1E3A8A] shrink-0"
    >
      <Package size={Math.round(ukuran * 0.45)} />
    </div>
  );
}