"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ScanLine,
  Sparkles,
  ShoppingCart,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

function IlustrasiPaket({ ukuran = "lg" }: { ukuran?: "lg" | "md" }) {
  const lebar = ukuran === "lg" ? "max-w-sm" : "max-w-xs";
  return (
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/paket6.png"
        alt="Ilustrasi Paket Gudang"
        className={`w-full h-auto ${lebar} object-contain drop-shadow-2xl`}
      />
    </motion.div>
  );
}

const fiturList = [
  {
    ikon: "📷",
    judul: "Scan Barcode/QR",
    desk: "Staf gudang catat barang masuk & keluar cukup dengan scan dari HP.",
  },
  {
    ikon: "✨",
    judul: "AI Insight",
    desk: "Gemini menganalisis histori transaksi dan memberi rekomendasi restock.",
  },
  {
    ikon: "🛒",
    judul: "Purchase Order",
    desk: "Buat PO langsung dari rekomendasi AI, satu klik untuk approve.",
  },
  {
    ikon: "📊",
    judul: "Dashboard Real-time",
    desk: "Pantau stok, nilai inventori, dan tren transaksi dalam satu layar.",
  },
];

const caraKerjaList = [
  {
    Icon: ScanLine,
    judul: "Staf Scan Barang",
    desk: "Staf gudang scan barcode/QR produk lewat aplikasi mobile saat barang masuk atau keluar.",
  },
  {
    Icon: LayoutDashboard,
    judul: "Data Masuk Otomatis",
    desk: "Stok dan riwayat transaksi langsung terupdate real-time di dashboard web Manager.",
  },
  {
    Icon: Sparkles,
    judul: "AI Menganalisis Tren",
    desk: "Gemini membaca histori 30 hari terakhir dan memberi rekomendasi kapan & berapa jumlah restock.",
  },
  {
    Icon: ShoppingCart,
    judul: "Manager Approve PO",
    desk: "Manager tinggal review rekomendasi, buat Purchase Order, dan approve dalam satu klik.",
  },
];

const faqRingkas = [
  {
    q: "Apakah staf gudang bisa akses dashboard web?",
    a: "Tidak. Dashboard web khusus untuk akun Manager, staf gudang menggunakan aplikasi mobile.",
  },
  {
    q: "Bagaimana AI menentukan rekomendasi restock?",
    a: "Gemini menganalisis rata-rata barang keluar 30 hari terakhir ditambah stok pengaman, lalu memberi estimasi kapan stok habis.",
  },
  {
    q: "Apakah SKU dan barcode dibuat manual?",
    a: "Tidak, SKU dibuat otomatis oleh sistem begitu produk baru ditambahkan, dan langsung bisa diunduh sebagai barcode/QR.",
  },
  {
    q: "Apakah saya bisa mengubah jumlah restock dari AI?",
    a: "Bisa. Rekomendasi AI hanya saran, Manager tetap bisa mengedit jumlah sebelum membuat Purchase Order.",
  },
];

// Kartu mockup dashboard dengan efek 3D tilt — miring mengikuti posisi mouse
function MockupDashboard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rotasi, setRotasi] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const persenX = (e.clientX - rect.left) / rect.width - 0.5;
    const persenY = (e.clientY - rect.top) / rect.height - 0.5;

    setRotasi({ x: persenY * -10, y: persenX * 10 });
  }

  function handleMouseLeave() {
    setRotasi({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className="max-w-3xl mx-auto"
    >
      <motion.div
        animate={{ rotateX: rotasi.x, rotateY: rotasi.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
        className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden"
      >
        <div className="bg-slate-100 border-b-2 border-slate-200 px-4 py-2.5 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-slate-400 bg-white rounded px-3 py-1 border border-slate-200">
            stockin.app/dashboard
          </span>
        </div>
        <div className="flex">
          <div className="w-16 md:w-40 bg-white border-r-2 border-slate-100 py-4 px-2 md:px-3 space-y-2 shrink-0">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#F2842F] text-white text-xs font-semibold">
              <span>🏠</span>
              <span className="hidden md:inline">Dashboard</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
              <span>📦</span>
              <span className="hidden md:inline">Master Data</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
              <span>✨</span>
              <span className="hidden md:inline">AI Insight</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 text-xs font-medium">
              <span>🛒</span>
              <span className="hidden md:inline">Purchase Order</span>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-5 bg-[#FBF8F5]">
            <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4">
              <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-slate-400">Produk</p>
                <p className="text-sm md:text-lg font-bold text-slate-900">
                  128
                </p>
              </div>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-slate-400">Menipis</p>
                <p className="text-sm md:text-lg font-bold text-red-600">6</p>
              </div>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-slate-400">
                  Transaksi
                </p>
                <p className="text-sm md:text-lg font-bold text-slate-900">
                  24
                </p>
              </div>
              <div className="bg-[#F2842F] rounded-xl p-2 md:p-3">
                <p className="text-[9px] md:text-xs text-white/80">
                  Nilai Stok
                </p>
                <p className="text-sm md:text-lg font-bold text-white">
                  Rp82jt
                </p>
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
      </motion.div>
    </div>
  );
}

// Mockup mini generik untuk galeri fitur (Master Data, AI Insight, Purchase Order)
function MockupMini({
  judul,
  children,
}: {
  judul: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden h-full">
      <div className="bg-slate-100 border-b-2 border-slate-200 px-3 py-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[10px] text-slate-400">{judul}</span>
      </div>
      <div className="p-3 bg-[#FBF8F5] h-[180px]">{children}</div>
    </div>
  );
}

function MockupMasterData() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden text-[9px]">
      <div className="bg-[#FDE9D6] px-2 py-1.5 font-bold text-[#7A3505] flex justify-between">
        <span>Produk</span>
        <span>Stok</span>
        <span>Status</span>
      </div>
      {["Kabel HDMI", "Mouse Wireless", "Keyboard"].map((n, i) => (
        <div
          key={n}
          className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#FEF1E6] shrink-0" />
            <span className="text-slate-700">{n}</span>
          </div>
          <span className="font-bold text-slate-900">{[12, 3, 24][i]}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${i === 1 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {i === 1 ? "Menipis" : "Aman"}
          </span>
        </div>
      ))}
    </div>
  );
}

function MockupAIInsight() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-2.5 text-[9px]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles size={12} className="text-[#F2842F]" />
        <span className="font-bold text-slate-900">Mouse Wireless</span>
        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[8px] font-bold">
          Perlu restock
        </span>
      </div>
      <p className="text-slate-500 leading-snug mb-2">
        Stok diperkirakan habis dalam 4 hari berdasarkan rata-rata keluar 30
        hari terakhir.
      </p>
      <div className="flex gap-1.5 items-center">
        <div className="bg-slate-100 rounded px-2 py-1 font-bold text-slate-700">
          25
        </div>
        <div className="flex-1 bg-[#F2842F] text-white text-center rounded py-1 font-semibold">
          Buat PO
        </div>
      </div>
    </div>
  );
}

function MockupPO() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden text-[9px]">
      <div className="bg-[#FDE9D6] px-2 py-1.5 font-bold text-[#7A3505] flex justify-between">
        <span>No. PO</span>
        <span>Jumlah</span>
        <span>Status</span>
      </div>
      {[
        { no: "PO-2026-003", jml: 25, status: "Menunggu" },
        { no: "PO-2026-002", jml: 10, status: "Selesai" },
      ].map((po) => (
        <div
          key={po.no}
          className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100"
        >
          <span className="font-mono text-slate-600">{po.no}</span>
          <span className="font-bold text-slate-900">{po.jml}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${po.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}
          >
            {po.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// Pembungkus animasi "muncul saat discroll" — dipakai berulang di tiap section
function Reveal({
  children,
  delay = 0,
  arah = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  arah?: "up" | "left" | "right";
}) {
  const offset =
    arah === "up" ? { y: 32 } : arah === "left" ? { x: -32 } : { x: 32 };
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [buka, setBuka] = useState(false);
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setBuka(!buka)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <span className="font-semibold text-slate-900 text-sm md:text-base">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-500 shrink-0 transition-transform ${buka ? "rotate-180" : ""}`}
        />
      </button>
      {buka && (
        <div className="px-4 pb-4 text-slate-600 text-sm border-t-2 border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FBF8F5] overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b-2 border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0000] flex items-center justify-center text-lg shrink-0">
              <img
                src="/logo4.png"
                alt="Stockin Logo"
                className="w-full h-full object-contain"
              />
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
              className="px-4 py-2 rounded-xl bg-[#F2842F] text-white text-sm md:text-base font-semibold hover:bg-[#DD6F1B] transition shadow-sm"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <Reveal arah="left">
          <span className="inline-block bg-[#FEF1E6] text-[#B9540A] text-xs md:text-sm font-bold px-3 py-1.5 rounded-full mb-4">
            Powered by AI (Gemini)
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Kelola gudang lebih cerdas,{" "}
            <span className="text-[#F2842F]">tanpa ribet.</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg mb-8">
            Stockin membantu manager memantau stok dan staf mencatat barang
            masuk/keluar lewat scan barcode — dilengkapi rekomendasi restock
            dari AI.
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
        </Reveal>

        <Reveal arah="right" delay={0.15}>
          <div className="flex justify-center">
            <IlustrasiPaket />
          </div>
        </Reveal>
      </section>

      {/* Cara Kerja */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <Reveal>
          <p className="text-center text-sm font-bold text-[#B9540A] uppercase tracking-wide mb-2">
            Alur Sederhana
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">
            Cara Kerja Stockin
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {caraKerjaList.map((c, idx) => (
            <Reveal key={c.judul} delay={idx * 0.1}>
              <div className="relative bg-white border-2 border-slate-200 rounded-2xl p-5 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#F2842F] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <c.Icon size={20} className="text-[#F2842F]" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {c.judul}
                </h3>
                <p className="text-slate-600 text-sm">{c.desk}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Preview aplikasi desktop — kartunya bisa di-tilt pakai mouse */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <Reveal>
          <p className="text-center text-sm font-bold text-[#B9540A] uppercase tracking-wide mb-2">
            Tampilan Aplikasi
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Satu dashboard untuk seluruh gudang
          </h2>
          <p className="text-center text-slate-500 text-sm mb-8">
            Gerakkan mouse di atas kartu untuk melihat efeknya
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <MockupDashboard />
        </Reveal>
      </section>

      {/* Galeri fitur lain */}
      <section className="bg-white border-y-2 border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <Reveal>
            <p className="text-center text-sm font-bold text-[#B9540A] uppercase tracking-wide mb-2">
              Jelajahi Lebih Dalam
            </p>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">
              Fitur lain di dalam Stockin
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Reveal delay={0}>
              <MockupMini judul="stockin.app/master-data">
                <MockupMasterData />
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  Master Data Inventory
                </p>
                <p className="text-[11px] text-slate-500">
                  Kelola produk, SKU otomatis, dan barcode.
                </p>
              </MockupMini>
            </Reveal>
            <Reveal delay={0.1}>
              <MockupMini judul="stockin.app/insight">
                <MockupAIInsight />
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  AI Insight
                </p>
                <p className="text-[11px] text-slate-500">
                  Rekomendasi restock dari analisis Gemini.
                </p>
              </MockupMini>
            </Reveal>
            <Reveal delay={0.2}>
              <MockupMini judul="stockin.app/po">
                <MockupPO />
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  Purchase Order
                </p>
                <p className="text-[11px] text-slate-500">
                  Buat dan approve PO dalam satu klik.
                </p>
              </MockupMini>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <Reveal>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Semua yang gudang kamu butuhkan
            </h2>
            <p className="text-center text-slate-600 text-base mb-10">
              Dari pencatatan harian sampai keputusan restock
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {fiturList.map((f, idx) => (
              <Reveal key={f.judul} delay={idx * 0.1}>
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 h-full">
                  <div className="w-11 h-11 rounded-xl bg-[#FEF1E6] flex items-center justify-center text-xl mb-3">
                    {f.ikon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {f.judul}
                  </h3>
                  <p className="text-slate-600 text-sm">{f.desk}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ringkas */}
      <section className="bg-white border-y-2 border-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <Reveal>
            <p className="text-center text-sm font-bold text-[#B9540A] uppercase tracking-wide mb-2">
              Pertanyaan Umum
            </p>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">
              Masih ada yang ingin ditanyakan?
            </h2>
          </Reveal>
          <div className="space-y-3">
            {faqRingkas.map((item, idx) => (
              <Reveal key={item.q} delay={idx * 0.08}>
                <FaqItem q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bawah */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
        <Reveal>
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
        </Reveal>
      </section>

      <footer className="border-t-2 border-slate-100 py-6">
        <p className="text-center text-sm text-slate-500">
          © 2026 Stockin — Smart Warehouse & Inventory System
        </p>
      </footer>
    </main>
  );
}
