'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { MIN_PASSWORD, emailValid } from '@/lib/validasi';
import type { ResponAuth } from '@/types/auth';

export function useRegister() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telepon, setTelepon] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [emailBermasalah, setEmailBermasalah] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mengetik ulang email menghapus tanda merah di kolomnya
  function ubahEmail(v: string) {
    setEmail(v);
    if (emailBermasalah) setEmailBermasalah(false);
  }

  async function submit() {
    setPesanError('');
    setPesanSukses('');
    setEmailBermasalah(false);

    if (!nama.trim() || !email.trim() || !password) {
      setPesanError('Nama, email, dan password wajib diisi');
      return;
    }
    if (!emailValid(email)) {
      setPesanError('Format email tidak valid. Gunakan email aktif, contoh: nama@gmail.com');
      setEmailBermasalah(true);
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setPesanError(`Password minimal ${MIN_PASSWORD} karakter`);
      return;
    }

    setLoading(true);
    const res = await api<ResponAuth>('/auth/register', {
      method: 'POST',
      body: { nama, email: email.trim(), password, telepon },
      publik: true,
    });

    if (res.ok) {
      setPesanSukses('Akun dibuat! Kode verifikasi sudah dikirim ke email kamu...');
      setTimeout(() => {
        router.push(
          `/verifikasi-email?email=${encodeURIComponent(res.data.email || email.trim())}`
        );
      }, 1200);
      return;
    }

    setPesanError(res.data.error || 'Registrasi gagal');
    if (res.data.kode === 'email_tidak_ada') setEmailBermasalah(true);
    setLoading(false);
  }

  return {
    nama, setNama,
    email, setEmail: ubahEmail,
    password, setPassword,
    telepon, setTelepon,
    emailBermasalah,
    pesanError, pesanSukses, loading, submit,
  };
}