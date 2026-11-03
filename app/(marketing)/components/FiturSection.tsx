'use client';

import { Reveal } from './Reveal';
import { FITUR_LIST } from '../constants';

export function FiturSection() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Semua yang gudang kamu butuhkan
          </h2>
          <p className="text-center text-slate-600 text-base mb-10">
            Dari pencatatan harian sampai keputusan restock
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {FITUR_LIST.map((f, idx) => (
            <Reveal key={f.judul} delay={idx * 0.05}>
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 h-full">
                <div className="w-11 h-11 rounded-xl bg-[#E8EEFC] flex items-center justify-center text-xl mb-3">
                  {f.ikon}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{f.judul}</h3>
                <p className="text-slate-600 text-sm">{f.desk}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}