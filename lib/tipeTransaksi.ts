import type { TipeTransaksi } from '@/types/transaksi';

export const INFO_TIPE: Record<TipeTransaksi, { label: string; kelas: string; alur: string | null }> = {
  in: { label: 'Masuk', kelas: 'bg-emerald-100 text-emerald-800 border-emerald-300', alur: null },
  out: { label: 'Keluar', kelas: 'bg-red-100 text-red-800 border-red-300', alur: null },
  rusak: { label: 'Pisah Rusak', kelas: 'bg-violet-100 text-violet-800 border-violet-300', alur: 'Layak → Rusak' },
  buang_rusak: { label: 'Afkir', kelas: 'bg-slate-200 text-slate-800 border-slate-400', alur: 'Rusak → Dibuang' },
  pulih_rusak: { label: 'Dipulihkan', kelas: 'bg-sky-100 text-sky-800 border-sky-300', alur: 'Rusak → Layak' },
};

export function infoTipe(tipe: string) {
  return (
    INFO_TIPE[tipe as TipeTransaksi] ?? {
      label: tipe,
      kelas: 'bg-slate-100 text-slate-800 border-slate-300',
      alur: null,
    }
  );
}   