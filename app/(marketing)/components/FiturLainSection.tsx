'use client';

import { Reveal } from './Reveal';
import { MockupMini } from './MockupMini';
import { MockupMasterData } from './MockupMasterData';
import { MockupAIInsight } from './MockupAIInsight';
import { MockupPO } from './MockupPO';

export function FiturLainSection() {
  return (
    <section className="bg-white border-y-2 border-slate-100 py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-bold text-[#1E3A8A] uppercase tracking-wide mb-2">
            Jelajahi Lebih Dalam
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">
            Fitur lain di dalam Stockin
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Reveal delay={0}>
            <MockupMini judul="stockin.app/master-data">
              <MockupMasterData />
              <p className="mt-2 text-xs font-semibold text-slate-700">Master Data Inventory</p>
              <p className="text-[11px] text-slate-500">
                Kelola produk, SKU otomatis, dan barcode.
              </p>
            </MockupMini>
          </Reveal>
          <Reveal delay={0.05}>
            <MockupMini judul="stockin.app/insight">
              <MockupAIInsight />
              <p className="mt-2 text-xs font-semibold text-slate-700">AI Insight</p>
              <p className="text-[11px] text-slate-500">
                Rekomendasi restock dari analisis Gemini.
              </p>
            </MockupMini>
          </Reveal>
          <Reveal delay={0.1}>
            <MockupMini judul="stockin.app/po">
              <MockupPO />
              <p className="mt-2 text-xs font-semibold text-slate-700">Purchase Order</p>
              <p className="text-[11px] text-slate-500">Buat dan approve PO dalam satu klik.</p>
            </MockupMini>
          </Reveal>
        </div>
      </div>
    </section>
  );
}