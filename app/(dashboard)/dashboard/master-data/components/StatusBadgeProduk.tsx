import type { StatusKey } from '../types';

const GAYA: Record<StatusKey, { label: string; kelas: string }> = {
  habis: { label: 'Habis', kelas: 'bg-red-100 text-red-800 border-red-300' },
  menipis: { label: 'Menipis', kelas: 'bg-amber-100 text-amber-900 border-amber-300' },
  aman: { label: 'Aman', kelas: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
};

export function StatusBadgeProduk({ status }: { status: StatusKey }) {
  const g = GAYA[status];
  return (
    <span className={`${g.kelas} border text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap`}>
      {g.label}
    </span>
  );
}