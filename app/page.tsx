'use client';

import Link from 'next/link';

function IlustrasiPaket({ ukuran = 'lg' }: { ukuran?: 'lg' | 'md' }) {
  const lebar = ukuran === 'lg' ? 'max-w-sm' : 'max-w-xs';
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/paket6.png"
      alt="Ilustrasi Paket Gudang"
      className={`w-full h-auto ${lebar} object-contain`}
    />
  );
}

const fiturList = [
  { ikon: '📷', judul: 'Scan Barcode/QR', desk: 'Staf gudang catat barang masuk & keluar cukup dengan scan dari HP.' },
  { ikon: '✨', judul: 'AI Insight', desk: 'Gemini menganalisis histori transaksi dan memberi rekomendasi restock.' },
  { ikon: '🛒', judul: 'Purchase Order', desk: 'Buat PO langsung dari rekomendasi AI, satu klik untuk approve.' },
  { ikon: '📊', judul: 'Dashboard Real-time', desk: 'Pantau stok, nilai inventori, dan tren transaksi dalam satu layar.' },
];

function MockupDashboard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden max-w-3xl mx-auto">
      {/* Bar atas ala browser */}
      <div className="bg-slate-100 border-b-2 border-slate-200 px-4 py-2.5 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-amber-400" />
        <span className="w-3 h-3 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs text-slate-400 bg-white rounded px-3 py-1 border border-slate-200">
          stockvision.app/dashboard
        </span>
      </div>
      <div className="flex">
        {/* Sidebar mini */}
        <div className="w-16 md:w-40 bg-white border-r-2 border-slate-100 py-4 px-2 md:px-3 space-y-2 shrink-0">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#F2842F] text-white text-xs font-semibold">
            <span>🏠</span><span className="hidden md:inline">Dashboard</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
            <span>📦</span><span className="hidden md:inline">Master Data</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
            <span>✨</span><span className="hidden md:inline">AI Insight</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
            <span>🛒</span><span className="hidden md:inline">Purchase Order</span>
          </div>
        </div>
        {/* Konten mini */}
        <div className="flex-1 p-4 md:p-5 bg-[#FBF8F5]">
          <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
              <p className="text-[9px] md:text-xs text-slate-400">Produk</p>
              <p className="text-sm md:text-lg font-bold text-slate-900">128</p>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
              <p className="text-[9px] md:text-xs text-slate-400">Menipis</p>
              <p className="text-sm md:text-lg font-bold text-red-600">6</p>
            </div>
            <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
              <p className="text-[9px] md:text-xs text-slate-400">Transaksi</p>
              <p className="text-sm md:text-lg font-bold text-slate-900">24</p>
            </div>
            <div className="bg-[#F2842F] rounded-xl p-2 md:p-3">
              <p className="text-[9px] md:text-xs text-white/80">Nilai Stok</p>
              <p className="text-sm md:text-lg font-bold text-white">Rp82jt</p>
            </div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-xl p-3 space-y-2">
            <div className="h-2 md:h-2.5 bg-[#FDE9D6] rounded-full w-full" />
            <div className="h-2 md:h-2.5 bg-slate-100 rounded-full w-5/6" />
            <div className="h-2 md:h-2.5 bg-slate-100 rounded-full w-4/6" />
            <div className="h-2 md:h-2.5 bg-slate-100 rounded-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FBF8F5]">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b-2 border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#F2842F] flex items-center justify-center text-lg shrink-0">📦</div>
            <span className="font-bold text-lg text-slate-900">StockVision</span>
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
              className="px-4 py-2 rounded-xl bg-[#F2842F] text-white text-sm md:text-base font-semibold hover:bg-[#DD6F1B] transition shadow-sm"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-[#FEF1E6] text-[#B9540A] text-xs md:text-sm font-bold px-3 py-1.5 rounded-full mb-4">
            Powered by AI (Gemini)
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Kelola gudang lebih cerdas, <span className="text-[#F2842F]">tanpa ribet.</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg mb-8">
            StockVision membantu manager memantau stok dan staf mencatat barang
            masuk/keluar lewat scan barcode — dilengkapi rekomendasi restock dari AI.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-[#F2842F] text-white text-base font-semibold hover:bg-[#DD6F1B] transition shadow-sm"
            >
              Mulai Sekarang →
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-800 text-base font-semibold hover:bg-white transition"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <IlustrasiPaket />
        </div>
      </section>

      {/* Preview aplikasi desktop */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <p className="text-center text-sm font-bold text-[#B9540A] uppercase tracking-wide mb-2">
          Tampilan Aplikasi
        </p>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Satu dashboard untuk seluruh gudang
        </h2>
        <MockupDashboard />
      </section>

      {/* Fitur */}
      <section className="bg-white border-y-2 border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Semua yang gudang kamu butuhkan
          </h2>
          <p className="text-center text-slate-600 text-base mb-10">
            Dari pencatatan harian sampai keputusan restock
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {fiturList.map((f) => (
              <div key={f.judul} className="bg-[#FBF8F5] border-2 border-slate-200 rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl bg-[#FEF1E6] flex items-center justify-center text-xl mb-3">
                  {f.ikon}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{f.judul}</h3>
                <p className="text-slate-600 text-sm">{f.desk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bawah */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Siap merapikan stok gudangmu?
        </h2>
        <p className="text-slate-600 text-base mb-6">
          Daftar sebagai Manager dan mulai kelola inventori hari ini juga.
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3.5 rounded-xl bg-[#F2842F] text-white text-base font-semibold hover:bg-[#DD6F1B] transition shadow-sm"
        >
          Buat Akun Gratis
        </Link>
      </section>

      <footer className="border-t-2 border-slate-100 py-6">
        <p className="text-center text-sm text-slate-500">
          © 2026 StockVision — Smart Warehouse & Inventory System
        </p>
      </footer>
    </main>
  );
}