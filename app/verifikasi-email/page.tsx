'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const JEDA_KIRIM = 60;

function VerifikasiForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const autoKirim = params.get('kirim') === '1';

  const [kode, setKode] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [loading, setLoading] = useState(false);
  const [mengirimUlang, setMengirimUlang] = useState(false);
  const [hitungMundur, setHitungMundur] = useState(autoKirim ? 0 : JEDA_KIRIM);
  const sudahAutoKirim = useRef(false);

  useEffect(() => {
    if (hitungMundur <= 0) return;
    const t = setTimeout(() => setHitungMundur((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [hitungMundur]);

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
    try {
      const response = await fetch(`${API_URL}/auth/kirim-ulang-kode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setPesanSukses(data.message || 'Kode baru sudah dikirim ke email kamu');
        setHitungMundur(JEDA_KIRIM);
      } else {
        setPesanError(data.error || 'Gagal mengirim ulang kode');
      }
    } catch (err) {
      setPesanError('Gagal konek ke server');
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
    try {
      const response = await fetch(`${API_URL}/auth/verifikasi-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kode }),
      });
      const data = await response.json();

      if (response.ok) {
        setPesanSukses('Email berhasil diverifikasi! Mengarahkan ke halaman login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
        return;
      }
      setPesanError(data.error || 'Verifikasi gagal');
    } catch (err) {
      setPesanError('Gagal konek ke server');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex bg-white">
      {/* Kiri: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
            <div className="w-9 h-9 rounded-xl bg-[#0000] flex items-center justify-center text-lg">
               <img
                src="/logo4.png"
                alt="Stockin Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-xl text-slate-900">Stockin</span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Verifikasi email kamu</h1>
          {email ? (
            <p className="text-slate-600 text-base mb-6">
              Kami mengirim kode 6 digit ke <b className="text-slate-800">{email}</b>. Cek kotak masuk atau folder spam.
            </p>
          ) : (
            <p className="text-slate-600 text-base mb-6">Alamat email tidak ditemukan.</p>
          )}

          {pesanError && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 text-base font-medium rounded-xl px-4 py-3 mb-5">
              {pesanError}
            </div>
          )}
          {pesanSukses && (
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-base font-medium rounded-xl px-4 py-3 mb-5">
              {pesanSukses}
            </div>
          )}

          {email ? (
            <>
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Kode Verifikasi</label>
                <input
                  value={kode}
                  onChange={(e) => setKode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) verifikasi();
                  }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-2xl text-center font-bold tracking-[0.5em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
                />
              </div>

              <button
                onClick={verifikasi}
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>

              <div className="text-center mt-5 text-base text-slate-600">
                {hitungMundur > 0 ? (
                  <span>Kirim ulang kode dalam {hitungMundur} detik</span>
                ) : (
                  <button
                    onClick={kirimUlang}
                    disabled={mengirimUlang}
                    className="text-[#1E3A8A] font-semibold hover:text-[#172554] disabled:opacity-50"
                  >
                    {mengirimUlang ? 'Mengirim...' : 'Kirim ulang kode'}
                  </button>
                )}
              </div>
            </>
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
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden lg:relative lg:block w-1/2 bg-[#F4F6FB] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/paket7.png"
          alt="Ilustrasi Gudang"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-center">
          <p className="text-white text-lg font-medium max-w-sm mx-auto drop-shadow">
            Satu langkah lagi, pastikan email ini benar milik kamu
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifikasiEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifikasiForm />
    </Suspense>
  );
}