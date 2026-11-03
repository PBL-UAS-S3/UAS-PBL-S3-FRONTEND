'use client';

import { Clock, Mail, Phone, UserCheck, UserX } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import type { Staf } from '../types';

export function TabelPermintaan({
  data,
  prosesId,
  onSetujui,
  onTolak,
}: {
  data: Staf[];
  prosesId: number | null;
  onSetujui: (s: Staf) => void;
  onTolak: (s: Staf) => void;
}) {
  if (data.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} className="text-[#1E3A8A]" />
        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide">
          Permintaan Bergabung
        </h2>
        <span className="bg-[#1E3A8A] text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
          {data.length}
        </span>
      </div>
      <div className="bg-white border-2 border-[#1E3A8A]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 700 }}>
            <tbody>
              {data.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-200 last:border-0 hover:bg-[#F4F7FF] transition"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar nama={s.nama} />
                      <div>
                        <p className="font-semibold text-slate-900 text-base">{s.nama}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Mail size={13} /> {s.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-base">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-400" /> {s.telepon || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 justify-end whitespace-nowrap">
                      <button
                        onClick={() => onSetujui(s)}
                        disabled={prosesId === s.id}
                        className="flex items-center gap-1.5 bg-[#1E3A8A] text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#172E6E] transition disabled:opacity-50"
                      >
                        <UserCheck size={16} />
                        {prosesId === s.id ? 'Memproses...' : 'Setujui'}
                      </button>
                      <button
                        onClick={() => onTolak(s)}
                        disabled={prosesId === s.id}
                        className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                      >
                        <UserX size={16} /> Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}