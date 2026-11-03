'use client';

import { Reveal } from './Reveal';
import { CARA_KERJA_LIST } from '../constants';

export function CaraKerjaSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
      <Reveal>
        <p className="text-center text-sm font-bold text-[#1E3A8A] uppercase tracking-wide mb-2">
          Alur Sederhana
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">
          Cara Kerja Stockin
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {CARA_KERJA_LIST.map((c, idx) => (
          <Reveal key={c.judul} delay={idx * 0.05}>
            <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-5 h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </div>
                <c.Icon size={20} className="text-[#1E3A8A]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">{c.judul}</h3>
              <p className="text-slate-600 text-sm">{c.desk}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}