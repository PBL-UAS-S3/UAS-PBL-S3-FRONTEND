'use client';

import { Menu } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function TopbarMobile({ onBuka }: { onBuka: () => void }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b-2 border-slate-200 px-4 py-3 flex items-center justify-between">
      <button onClick={onBuka} className="text-slate-900" aria-label="Buka menu">
        <Menu size={26} />
      </button>
      <div className="flex items-center gap-2">
        <Logo ukuran="sm" />
        <span className="font-bold text-slate-900 text-lg">Stockin</span>
      </div>
      <div className="w-6" />
    </div>
  );
}