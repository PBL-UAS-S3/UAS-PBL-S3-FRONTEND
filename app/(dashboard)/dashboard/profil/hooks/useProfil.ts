'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { hapusSesi, ubahNamaSesi } from '@/lib/auth';
import { MIN_PASSWORD } from '@/lib/validasi';
import { useNotifikasi } from '@/hooks/useNotifikasi';

type DataProfil = { nama: string; email: string; telepon: string | null; error?: string };

export function useProfil() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [savingProfil, setSavingProfil] = useState(false);

  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiBaru, setKonfirmasiBaru] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const notifProfil = useNotifikasi();
  const notifPassword = useNotifikasi();

  async function muat() {
    setLoading(true);
    const res = await api<DataProfil>('/auth/profil');
    if (res.sesiHabis) return;

    if (res.ok) {
      setNama(res.data.nama);
      setEmail(res.data.email);
      setTelepon(res.data.telepon || '');
    } else {
      notifProfil.tampil('error', res.data.error || 'Gagal memuat profil');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function simpanProfil() {
    setSavingProfil(true);
    const res = await api<{ error?: string }>('/auth/profil', {
      method: 'PUT',
      body: { nama, telepon },
    });
    if (res.sesiHabis) return;

    if (res.ok) {
      ubahNamaSesi(nama);
      notifProfil.tampil('sukses', 'Profil berhasil disimpan');
    } else {
      notifProfil.tampil('error', res.data.error || 'Gagal menyimpan profil');
    }
    setSavingProfil(false);
  }

  async function simpanPassword() {
    if (!passwordLama || !passwordBaru || !konfirmasiBaru) {
      notifPassword.tampil('error', 'Semua kolom wajib diisi');
      return;
    }
    if (passwordBaru.length < MIN_PASSWORD) {
      notifPassword.tampil('error', `Password baru minimal ${MIN_PASSWORD} karakter`);
      return;
    }
    if (passwordBaru !== konfirmasiBaru) {
      notifPassword.tampil('error', 'Konfirmasi password tidak sama');
      return;
    }

    setSavingPassword(true);
    // 401 di sini berarti "password lama salah", bukan sesi habis
    const res = await api<{ error?: string }>('/auth/ganti-password', {
      method: 'PUT',
      body: { password_lama: passwordLama, password_baru: passwordBaru },
      abaikanSesiHabis: true,
    });

    if (res.ok) {
      notifPassword.tampil('sukses', 'Password berhasil diubah');
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiBaru('');
    } else {
      notifPassword.tampil('error', res.data.error || 'Gagal mengubah password');
    }
    setSavingPassword(false);
  }

  function logout() {
    hapusSesi();
    router.push('/login');
  }

  return {
    loading,
    nama, setNama,
    email,
    telepon, setTelepon,
    savingProfil, simpanProfil,
    passwordLama, setPasswordLama,
    passwordBaru, setPasswordBaru,
    konfirmasiBaru, setKonfirmasiBaru,
    savingPassword, simpanPassword,
    notifProfil, notifPassword,
    logout,
  };
}