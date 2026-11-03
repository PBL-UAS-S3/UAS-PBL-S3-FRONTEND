'use client';

import Link from 'next/link';
import { Reveal } from './Reveal';

export function CtaSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
      <Reveal>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Siap merapikan stok gudangmu?
        </h2>
        <p className="text-slate-600 text-base mb-6">
          Daftar sebagai Manager dan mulai kelola inventori hari ini juga.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-xl bg-[#1E3A8A] text-white text-base font-semibold hover:bg-[#172E6E] transition shadow-sm"
        >
          Buat Akun Gratis
        </Link>
      </Reveal>
    </section>
  );
}