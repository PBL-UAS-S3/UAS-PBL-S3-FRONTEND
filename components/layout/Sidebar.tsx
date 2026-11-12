'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/ui/Logo';
import { MENU_ITEMS } from '@/lib/menu';

export function Sidebar({
  terbuka,
  onTutup,
  nama,
  pathname,
  onLogout,
}: {
  terbuka: boolean;
  onTutup: () => void;
  nama: string;
  pathname: string;
  onLogout: () => void;
}) {
  // Saat laci terbuka di layar kecil, halaman di belakangnya tidak ikut bergulir
  useEffect(() => {
    document.body.style.overflow = terbuka ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [terbuka]);

  return (
    <>
      {terbuka && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={onTutup} />
      )}

      {/* top-0 left-0 supaya laci menempel di pojok kiri atas layar (bukan di bawah topbar).
          h-dvh mengikuti tinggi layar yang terlihat di HP, jadi Logout tidak tersembunyi.
          Isi tetap bisa di-scroll kalau layar sangat pendek. */}
      <aside
        className={`w-64 max-w-[85vw] bg-white border-r-2 border-slate-200 fixed top-0 left-0 h-dvh z-50 transition-transform duration-200 overflow-y-auto overscroll-contain ${
          terbuka ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col min-h-full">
          <div className="px-5 py-5 border-b-2 border-slate-100 flex items-start justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <span className="font-bold text-slate-900 text-xl leading-tight block">
                  Stockin
                </span>
                <p className="text-xs text-slate-500">Smart Warehouse System</p>
              </div>
            </div>
            <button onClick={onTutup} className="lg:hidden text-slate-500" aria-label="Tutup menu">
              <X size={22} />
            </button>
          </div>

          <nav className="px-3 py-4 space-y-1.5 shrink-0">
            <p className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menu
            </p>
            {MENU_ITEMS.map(({ href, label, Icon }) => {
              const aktif = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold transition ${
                    aktif
                      ? 'bg-[#1E3A8A] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#E8EEFC] hover:text-[#172554]'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t-2 border-slate-100 mt-auto shrink-0">
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <Avatar nama={nama} />
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 truncate">{nama}</p>
                <p className="text-sm text-slate-500">Manager</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}