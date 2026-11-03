'use client';

import { Mail, Phone, Save, User } from 'lucide-react';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { INPUT_KELAS } from '@/lib/ui';
import type { Notif } from '@/types/ui';

const INPUT_KUNCI_KELAS =
  'w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-500 bg-slate-50';

type Props = {
  nama: string;
  setNama: (v: string) => void;
  email: string;
  telepon: string;
  setTelepon: (v: string) => void;
  saving: boolean;
  onSimpan: () => void;
  notif: Notif;
  onTutupNotif: () => void;
};

export function FormDataDiri({
  nama,
  setNama,
  email,
  telepon,
  setTelepon,
  saving,
  onSimpan,
  notif,
  onTutupNotif,
}: Props) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <User size={20} className="text-[#1E3A8A]" /> Data Diri
      </h2>

      <NotifAlert notif={notif} onTutup={onTutupNotif} />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Nama Lengkap</label>
          <input value={nama} onChange={(e) => setNama(e.target.value)} className={INPUT_KELAS} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Mail size={14} /> Email
          </label>
          <div className={INPUT_KUNCI_KELAS}>{email}</div>
          <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Phone size={14} /> Nomor Telepon
          </label>
          <input
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            placeholder="08xx-xxxx-xxxx"
            className={INPUT_KELAS}
          />
        </div>
      </div>

      <button
        onClick={onSimpan}
        disabled={saving}
        className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 mt-5"
      >
        <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}