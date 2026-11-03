'use client';

import { Mail, Phone, UserMinus, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { Staf } from '../types';

export function TabelStafAktif({
  data,
  loading,
  prosesId,
  onKeluarkan,
}: {
  data: Staf[];
  loading: boolean;
  prosesId: number | null;
  onKeluarkan: (s: Staf) => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} className="text-[#1E3A8A]" />
        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide">Staf Aktif</h2>
        {!loading && (
          <span className="bg-slate-200 text-slate-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
            {data.length}
          </span>
        )}
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 640 }}>
            <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
              <tr>
                <th className="px-5 py-3.5 font-bold">Staf</th>
                <th className="px-5 py-3.5 font-bold">Email</th>
                <th className="px-5 py-3.5 font-bold">Telepon</th>
                <th className="px-5 py-3.5 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-600 text-base">
                    Memuat data...
                  </td>
                </tr>
              )}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-600 text-base">
                    Belum ada staf aktif. Bagikan kode gudang di atas ke staf kamu.
                  </td>
                </tr>
              )}
              {data.map((s) => (
                <tr key={s.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar nama={s.nama} />
                      <span className="font-semibold text-slate-900 text-base">{s.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-base">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-400" /> {s.email}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-base">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-400" /> {s.telepon || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onKeluarkan(s)}
                      disabled={prosesId === s.id}
                      className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                    >
                      <UserMinus size={16} />
                      {prosesId === s.id ? 'Memproses...' : 'Keluarkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}