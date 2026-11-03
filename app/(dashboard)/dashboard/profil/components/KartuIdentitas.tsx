'use client';

import { LogOut, Shield } from 'lucide-react';

export function KartuIdentitas({ nama, onLogout }: { nama: string; onLogout: () => void }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold shrink-0">
          {nama.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{nama}</p>
          <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
            <Shield size={14} /> Manager
          </p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}