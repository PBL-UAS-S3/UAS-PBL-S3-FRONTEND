'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { simpanSesi } from '@/lib/auth';
import { MIN_PASSWORD } from '@/lib/validasi';
import type { ResponAuth } from '@/types/auth';

export function useLogin() {
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
    const res = await api<ResponAuth>('/auth/login', {
      method: 'POST',
      body: { email: email.trim(), password },
      publik: true,
    });

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

  return { email, setEmail, password, setPassword, pesanError, loading, submit };
}