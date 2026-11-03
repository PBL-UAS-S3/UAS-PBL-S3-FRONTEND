import Link from 'next/link';

export function NavbarHome() {
  return (
    <header className="sticky top-0 z-20 bg-white/95 border-b-2 border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#0000] flex items-center justify-center text-lg shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo4.png" alt="Stockin Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg text-slate-900">Stockin</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm md:text-base font-semibold text-slate-800 hover:bg-slate-100 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-sm md:text-base font-semibold hover:bg-[#172E6E] transition shadow-sm"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}