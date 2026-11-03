export function PageHeader({
  judul,
  deskripsi,
  Ikon,
  aksi,
}: {
  judul: string;
  deskripsi?: string;
  Ikon?: React.ElementType;
  // tombol di sisi kanan judul (opsional)
  aksi?: React.ReactNode;
}) {
  return (
    <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
          {Ikon && <Ikon size={28} className="text-[#1E3A8A]" />} {judul}
        </h1>
        {deskripsi && <p className="text-slate-600 text-base">{deskripsi}</p>}
      </div>
      {aksi}
    </div>
  );
}