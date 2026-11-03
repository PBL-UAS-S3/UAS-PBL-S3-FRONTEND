'use client';

import { Reveal } from './Reveal';
import { MockupDashboard } from './MockupDashboard';

export function PreviewDashboardSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
      <Reveal>
        <p className="text-center text-sm font-bold text-[#1E3A8A] uppercase tracking-wide mb-2">
          Tampilan Aplikasi
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Satu dashboard untuk seluruh gudang
        </h2>
        <p className="text-center text-slate-500 text-sm mb-8">
          Gerakkan mouse di atas kartu untuk melihat efeknya
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <MockupDashboard />
      </Reveal>
    </section>
  );
}