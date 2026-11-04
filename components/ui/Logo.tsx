export function Logo({ ukuran = 'md' }: { ukuran?: 'sm' | 'md' }) {
  const kotak = ukuran === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  return (
    <div
      className={`${kotak} rounded-xl bg-[#0000] flex items-center justify-center shrink-0 p-1.5`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo4.png" alt="Stockin Logo" className="w-full h-full object-contain" />
    </div>
  );
}