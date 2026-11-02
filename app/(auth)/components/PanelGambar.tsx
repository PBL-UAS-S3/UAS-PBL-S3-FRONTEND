import type { PanelAuth } from '../constants';

export function PanelGambar({ gambar, alt, teks }: PanelAuth) {
  return (
    <div className="hidden lg:relative lg:block w-1/2 bg-[#F4F6FB] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={gambar} src={gambar} alt={alt} className="w-full h-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-center">
        <p className="text-white text-lg font-medium max-w-sm mx-auto drop-shadow">{teks}</p>
      </div>
    </div>
  );
}