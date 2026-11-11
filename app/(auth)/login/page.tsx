'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { simpanSesi } from '@/lib/auth';
import { MIN_PASSWORD } from '@/lib/validasi';
import { masuk } from '@/services/authService';
import { FormLogin } from './components/FormLogin';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setPesanError('');

    if (!email.trim() || !password) {
      setPesanError('Email dan password wajib diisi');
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setPesanError(`Password minimal ${MIN_PASSWORD} karakter`);
      return;
    }

    setLoading(true);
    const res = await masuk(email.trim(), password);

    if (!res.ok) {
      if (res.data.perlu_verifikasi) {
        router.push(
          `/verifikasi-email?email=${encodeURIComponent(res.data.email || email.trim())}&kirim=1`
        );
        return;
      }
      setPesanError(res.data.error || 'Login gagal');
      setLoading(false);
      return;
    }

    if (res.data.role !== 'manager' || !res.data.token) {
      setPesanError(
        'Web dashboard ini khusus untuk akun Manager. Akun kamu terdaftar sebagai Staf — gunakan aplikasi mobile untuk mencatat transaksi gudang.'
      );
      setLoading(false);
      return;
    }

    simpanSesi({
      token: res.data.token,
      role: res.data.role,
      nama: res.data.nama || 'Manager',
    });
    router.push('/dashboard');
  }

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