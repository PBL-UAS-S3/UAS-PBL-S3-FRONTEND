'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import { JEDA_KIRIM_KODE } from '@/lib/validasi';
import type { ResponAuth } from '@/types/auth';

export function useVerifikasiEmail() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const autoKirim = params.get('kirim') === '1';

  const [kode, setKode] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [loading, setLoading] = useState(false);
  const [mengirimUlang, setMengirimUlang] = useState(false);
  const hitung = useHitungMundur(autoKirim ? 0 : JEDA_KIRIM_KODE);
  const sudahAutoKirim = useRef(false);

  // Dari halaman login (akun belum verifikasi): kode baru langsung dikirim
  useEffect(() => {
    if (autoKirim && email && !sudahAutoKirim.current) {
      sudahAutoKirim.current = true;
      kirimUlang();
    }
  }, []);

  async function kirimUlang() {
    setPesanError('');
    setPesanSukses('');
    setMengirimUlang(true);

    const res = await api<ResponAuth>('/auth/kirim-ulang-kode', {
      method: 'POST',
      body: { email },
      publik: true,
    });

    if (res.ok) {
      setPesanSukses(res.data.message || 'Kode baru sudah dikirim ke email kamu');
      hitung.mulai(JEDA_KIRIM_KODE);
    } else {
      setPesanError(res.data.error || 'Gagal mengirim ulang kode');
    }
    setMengirimUlang(false);
  }

  async function verifikasi() {
    setPesanError('');
    setPesanSukses('');

    if (kode.length !== 6) {
      setPesanError('Masukkan 6 digit kode verifikasi');
      return;
    }

    setLoading(true);
    const res = await api<ResponAuth>('/auth/verifikasi-email', {
      method: 'POST',
      body: { email, kode },
      publik: true,
    });

    if (res.ok) {
      setPesanSukses('Email berhasil diverifikasi! Mengarahkan ke halaman login...');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    setPesanError(res.data.error || 'Verifikasi gagal');
    setLoading(false);
  }

  return {
    email,
    kode, setKode,
    pesanError, pesanSukses,
    loading, mengirimUlang,
    sisaDetik: hitung.sisa,
    kirimUlang, verifikasi,
  };
}