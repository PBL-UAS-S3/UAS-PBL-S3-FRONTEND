'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tampilPassword, setTampilPassword] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setPesanError('');
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesanError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      if (data.role !== 'manager') {
        setPesanError(
          'Web dashboard ini khusus untuk akun Manager. Akun kamu terdaftar sebagai Staf — gunakan aplikasi mobile untuk mencatat transaksi gudang.'
        );
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('nama', data.nama);
      router.push('/dashboard');
    } catch (err) {
      setPesanError('Gagal konek ke server');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex bg-white">
      {/* Kiri: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
            <div className="w-9 h-9 rounded-xl bg-[#F2842F] flex items-center justify-center text-lg">📦</div>
            <span className="font-bold text-xl text-slate-900">StockVision</span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Selamat Datang Kembali!</h1>
          <p className="text-slate-600 text-base mb-8">Masuk ke akun Anda untuk kelola gudang.</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-slate-700 block">Password</label>
              </div>
              <div className="relative">
                <input
                  type={tampilPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) login();
                  }}
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 pr-11 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30"
                />
                <button
                  type="button"
                  onClick={() => setTampilPassword(!tampilPassword)}
                  aria-label={tampilPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#F2842F]"
                >
                  <IconMata terlihat={tampilPassword} />
                </button>
              </div>
              <div className="text-right mt-1.5">
                <Link href="/lupa-password" className="text-sm text-[#B9540A] font-semibold hover:text-[#7A3505]">
                  Lupa password?
                </Link>
              </div>
            </div>
          </div>

          {pesanError && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 text-base font-medium rounded-xl px-4 py-3 mb-4">
              {pesanError}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-[#F2842F] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#DD6F1B] transition disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-center text-base text-slate-600 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#B9540A] font-semibold hover:text-[#7A3505]">
              Buat akun
            </Link>
          </p>
        </div>
      </div>

      {/* Kanan: Gambar Full Memenuhi Seluruh Sisi Kanan */}
      <div className="hidden lg:relative lg:block w-1/2 bg-[#FBF8F5] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/paket3.png"
          alt="Ilustrasi Paket Gudang"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-center">
          <p className="text-white text-lg font-medium max-w-sm mx-auto drop-shadow">
            Kelola stok gudang lebih cerdas dengan bantuan AI
          </p>
        </div>
      </div>
    </main>
  );
}