import Link from 'next/link';

export function AuthHeader({
  judul,
  subjudul,
}: {
  judul: string;
  subjudul: React.ReactNode;
}) {
  return (
    <>
      <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
        <div className="w-9 h-9 rounded-xl bg-[#0000] flex items-center justify-center text-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo4.png" alt="Stockin Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-bold text-xl text-slate-900">Stockin</span>
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{judul}</h1>
      <p className="text-slate-600 text-base mb-6">{subjudul}</p>
    </>
  );
}