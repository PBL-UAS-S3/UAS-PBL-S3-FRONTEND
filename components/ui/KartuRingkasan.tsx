export function KartuRingkasan({
  label,
  nilai,
  Ikon,
  warnaNilai = 'text-slate-900',
  warnaIkon = 'bg-[#E8EEFC] text-[#1E3A8A]',
  gelap = false,
  nilaiKelas = 'text-3xl',
}: {
  label: string;
  nilai: string | number;
  Ikon: React.ElementType;
  warnaNilai?: string;
  warnaIkon?: string;
  // true = kartu navy penuh sebagai penekanan
  gelap?: boolean;
  nilaiKelas?: string;
}) {
  if (gelap) {
    return (
      <div className="bg-[#1E3A8A] rounded-2xl shadow-sm p-4 md:p-5 min-w-0 text-white">
        <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center mb-3">
          <Ikon size={22} />
        </div>
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        <p
          className={`font-bold truncate ${nilaiKelas}`}
          title={typeof nilai === 'string' ? nilai : undefined}
        >
          {nilai}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-4 md:p-5 min-w-0">
      <div className={`w-12 h-12 rounded-xl ${warnaIkon} flex items-center justify-center mb-3`}>
        <Ikon size={22} />
      </div>
      <p className="text-sm font-semibold text-slate-600 mb-1">{label}</p>
      <p className={`font-bold truncate ${nilaiKelas} ${warnaNilai}`}>{nilai}</p>
    </div>
  );
}