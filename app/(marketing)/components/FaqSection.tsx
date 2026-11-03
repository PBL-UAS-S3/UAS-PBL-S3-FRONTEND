'use client';

import { AkordeonFaq } from '@/components/ui/AkordeonFaq';
import { Reveal } from './Reveal';
import { FAQ_RINGKAS } from '../constants';

export function FaqSection() {
  return (
    <section className="bg-white border-y-2 border-slate-100 py-16">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-bold text-[#1E3A8A] uppercase tracking-wide mb-2">
            Pertanyaan Umum
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">
            Masih ada yang ingin ditanyakan?
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <AkordeonFaq daftar={FAQ_RINGKAS} bukaAwal={null} ringkas />
        </Reveal>
      </div>
    </section>
  );
}