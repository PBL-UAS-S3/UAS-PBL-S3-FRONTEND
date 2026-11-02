'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import { JEDA_KIRIM_KODE, MIN_PASSWORD, emailValid } from '@/lib/validasi';
import type { ResponAuth } from '@/types/auth';

export function useLupaPassword() {
  const router = useRouter();
  const [langkah, setLangkah] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [kode, setKode] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [loading, setLoading] = useState(false);
  const hitung = useHitungMundur();

  // Langkah 1: minta kode OTP ke email (juga dipakai untuk kirim ulang)
  async function kirimKode() {
    setPesanError('');
    setPesanSukses('');

    if (!emailValid(email)) {
      setPesanError('Format email tidak valid');
      return;
    }

    setLoading(true);
    const res = await api<ResponAuth>('/auth/lupa-password', {
      method: 'POST',
      body: { email: email.trim() },
      publik: true,
    });

    if (res.ok) {
      setLangkah(2);
      hitung.mulai(JEDA_KIRIM_KODE);
      setPesanSukses(
        'Jika email terdaftar sebagai Manager, kode 6 digit sudah dikirim. Cek kotak masuk atau folder spam.'
      );
    } else {
      setPesanError(res.data.error || 'Gagal mengirim kode');
    }
    setLoading(false);
  }

  // Langkah 2: cek kode OTP lalu ganti password
  async function resetPassword() {
    setPesanError('');
    setPesanSukses('');

    if (kode.length !== 6) {
      setPesanError('Masukkan 6 digit kode dari email');
      return;
    }
    if (!passwordBaru || !konfirmasi) {
      setPesanError('Semua kolom wajib diisi');
      return;
    }
    if (passwordBaru.length < MIN_PASSWORD) {
      setPesanError(`Password minimal ${MIN_PASSWORD} karakter`);
      return;
    }
    if (passwordBaru !== konfirmasi) {
      setPesanError('Konfirmasi password tidak sama');
      return;
    }

    setLoading(true);
    const res = await api<ResponAuth>('/auth/reset-password', {
      method: 'POST',
      body: { email: email.trim(), kode, password_baru: passwordBaru },
      publik: true,
    });

    if (res.ok) {
      setPesanSukses('Password berhasil diubah! Mengarahkan ke halaman login...');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    setPesanError(res.data.error || 'Gagal mengubah password');
    setLoading(false);
  }

  function gantiEmail() {
    setLangkah(1);
    setKode('');
    setPasswordBaru('');
    setKonfirmasi('');
    setPesanError('');
    setPesanSukses('');
    hitung.reset();
  }

  return {
    langkah,
    email, setEmail,
    kode, setKode,
    passwordBaru, setPasswordBaru,
    konfirmasi, setKonfirmasi,
    pesanError, pesanSukses, loading,
    sisaDetik: hitung.sisa,
    kirimKode, resetPassword, gantiEmail,
  };
}