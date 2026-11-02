'use client';

import { FieldTeks } from '@/components/auth/FieldTeks';
import { TombolAuth } from '@/components/auth/TombolAuth';

export function FormKirimKode({
  email,
  setEmail,
  loading,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  return (
    <>
      <div className="mb-6">
        <FieldTeks
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nama@perusahaan.com"
          onEnter={() => !loading && onSubmit()}
        />
      </div>

      <TombolAuth label="Kirim Kode" labelLoading="Mengirim..." loading={loading} onClick={onSubmit} />
    </>
  );
}