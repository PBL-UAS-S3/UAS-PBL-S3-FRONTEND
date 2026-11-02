'use client';

import Link from 'next/link';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { useLupaPassword } from './hooks/useLupaPassword';
import { FormKirimKode } from './components/FormKirimKode';
import { FormResetPassword } from './components/FormResetPassword';

export default function LupaPasswordPage() {
  const lp = useLupaPassword();

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        judul="Lupa password?"
        subjudul={
          lp.langkah === 1
            ? 'Masukkan email Manager, kami kirim kode verifikasi ke email tersebut.'
            : 'Masukkan kode dari email dan buat password baru.'
        }
      />

      <PesanAuth error={lp.pesanError} sukses={lp.pesanSukses} />

      {lp.langkah === 1 ? (
        <FormKirimKode
          email={lp.email}
          setEmail={lp.setEmail}
          loading={lp.loading}
          onSubmit={lp.kirimKode}
        />
      ) : (
        <FormResetPassword
          email={lp.email}
          onGantiEmail={lp.gantiEmail}
          kode={lp.kode}
          setKode={lp.setKode}
          sisaDetik={lp.sisaDetik}
          onKirimUlang={lp.kirimKode}
          passwordBaru={lp.passwordBaru}
          setPasswordBaru={lp.setPasswordBaru}
          konfirmasi={lp.konfirmasi}
          setKonfirmasi={lp.setKonfirmasi}
          loading={lp.loading}
          onSubmit={lp.resetPassword}
        />
      )}

      <p className="text-center text-base text-slate-600 mt-6">
        <Link href="/login" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
          ← Kembali ke login
        </Link>
      </p>
    </div>
  );
}