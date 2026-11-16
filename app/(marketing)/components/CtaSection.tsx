'use client';

import Link from 'next/link';
import { useSudahLogin } from '@/hooks/useSudahLogin';
import { Reveal } from './Reveal';

export function CtaSection() {
  const { sudahLogin } = useSudahLogin();

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
      <Reveal>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          {sudahLogin ? 'Lanjutkan mengelola gudangmu' : 'Siap merapikan stok gudangmu?'}
        </h2>
        <p className="text-slate-600 text-base mb-6">
          {sudahLogin
            ? 'Kamu sudah masuk. Buka dashboard untuk melihat stok terbaru.'
            : 'Daftar sebagai Manager dan mulai kelola inventori hari ini juga.'}
        </p>
        <Link
          href={sudahLogin ? '/dashboard' : '/register'}
          className="inline-block px-8 py-3.5 rounded-xl bg-[#1E3A8A] text-white text-base font-semibold hover:bg-[#172E6E] transition shadow-sm"
        >
          {sudahLogin ? 'Buka Dashboard' : 'Buat Akun Gratis'}
        </Link>
      </Reveal>
    </section>
  );
}