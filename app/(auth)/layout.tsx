'use client';

import { usePathname } from 'next/navigation';
import { PanelGambar } from './components/PanelGambar';
import { PANEL_AUTH, PANEL_DEFAULT } from './constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const panel = PANEL_AUTH[pathname] ?? PANEL_DEFAULT;

  return (
    <main className="min-h-screen flex bg-white">
      {/* Kiri: form (isi tiap halaman) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        {children}
      </div>

      {/* Kanan: gambar, ditulis sekali di sini */}
      <PanelGambar gambar={panel.gambar} alt={panel.alt} teks={panel.teks} />
    </main>
  );
}