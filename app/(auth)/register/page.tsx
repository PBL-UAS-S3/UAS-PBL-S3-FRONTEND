'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { MIN_PASSWORD, emailValid } from '@/lib/validasi';
import { daftarManager } from '@/services/authService';
import { FormRegister } from './components/FormRegister';

export default function RegisterPage() {
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
    const res = await daftarManager({ nama, email: email.trim(), password, telepon });

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

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        judul="Jangan sampai barang hilang lagi."
        subjudul={
          <>
            Akun baru terdaftar sebagai <b className="text-slate-700">Manager</b>. Untuk akun Staf
            Gudang, gunakan aplikasi mobile.
          </>
        }
      />

      <PesanAuth error={pesanError} sukses={pesanSukses} />

      <FormRegister
        nama={nama}
        setNama={setNama}
        email={email}
        setEmail={ubahEmail}
        emailBermasalah={emailBermasalah}
        password={password}
        setPassword={setPassword}
        telepon={telepon}
        setTelepon={setTelepon}
        loading={loading}
        onSubmit={submit}
      />

      <p className="text-center text-base text-slate-600 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
          Masuk
        </Link>
      </p>
    </div>
  );
}