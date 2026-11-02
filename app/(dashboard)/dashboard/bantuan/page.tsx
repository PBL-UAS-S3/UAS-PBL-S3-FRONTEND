'use client';

import { useState } from 'react';
import { LifeBuoy, ChevronDown } from 'lucide-react';

const DAFTAR_FAQ = [
  {
    q: 'Bagaimana cara menambah produk baru?',
    a: 'Buka menu Master Data, klik tombol "+ Tambah Produk", isi nama, kategori, satuan, harga, dan stok. SKU akan dibuat otomatis oleh sistem, jadi tidak perlu diisi manual.',
  },
  {
    q: 'Kenapa stok tidak berubah setelah staf melakukan transaksi?',
    a: 'Pastikan staf menekan tombol submit sampai muncul notifikasi "Berhasil" di aplikasi mobile. Refresh halaman Master Data atau Dashboard di web untuk melihat angka stok terbaru.',
  },
  {
    q: 'Bagaimana cara membuat Purchase Order?',
    a: 'Buka menu AI Insight, klik "Generate Insight Baru" untuk mendapat rekomendasi restock dari AI, lalu klik tombol "Buat PO" pada produk yang direkomendasikan. Jumlahnya bisa diubah manual sebelum dikirim.',
  },
  {
    q: 'Saya lupa password akun Manager, bagaimana solusinya?',
    a: 'Di halaman Login, klik "Lupa password?", lalu masukkan email dan password baru kamu. Fitur ini hanya tersedia untuk akun Manager.',
  },
  {
    q: 'Apakah staf gudang bisa mengakses dashboard web ini?',
    a: 'Tidak. Dashboard web ini khusus untuk akun Manager. Staf gudang menggunakan aplikasi mobile untuk scan barcode dan mencatat transaksi.',
  },
  {
    q: 'Kenapa hasil rekomendasi AI Insight kadang gagal muncul?',
    a: 'Biasanya karena server Gemini sedang sibuk atau batas pemakaian API gratis tercapai. Tunggu 1-2 menit lalu coba klik "Generate Insight Baru" lagi.',
  },
];

export default function BantuanPage() {
  const [terbuka, setTerbuka] = useState<number | null>(0);

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy size={28} className="text-[#1E3A8A]" /> Pusat Bantuan
          </h1>
          <p className="text-slate-600 text-base">Pertanyaan yang sering ditanyakan seputar Stockin</p>
        </div>

        <div className="space-y-3">
          {DAFTAR_FAQ.map((item, idx) => (
            <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setTerbuka(terbuka === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-3 p-5 text-left"
              >
                <span className="font-semibold text-slate-900 text-base">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-slate-500 shrink-0 transition-transform ${terbuka === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {terbuka === idx && (
                <div className="px-5 pb-5 text-slate-700 text-base border-t-2 border-slate-100 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}