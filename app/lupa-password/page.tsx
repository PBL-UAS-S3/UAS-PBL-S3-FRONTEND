'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const MIN_PASSWORD = 8;
const JEDA_KIRIM = 60;
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function IconMata({ terlihat }: { terlihat: boolean }) {
  if (terlihat) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function LupaPasswordPage() {
  const router = useRouter();
  const [langkah, setLangkah] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [kode, setKode] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [tampilPassword, setTampilPassword] = useState(false);
  const [tampilKonfirmasi, setTampilKonfirmasi] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [loading, setLoading] = useState(false);
  const [hitungMundur, setHitungMundur] = useState(0);

  useEffect(() => {
    if (hitungMundur <= 0) return;
    const t = setTimeout(() => setHitungMundur((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [hitungMundur]);

  async function kirimKode() {
    setPesanError('');
    setPesanSukses('');

    if (!POLA_EMAIL.test(email.trim())) {
      setPesanError('Format email tidak valid');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/lupa-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        setLangkah(2);
        setHitungMundur(JEDA_KIRIM);
        setPesanSukses('Jika email terdaftar sebagai Manager, kode 6 digit sudah dikirim. Cek kotak masuk atau folder spam.');
      } else {
        setPesanError(data.error || 'Gagal mengirim kode');
      }
    } catch (err) {
      setPesanError('Gagal konek ke server');
    }
    setLoading(false);
  }

  async function resetPassword() {
    setPesanError('');
    setPesanSukses('');

    if (kode.length !== 6) {
      setPesanError('Masukkan 6 digit kode dari email');
      return;
    }
    if (!passwordBaru || !konfirmasi) {
      setPesanError('Semua kolom wajib diisi');
      return;
    }
    if (passwordBaru.length < MIN_PASSWORD) {
      setPesanError(`Password minimal ${MIN_PASSWORD} karakter`);
      return;
    }
    if (passwordBaru !== konfirmasi) {
      setPesanError('Konfirmasi password tidak sama');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), kode, password_baru: passwordBaru }),
      });
      const data = await response.json();

      if (response.ok) {
        setPesanSukses('Password berhasil diubah! Mengarahkan ke halaman login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
        return;
      }
      setPesanError(data.error || 'Gagal mengubah password');
    } catch (err) {
      setPesanError('Gagal konek ke server');
    }
    setLoading(false);
  }

  function gantiEmail() {
    setLangkah(1);
    setKode('');
    setPasswordBaru('');
    setKonfirmasi('');
    setPesanError('');
    setPesanSukses('');
    setHitungMundur(0);
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

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Lupa password?</h1>
          <p className="text-slate-600 text-base mb-6">
            {langkah === 1
              ? 'Masukkan email Manager, kami kirim kode verifikasi ke email tersebut.'
              : 'Masukkan kode dari email dan buat password baru.'}
          </p>

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

          {langkah === 1 ? (
            <>
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) kirimKode();
                  }}
                  placeholder="nama@perusahaan.com"
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
                />
              </div>

              <button
                onClick={kirimKode}
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Mengirim...' : 'Kirim Kode'}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 mb-4">
                <span className="text-base text-slate-800 truncate">{email}</span>
                <button
                  onClick={gantiEmail}
                  className="text-sm text-[#1E3A8A] font-semibold hover:text-[#172554] shrink-0 ml-3"
                >
                  Ganti
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Kode Verifikasi</label>
                  <input
                    value={kode}
                    onChange={(e) => setKode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-2xl text-center font-bold tracking-[0.5em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
                  />
                  <div className="text-right mt-1.5 text-sm text-slate-500">
                    {hitungMundur > 0 ? (
                      <span>Kirim ulang kode dalam {hitungMundur} detik</span>
                    ) : (
                      <button
                        onClick={kirimKode}
                        disabled={loading}
                        className="text-[#1E3A8A] font-semibold hover:text-[#172554] disabled:opacity-50"
                      >
                        Kirim ulang kode
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Password Baru</label>
                  <div className="relative">
                    <input
                      type={tampilPassword ? 'text' : 'password'}
                      value={passwordBaru}
                      onChange={(e) => setPasswordBaru(e.target.value)}
                      placeholder={`Minimal ${MIN_PASSWORD} karakter`}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setTampilPassword(!tampilPassword)}
                      aria-label={tampilPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#1E3A8A]"
                    >
                      <IconMata terlihat={tampilPassword} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={tampilKonfirmasi ? 'text' : 'password'}
                      value={konfirmasi}
                      onChange={(e) => setKonfirmasi(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !loading) resetPassword();
                      }}
                      placeholder="Ulangi password baru"
                      className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setTampilKonfirmasi(!tampilKonfirmasi)}
                      aria-label={tampilKonfirmasi ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#1E3A8A]"
                    >
                      <IconMata terlihat={tampilKonfirmasi} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Memproses...' : 'Ubah Password'}
              </button>
            </>
          )}

          <p className="text-center text-base text-slate-600 mt-6">
            <Link href="/login" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
              ← Kembali ke login
            </Link>
          </p>
        </div>
      </div>

      {/* Kanan: Gambar Full Memenuhi Seluruh Sisi Kanan */}
      <div className="hidden lg:relative lg:block w-1/2 bg-[#F4F6FB] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/paket2.png"
          alt="Ilustrasi Gudang"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-center">
          <p className="text-white text-lg font-medium max-w-sm mx-auto drop-shadow">
            Tenang, akses ke gudang kamu bisa dipulihkan dalam hitungan detik
          </p>
        </div>
      </div>
    </main>
  );
}