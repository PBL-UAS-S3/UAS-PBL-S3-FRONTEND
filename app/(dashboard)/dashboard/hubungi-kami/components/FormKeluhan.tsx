'use client';

import { Send } from 'lucide-react';
import { INPUT_KELAS } from '@/lib/ui';

export function FormKeluhan({
  pesan,
  setPesan,
  loading,
  onKirim,
}: {
  pesan: string;
  setPesan: (v: string) => void;
  loading: boolean;
  onKirim: () => void;
}) {
  return (
    <>
      <label className="text-sm font-semibold text-slate-700 mb-1 block">Pesan / Keluhan</label>
      <textarea
        value={pesan}
        onChange={(e) => setPesan(e.target.value)}
        placeholder="Jelaskan kendala yang kamu alami..."
        rows={8}
        className={INPUT_KELAS}
      />

      <button
        onClick={onKirim}
        disabled={loading}
        className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 mt-5"
      >
        <Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
    </>
  );
}