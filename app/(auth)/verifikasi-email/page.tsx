'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PesanAuth } from '@/components/auth/PesanAuth';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import { JEDA_KIRIM_KODE } from '@/lib/validasi';
import { kirimUlangKode, verifikasiKode } from '@/services/authService';
import { FormKode } from './components/FormKode';

function VerifikasiEmailIsi() {
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

    const res = await kirimUlangKode(email);

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
    const res = await verifikasiKode(email, kode);

    if (res.ok) {
      setPesanSukses('Email berhasil diverifikasi! Mengarahkan ke halaman login...');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    setPesanError(res.data.error || 'Verifikasi gagal');
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <AuthHeader
        judul="Verifikasi email kamu"
        subjudul={
          email ? (
            <>
              Kami mengirim kode 6 digit ke <b className="text-slate-800">{email}</b>. Cek kotak
              masuk atau folder spam.
            </>
          ) : (
            'Alamat email tidak ditemukan.'
          )
        }
      />

      <PesanAuth error={pesanError} sukses={pesanSukses} />

      {email ? (
        <FormKode
          kode={kode}
          setKode={setKode}
          loading={loading}
          onSubmit={verifikasi}
          sisaDetik={hitung.sisa}
          mengirimUlang={mengirimUlang}
          onKirimUlang={kirimUlang}
        />
      ) : (
        <Link
          href="/register"
          className="block w-full text-center bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition shadow-sm"
        >
          Kembali ke pendaftaran
        </Link>
      )}

      <p className="text-center text-base text-slate-600 mt-6">
        <Link href="/login" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
          ← Kembali ke login
        </Link>
      </p>
    </div>
  );
}

export default function VerifikasiEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifikasiEmailIsi />
    </Suspense>
  );
}