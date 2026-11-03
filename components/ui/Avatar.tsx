export function Avatar({ nama, ukuran = 40 }: { nama: string; ukuran?: number }) {
  return (
    <div
      style={{ width: ukuran, height: ukuran, fontSize: Math.round(ukuran * 0.42) }}
      className="rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold shrink-0"
    >
      {nama.charAt(0).toUpperCase()}
    </div>
  );
}