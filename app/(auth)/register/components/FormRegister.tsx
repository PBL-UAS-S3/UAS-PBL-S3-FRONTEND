'use client';

import { FieldTeks } from '@/components/auth/FieldTeks';
import { FieldPassword } from '@/components/auth/FieldPassword';
import { TombolAuth } from '@/components/auth/TombolAuth';
import { MIN_PASSWORD } from '@/lib/validasi';

type Props = {
  nama: string;
  setNama: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  telepon: string;
  setTelepon: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
};

export function FormRegister({
  nama, setNama,
  email, setEmail,
  password, setPassword,
  telepon, setTelepon,
  loading, onSubmit,
}: Props) {
  return (
    <>
      <div className="space-y-4 mb-6">
        <FieldTeks label="Nama Lengkap" value={nama} onChange={setNama} placeholder="Nama kamu" />
        <FieldTeks
          label="Email Aktif"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nama@gmail.com"
          bantuan="Kode verifikasi 6 digit akan dikirim ke email ini."
        />
        <FieldPassword
          label="Buat Password"
          value={password}
          onChange={setPassword}
          placeholder={`Minimal ${MIN_PASSWORD} karakter`}
        />
        <FieldTeks
          label="Nomor Telepon (Opsional)"
          value={telepon}
          onChange={setTelepon}
          placeholder="08xx-xxxx-xxxx"
        />
      </div>

      <TombolAuth label="Buat Akun" labelLoading="Memproses..." loading={loading} onClick={onSubmit} />
    </>
  );
}