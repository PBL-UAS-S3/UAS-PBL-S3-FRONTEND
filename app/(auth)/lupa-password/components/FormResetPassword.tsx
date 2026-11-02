'use client';

import { FieldPassword } from '@/components/auth/FieldPassword';
import { InputKode } from '@/components/auth/InputKode';
import { TombolAuth } from '@/components/auth/TombolAuth';
import { MIN_PASSWORD } from '@/lib/validasi';

type Props = {
  email: string;
  onGantiEmail: () => void;
  kode: string;
  setKode: (v: string) => void;
  sisaDetik: number;
  onKirimUlang: () => void;
  passwordBaru: string;
  setPasswordBaru: (v: string) => void;
  konfirmasi: string;
  setKonfirmasi: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
};

export function FormResetPassword({
  email,
  onGantiEmail,
  kode,
  setKode,
  sisaDetik,
  onKirimUlang,
  passwordBaru,
  setPasswordBaru,
  konfirmasi,
  setKonfirmasi,
  loading,
  onSubmit,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 mb-4">
        <span className="text-base text-slate-800 truncate">{email}</span>
        <button
          onClick={onGantiEmail}
          className="text-sm text-[#1E3A8A] font-semibold hover:text-[#172554] shrink-0 ml-3"
        >
          Ganti
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <InputKode value={kode} onChange={setKode} />
          <div className="text-right mt-1.5 text-sm text-slate-500">
            {sisaDetik > 0 ? (
              <span>Kirim ulang kode dalam {sisaDetik} detik</span>
            ) : (
              <button
                onClick={onKirimUlang}
                disabled={loading}
                className="text-[#1E3A8A] font-semibold hover:text-[#172554] disabled:opacity-50"
              >
                Kirim ulang kode
              </button>
            )}
          </div>
        </div>

        <FieldPassword
          label="Password Baru"
          value={passwordBaru}
          onChange={setPasswordBaru}
          placeholder={`Minimal ${MIN_PASSWORD} karakter`}
        />
        <FieldPassword
          label="Konfirmasi Password"
          value={konfirmasi}
          onChange={setKonfirmasi}
          placeholder="Ulangi password baru"
          onEnter={() => !loading && onSubmit()}
        />
      </div>

      <TombolAuth
        label="Ubah Password"
        labelLoading="Memproses..."
        loading={loading}
        onClick={onSubmit}
      />
    </>
  );
}