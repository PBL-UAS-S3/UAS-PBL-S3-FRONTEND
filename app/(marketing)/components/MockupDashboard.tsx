'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function MockupDashboard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 100,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 100,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="max-w-3xl mx-auto"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden transform-gpu"
      >
        <div className="bg-slate-100 border-b-2 border-slate-200 px-4 py-2.5 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-slate-400 bg-white rounded px-3 py-1 border border-slate-200">
            stockin.app/dashboard
          </span>
        </div>
        <div className="flex">
          <div className="w-16 md:w-40 bg-white border-r-2 border-slate-100 py-4 px-2 md:px-3 space-y-2 shrink-0">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold">
              <span>🏠</span>
              <span className="hidden md:inline">Dashboard</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
              <span>📦</span>
              <span className="hidden md:inline">Master Data</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
              <span>✨</span>
              <span className="hidden md:inline">AI Insight</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
              <span>🛒</span>
              <span className="hidden md:inline">Purchase Order</span>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-5 bg-[#F4F6FB]">
            <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4">
              <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-slate-400">Produk</p>
                <p className="text-sm md:text-lg font-bold text-slate-900">128</p>
              </div>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-slate-400">Menipis</p>
                <p className="text-sm md:text-lg font-bold text-red-600">6</p>
              </div>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-slate-400">Transaksi</p>
                <p className="text-sm md:text-lg font-bold text-slate-900">24</p>
              </div>
              <div className="bg-[#1E3A8A] rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-white/80">Nilai Stok</p>
                <p className="text-sm md:text-lg font-bold text-white">Rp82jt</p>
              </div>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-xl p-3 space-y-2">
              <div className="h-2 md:h-2.5 bg-[#DBE5FB] rounded-full w-full" />
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full w-5/6" />
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full w-4/6" />
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full w-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}