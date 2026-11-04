'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopbarMobile } from '@/components/layout/TopbarMobile';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { hapusSesi } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { sudahDicek, nama } = useAuthGuard('manager');
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false);

  // Pindah halaman, sidebar di layar kecil menutup sendiri
  useEffect(() => {
    setSidebarTerbuka(false);
  }, [pathname]);

  function logout() {
    hapusSesi();
    router.push('/login');
  }

  if (!sudahDicek) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <p className="text-slate-600 text-base">Memeriksa sesi login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <TopbarMobile onBuka={() => setSidebarTerbuka(true)} />

      <Sidebar
        terbuka={sidebarTerbuka}
        onTutup={() => setSidebarTerbuka(false)}
        nama={nama}
        pathname={pathname}
        onLogout={logout}
      />

      <div className="lg:ml-64">{children}</div>
    </div>
  );
}