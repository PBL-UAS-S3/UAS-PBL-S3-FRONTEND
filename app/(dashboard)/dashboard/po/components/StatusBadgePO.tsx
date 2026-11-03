export function StatusBadgePO({ status }: { status: string }) {
  if (status === 'selesai') {
    return (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold px-3 py-1 rounded-full">
        Selesai
      </span>
    );
  }
  if (status === 'ditolak') {
    return (
      <span className="bg-red-100 text-red-800 border border-red-300 text-sm font-bold px-3 py-1 rounded-full">
        Ditolak
      </span>
    );
  }
  return (
    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-sm font-bold px-3 py-1 rounded-full">
      Menunggu
    </span>
  );
}