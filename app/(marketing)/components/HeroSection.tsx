'use client';

import Link from 'next/link';
import { Reveal } from './Reveal';
import { IlustrasiPaket } from './IlustrasiPaket';

export function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-10 grid md:grid-cols-2 gap-10 items-center">
      <Reveal>
        <span className="inline-block bg-[#E8EEFC] text-[#1E3A8A] text-xs md:text-sm font-bold px-3 py-1.5 rounded-full mb-4">
          Powered by AI (Gemini)
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
          Kelola gudang lebih cerdas, <span className="text-[#1E3A8A]">tanpa ribet.</span>
        </h1>
        <p className="text-slate-600 text-base md:text-lg mb-8">
          Stockin membantu manager memantau stok dan staf mencatat barang masuk/keluar lewat scan
          barcode — dilengkapi rekomendasi restock dari AI.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-[#1E3A8A] text-white text-base font-semibold hover:bg-[#172E6E] transition shadow-sm"
          >
            Mulai Sekarang →
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-800 text-base font-semibold hover:bg-white transition"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex justify-center">
          <IlustrasiPaket />
        </div>
      </Reveal>
    </section>
  );
}