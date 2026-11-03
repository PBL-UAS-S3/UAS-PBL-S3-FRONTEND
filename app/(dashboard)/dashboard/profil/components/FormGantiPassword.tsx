'use client';

import { KeyRound } from 'lucide-react';
import { FieldPassword } from '@/components/auth/FieldPassword';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { MIN_PASSWORD } from '@/lib/validasi';
import type { Notif } from '@/types/ui';

type Props = {
  passwordLama: string;
  setPasswordLama: (v: string) => void;
  passwordBaru: string;
  setPasswordBaru: (v: string) => void;
  konfirmasiBaru: string;
  setKonfirmasiBaru: (v: string) => void;
  saving: boolean;
  onSimpan: () => void;
  notif: Notif;
  onTutupNotif: () => void;
};

export function FormGantiPassword({
  passwordLama,
  setPasswordLama,
  passwordBaru,
  setPasswordBaru,
  konfirmasiBaru,
  setKonfirmasiBaru,
  saving,
  onSimpan,
  notif,
  onTutupNotif,
}: Props) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <KeyRound size={20} className="text-[#1E3A8A]" /> Ganti Password
      </h2>

      <NotifAlert notif={notif} onTutup={onTutupNotif} />

      <div className="space-y-4">
        <FieldPassword label="Password Lama" value={passwordLama} onChange={setPasswordLama} />
        <FieldPassword
          label="Password Baru"
          value={passwordBaru}
          onChange={setPasswordBaru}
          placeholder={`Minimal ${MIN_PASSWORD} karakter`}
        />
        <FieldPassword
          label="Konfirmasi Password Baru"
          value={konfirmasiBaru}
          onChange={setKonfirmasiBaru}
          onEnter={() => !saving && onSimpan()}
        />
      </div>

      <button
        onClick={onSimpan}
        disabled={saving}
        className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 mt-5"
      >
        <KeyRound size={18} /> {saving ? 'Menyimpan...' : 'Ubah Password'}
      </button>
    </div>
  );
}