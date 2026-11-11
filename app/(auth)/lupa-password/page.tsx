'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import { JEDA_KIRIM_KODE, MIN_PASSWORD, emailValid } from '@/lib/validasi';
import { aturUlangPassword, kirimKodeReset } from '@/services/authService';
import { FormKirimKode } from './components/FormKirimKode';
import { FormResetPassword } from './components/FormResetPassword';

export default function LupaPasswordPage() {
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
    const res = await kirimKodeReset(email.trim());

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
    const res = await aturUlangPassword(email.trim(), kode, passwordBaru);

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

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        judul="Lupa password?"
        subjudul={
          langkah === 1
            ? 'Masukkan email Manager, kami kirim kode verifikasi ke email tersebut.'
            : 'Masukkan kode dari email dan buat password baru.'
        }
      />

      <PesanAuth error={pesanError} sukses={pesanSukses} />

      {langkah === 1 ? (
        <FormKirimKode
          email={email}
          setEmail={setEmail}
          loading={loading}
          onSubmit={kirimKode}
        />
      ) : (
        <FormResetPassword
          email={email}
          onGantiEmail={gantiEmail}
          kode={kode}
          setKode={setKode}
          sisaDetik={hitung.sisa}
          onKirimUlang={kirimKode}
          passwordBaru={passwordBaru}
          setPasswordBaru={setPasswordBaru}
          konfirmasi={konfirmasi}
          setKonfirmasi={setKonfirmasi}
          loading={loading}
          onSubmit={resetPassword}
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