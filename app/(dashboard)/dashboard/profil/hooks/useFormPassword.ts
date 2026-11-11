'use client';

import { useState } from 'react';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { MIN_PASSWORD } from '@/lib/validasi';
import type { HasilAksi } from '../types';

export function useFormPassword(
  onSimpan: (passwordLama: string, passwordBaru: string) => Promise<HasilAksi>,
) {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiBaru, setKonfirmasiBaru] = useState('');
  const [saving, setSaving] = useState(false);
  const notif = useNotifikasi();

  async function simpan() {
    if (!passwordLama || !passwordBaru || !konfirmasiBaru) {
      notif.tampil('error', 'Semua kolom wajib diisi');
      return;
    }
    if (passwordBaru.length < MIN_PASSWORD) {
      notif.tampil('error', `Password baru minimal ${MIN_PASSWORD} karakter`);
      return;
    }
    if (passwordBaru !== konfirmasiBaru) {
      notif.tampil('error', 'Konfirmasi password tidak sama');
      return;
    }

    setSaving(true);
    const hasil = await onSimpan(passwordLama, passwordBaru);

    if (hasil.ok) {
      notif.tampil('sukses', 'Password berhasil diubah');
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiBaru('');
    } else {
      notif.tampil('error', hasil.error || 'Gagal mengubah password');
    }
    setSaving(false);
  }

  return {
    passwordLama, setPasswordLama,
    passwordBaru, setPasswordBaru,
    konfirmasiBaru, setKonfirmasiBaru,
    saving, simpan,
    notif,
  };
}