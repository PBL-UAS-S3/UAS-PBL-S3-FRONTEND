'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/master-data', label: 'Master Data', icon: '📦' },
  { href: '/dashboard/riwayat', label: 'Riwayat Transaksi', icon: '🕒' },
  { href: '/dashboard/insight', label: 'AI Insight', icon: '✨' },
  { href: '/dashboard/po', label: 'Purchase Order', icon: '🛒' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sudahDicek, setSudahDicek] = useState(false);
  const [nama, setNama] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const namaTersimpan = localStorage.getItem('nama');

    if (!token || role !== 'manager') {
      window.location.href = '/';
      return;
    }

    setNama(namaTersimpan || 'Manager');
    setSudahDicek(true);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nama');
    window.location.href = '/';
  }

  if (!sudahDicek) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Memeriksa sesi login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-screen">
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="font-bold text-slate-900 text-lg">Stock</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Smart Warehouse System</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const aktif = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  aktif
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {nama.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{nama}</p>
              <p className="text-xs text-slate-400">Manager</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            ↩ Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}