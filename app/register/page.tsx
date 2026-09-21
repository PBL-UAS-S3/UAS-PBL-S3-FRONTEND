'use client';

import { useState } from 'react';
import Link from 'next/link';

function IlustrasiGudang() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-w-xs">
      <rect x="40" y="220" width="320" height="8" rx="4" fill="#CBD5E1" />
      <rect x="80" y="140" width="90" height="80" rx="6" fill="#3B82F6" />
      <rect x="80" y="140" width="90" height="20" rx="6" fill="#2563EB" />
      <line x1="125" y1="140" x2="125" y2="220" stroke="#1D4ED8" strokeWidth="2" />
      <rect x="190" y="100" width="110" height="120" rx="6" fill="#FBBF24" />
      <rect x="190" y="100" width="110" height="24" rx="6" fill="#F59E0B" />
      <line x1="245" y1="100" x2="245" y2="220" stroke="#D97706" strokeWidth="2" />
      <rect x="290" y="160" width="60" height="60" rx="6" fill="#34D399" />
      <rect x="290" y="160" width="60" height="16" rx="6" fill="#10B981" />
      <rect x="150" y="40" width="70" height="90" rx="8" fill="white" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="165" y1="60" x2="205" y2="60" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <line x1="165" y1="75" x2="205" y2="75" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <line x1="165" y1="90" x2="190" y2="90" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="200" cy="105" r="14" fill="#22C55E" />
      <path d="M193 105 l5 5 l10 -10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telepon, setTelepon] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [pesanSukses, setPesanSukses] = useState('');
  const [loading, setLoading] = useState(false);

  async function register() {
    setLoading(true);
    setPesanError('');
    setPesanSukses('');
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, telepon }),
      });

      const data = await response.json();

      if (response.ok) {
        setPesanSukses('Akun berhasil dibuat! Mengarahkan ke halaman login...');
        setTimeout(() => {
          window.location.href = '/';
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
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">📦</span>
            <span className="font-bold text-xl text-slate-900">StockVision</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Never lose track of an item again.</h1>
          <p className="text-slate-500 mb-8">Daftarkan akun Manager untuk mulai mengelola gudang.</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Nama Lengkap</label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama kamu"
                className="w-full bg-white border-b border-slate-300 py-2 focus:outline-none focus:border-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Email Kerja</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full bg-white border-b border-slate-300 py-2 focus:outline-none focus:border-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Buat Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-white border-b border-slate-300 py-2 focus:outline-none focus:border-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Nomor Telepon (Opsional)</label>
              <input
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="08xx-xxxx-xxxx"
                className="w-full bg-white border-b border-slate-300 py-2 focus:outline-none focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>

          {pesanError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {pesanError}
            </div>
          )}
          {pesanSukses && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-4">
              {pesanSukses}
            </div>
          )}

          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Create Account'}
          </button>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Akun baru terdaftar sebagai <b>Manager</b>. Untuk akun Staf Gudang, gunakan aplikasi mobile.
          </p>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{' '}
            <Link href="/" className="text-blue-600 font-medium hover:text-blue-800">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 items-center justify-center">
        <div className="flex flex-col items-center gap-6 px-12">
          <div className="flex flex-col items-center text-center">
            <IlustrasiGudang />
            <p className="text-slate-500 text-sm mt-6 max-w-xs">
              Simple, fast, dan powerful buat tim gudang kamu
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 w-24 text-center">
              <span className="text-2xl block mb-1">📊</span>
              <span className="text-xs text-slate-500">Dashboard</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 w-24 text-center">
              <span className="text-2xl block mb-1">✨</span>
              <span className="text-xs text-slate-500">AI Insight</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 w-24 text-center">
              <span className="text-2xl block mb-1">🛒</span>
              <span className="text-xs text-slate-500">Restock</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}