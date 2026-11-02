'use client';

import Link from 'next/link';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { useLogin } from './hooks/useLogin';
import { FormLogin } from './components/FormLogin';

export default function LoginPage() {
  const { email, setEmail, password, setPassword, pesanError, loading, submit } = useLogin();

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        judul="Selamat Datang Kembali!"
        subjudul="Masuk ke akun Anda untuk kelola gudang."
      />

      <PesanAuth error={pesanError} />

      <FormLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onSubmit={submit}
      />

      <p className="text-center text-base text-slate-600 mt-6">
        Belum punya akun?{' '}
        <Link href="/register" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
          Buat akun
        </Link>
      </p>
    </div>
  );
}