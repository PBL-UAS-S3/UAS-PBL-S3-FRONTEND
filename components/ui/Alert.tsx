'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Trash2, X } from 'lucide-react';
import type { JenisAlert } from '@/types/ui';

// Diekspor ulang supaya import lama dari file ini tetap jalan selama masa migrasi
export { useNotifikasi } from '@/hooks/useNotifikasi';
export type { JenisAlert, Notif } from '@/types/ui';

const GAYA: Record<JenisAlert, { wadah: string; ikon: string; Ikon: React.ElementType }> = {
  error: { wadah: 'bg-red-50 border-red-300 text-red-900', ikon: 'text-red-600', Ikon: AlertCircle },
  sukses: { wadah: 'bg-emerald-50 border-emerald-300 text-emerald-900', ikon: 'text-emerald-600', Ikon: CheckCircle2 },
  info: { wadah: 'bg-[#E8EEFC] border-[#1E3A8A]/30 text-[#172554]', ikon: 'text-[#1E3A8A]', Ikon: Info },
  peringatan: { wadah: 'bg-amber-50 border-amber-300 text-amber-900', ikon: 'text-amber-600', Ikon: AlertTriangle },
  rusak: { wadah: 'bg-violet-50 border-violet-300 text-violet-900', ikon: 'text-violet-600', Ikon: AlertTriangle },
};

export function Alert({
  jenis = 'error',
  judul,
  children,
  onClose,
  className = '',
}: {
  jenis?: JenisAlert;
  judul?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const g = GAYA[jenis];
  const Ikon = g.Ikon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      role={jenis === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 ${g.wadah} ${className}`}
    >
      <Ikon size={20} className={`${g.ikon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0 text-[15px] leading-snug">
        {judul && <p className="font-bold">{judul}</p>}
        {children && <div className={judul ? 'mt-0.5' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="shrink-0 -mr-1 p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 transition"
        >
          <X size={18} />
        </button>
      )}
    </motion.div>
  );
}

export function DialogKonfirmasi({
  buka,
  judul,
  pesan,
  labelYa = 'Hapus',
  labelBatal = 'Batal',
  bahaya = true,
  memproses = false,
  onYa,
  onBatal,
}: {
  buka: boolean;
  judul: string;
  pesan: string;
  labelYa?: string;
  labelBatal?: string;
  bahaya?: boolean;
  memproses?: boolean;
  onYa: () => void;
  onBatal: () => void;
}) {
  useEffect(() => {
    if (!buka) return;
    const tekan = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBatal();
    };
    window.addEventListener('keydown', tekan);
    return () => window.removeEventListener('keydown', tekan);
  }, [buka, onBatal]);

  if (!buka) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]"
      onClick={onBatal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            bahaya ? 'bg-red-100 text-red-600' : 'bg-[#E8EEFC] text-[#1E3A8A]'
          }`}
        >
          {bahaya ? <Trash2 size={22} /> : <Info size={22} />}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{judul}</h3>
        <p className="text-base text-slate-600 mt-1 mb-6">{pesan}</p>
        <div className="flex gap-3">
          <button
            onClick={onYa}
            disabled={memproses}
            className={`flex-1 text-white text-base font-semibold py-2.5 rounded-xl transition disabled:opacity-60 ${
              bahaya ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1E3A8A] hover:bg-[#172E6E]'
            }`}
          >
            {memproses ? 'Memproses...' : labelYa}
          </button>
          <button
            onClick={onBatal}
            disabled={memproses}
            className="flex-1 border-2 border-slate-300 text-slate-800 text-base font-semibold py-2.5 rounded-xl hover:bg-slate-100 transition disabled:opacity-60"
          >
            {labelBatal}
          </button>
        </div>
      </motion.div>
    </div>
  );
}