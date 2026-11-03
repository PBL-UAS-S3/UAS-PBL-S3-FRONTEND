'use client';

import Link from 'next/link';
import { InputKode } from '@/components/auth/InputKode';
import { TombolAuth } from '@/components/auth/TombolAuth';

type Props = {
  kode: string;
  setKode: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
  sisaDetik: number;
  mengirimUlang: boolean;
  onKirimUlang: () => void;
};

export function FormKode({
  kode,
  setKode,
  loading,
  onSubmit,
  sisaDetik,
  mengirimUlang,
  onKirimUlang,
}: Props) {
  return (
    <>
      <div className="mb-6">
        <InputKode value={kode} onChange={setKode} onEnter={() => !loading && onSubmit()} />
      </div>

      <TombolAuth
        label="Verifikasi"
        labelLoading="Memverifikasi..."
        loading={loading}
        onClick={onSubmit}
      />

      <div className="text-center mt-5 text-base text-slate-600">
        {sisaDetik > 0 ? (
          <span>Kirim ulang kode dalam {sisaDetik} detik</span>
        ) : (
          <button
            onClick={onKirimUlang}
            disabled={mengirimUlang}
            className="text-[#1E3A8A] font-semibold hover:text-[#172554] disabled:opacity-50"
          >
            {mengirimUlang ? 'Mengirim...' : 'Kirim ulang kode'}
          </button>
        )}
      </div>

      <p className="text-center text-sm text-slate-500 mt-3">
        Email salah?{' '}
        <Link href="/register" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
          Daftar ulang dengan email lain
        </Link>
      </p>
    </>
  );
}