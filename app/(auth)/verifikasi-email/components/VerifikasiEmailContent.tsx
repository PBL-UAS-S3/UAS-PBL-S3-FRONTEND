'use client';

import Link from 'next/link';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { useVerifikasiEmail } from '../hooks/useVerifikasiEmail';
import { FormKode } from './FormKode';

export function VerifikasiEmailContent() {
  const v = useVerifikasiEmail();

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        judul="Verifikasi email kamu"
        subjudul={
          v.email ? (
            <>
              Kami mengirim kode 6 digit ke <b className="text-slate-800">{v.email}</b>. Cek kotak
              masuk atau folder spam.
            </>
          ) : (
            'Alamat email tidak ditemukan.'
          )
        }
      />

      <PesanAuth error={v.pesanError} sukses={v.pesanSukses} />

      {v.email ? (
        <FormKode
          kode={v.kode}
          setKode={v.setKode}
          loading={v.loading}
          onSubmit={v.verifikasi}
          sisaDetik={v.sisaDetik}
          mengirimUlang={v.mengirimUlang}
          onKirimUlang={v.kirimUlang}
        />
      ) : (
        <Link
          href="/register"
          className="block w-full text-center bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition shadow-sm"
        >
          Kembali ke pendaftaran
        </Link>
      )}

      <p className="text-center text-base text-slate-600 mt-6">
        <Link href="/login" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
          ← Kembali ke login
        </Link>
      </p>
    </div>
  );
}