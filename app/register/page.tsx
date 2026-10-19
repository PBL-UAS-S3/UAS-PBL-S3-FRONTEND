'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MIN_PASSWORD = 8;
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

export default function RegisterPage() {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tampilPassword, setTampilPassword] = useState(false);
  const [telepon, setTelepon] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [loading, setLoading] = useState(false);

  async function register() {
    setPesanError('');
    setPesanSukses('');

    if (!nama.trim() || !email.trim() || !password) {
      setPesanError('Nama, email, dan password wajib diisi');
      return;
    }
    if (!POLA_EMAIL.test(email.trim())) {
      setPesanError('Format email tidak valid. Gunakan email aktif, contoh: nama@gmail.com');
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setPesanError(`Password minimal ${MIN_PASSWORD} karakter`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email: email.trim(), password, telepon }),
      });

      const data = await response.json();

      if (response.ok) {
        setPesanSukses('Akun berhasil dibuat! Mengarahkan ke halaman login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setPesanError(data.error || 'Registrasi gagal');
      }
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

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Jangan sampai barang hilang lagi.</h1>
          <p className="text-slate-600 text-base mb-6">
            Akun baru terdaftar sebagai <b className="text-slate-700">Manager</b>. Untuk akun Staf Gudang, gunakan aplikasi mobile.
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

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Nama Lengkap</label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama kamu"
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Email Aktif</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Buat Password</label>
              <div className="relative">
                <input
                  type={tampilPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Nomor Telepon (Opsional)</label>
              <input
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="08xx-xxxx-xxxx"
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
              />
            </div>
          </div>

          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Memproses...' : 'Buat Akun'}
          </button>

          <p className="text-center text-base text-slate-600 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#1E3A8A] font-semibold hover:text-[#172554]">
              Masuk
            </Link>
          </p>
        </div>
      </div>

      {/* Kanan: Gambar Full Memenuhi Seluruh Sisi Kanan */}
      <div className="hidden lg:relative lg:block w-1/2 bg-[#F4F6FB] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/paket4.png"
          alt="Ilustrasi Gudang"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-center">
          <p className="text-white text-lg font-medium max-w-sm mx-auto drop-shadow">
            Simple, fast, dan powerful buat tim gudang kamu
          </p>
        </div>
      </div>
    </main>
  );
}