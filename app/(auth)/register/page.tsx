'use client';

import Link from 'next/link';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { useRegister } from './hooks/useRegister';
import { FormRegister } from './components/FormRegister';

export default function RegisterPage() {
  const r = useRegister();

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

      <PesanAuth error={r.pesanError} sukses={r.pesanSukses} />

      <FormRegister
        nama={r.nama}
        setNama={r.setNama}
        email={r.email}
        setEmail={r.setEmail}
        password={r.password}
        setPassword={r.setPassword}
        telepon={r.telepon}
        setTelepon={r.setTelepon}
        loading={r.loading}
        onSubmit={r.submit}
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