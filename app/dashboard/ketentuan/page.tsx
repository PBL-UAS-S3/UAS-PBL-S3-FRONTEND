'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';

export default function KetentuanPage() {
  const [tab, setTab] = useState<'privasi' | 'syarat'>('privasi');

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={28} className="text-[#F2842F]" /> Ketentuan & Kebijakan
          </h1>
          <p className="text-slate-600 text-base">
            Dokumen ini adalah contoh placeholder untuk keperluan tugas, belum ditinjau oleh ahli hukum.
          </p>
        </div>

        <div className="inline-flex bg-white border-2 border-slate-200 rounded-xl p-1 mb-5">
          <button
            onClick={() => setTab('privasi')}
            className={`px-4 py-2 rounded-lg text-base font-semibold transition ${
              tab === 'privasi' ? 'bg-[#F2842F] text-white shadow-sm' : 'text-slate-700 hover:bg-[#FEF1E6]'
            }`}
          >
            Kebijakan Privasi
          </button>
          <button
            onClick={() => setTab('syarat')}
            className={`px-4 py-2 rounded-lg text-base font-semibold transition ${
              tab === 'syarat' ? 'bg-[#F2842F] text-white shadow-sm' : 'text-slate-700 hover:bg-[#FEF1E6]'
            }`}
          >
            Syarat Ketentuan
          </button>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 text-base text-slate-700 leading-relaxed">
          {tab === 'privasi' ? (
            <>
              <p><b className="text-slate-900">1. Data yang Dikumpulkan.</b> Stockin menyimpan data akun (nama, email, nomor telepon), data produk, dan riwayat transaksi gudang yang kamu masukkan ke dalam sistem.</p>
              <p><b className="text-slate-900">2. Penggunaan Data.</b> Data digunakan untuk menjalankan fitur aplikasi, termasuk analisis AI Insight untuk rekomendasi restock. Data tidak dibagikan ke pihak ketiga di luar kebutuhan sistem (seperti Gemini API untuk analisis AI).</p>
              <p><b className="text-slate-900">3. Keamanan Data.</b> Password disimpan dalam bentuk terenkripsi (hash), dan akses ke data dibatasi berdasarkan peran (Manager/Staf).</p>
              <p><b className="text-slate-900">4. Perubahan Kebijakan.</b> Kebijakan ini dapat berubah sewaktu-waktu sesuai kebutuhan pengembangan aplikasi.</p>
            </>
          ) : (
            <>
              <p><b className="text-slate-900">1. Penggunaan Layanan.</b> Aplikasi ini disediakan untuk membantu pengelolaan inventori gudang. Akun Manager bertanggung jawab atas keakuratan data yang dimasukkan.</p>
              <p><b className="text-slate-900">2. Peran Pengguna.</b> Akun Manager hanya dapat diakses lewat web, dan akun Staf Gudang hanya dapat diakses lewat aplikasi mobile.</p>
              <p><b className="text-slate-900">3. Rekomendasi AI.</b> Rekomendasi restock dari AI bersifat saran berdasarkan data historis, keputusan akhir pembelian tetap berada di tangan Manager.</p>
              <p><b className="text-slate-900">4. Batasan Tanggung Jawab.</b> Pengembang tidak bertanggung jawab atas kerugian yang timbul dari kesalahan input data oleh pengguna.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}