'use client';

import Link from 'next/link';
import { FieldTeks } from '@/components/auth/FieldTeks';
import { FieldPassword } from '@/components/auth/FieldPassword';
import { TombolAuth } from '@/components/auth/TombolAuth';

type Props = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
};

export function FormLogin({ email, setEmail, password, setPassword, loading, onSubmit }: Props) {
  return (
    <>
      <div className="space-y-4 mb-6">
        <FieldTeks
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nama@perusahaan.com"
        />
        <div>
          <FieldPassword
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            onEnter={() => !loading && onSubmit()}
          />
          <div className="text-right mt-1.5">
            <Link
              href="/lupa-password"
              className="text-sm text-[#1E3A8A] font-semibold hover:text-[#172554]"
            >
              Lupa password?
            </Link>
          </div>
        </div>
      </div>

      <TombolAuth label="Masuk" labelLoading="Memproses..." loading={loading} onClick={onSubmit} />
    </>
  );
}