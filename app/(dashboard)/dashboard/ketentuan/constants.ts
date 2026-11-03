export type TabKetentuan = 'privasi' | 'syarat';

export type PasalKetentuan = { judul: string; isi: string };

export const OPSI_TAB: { nilai: TabKetentuan; label: string }[] = [
  { nilai: 'privasi', label: 'Kebijakan Privasi' },
  { nilai: 'syarat', label: 'Syarat Ketentuan' },
];

export const KEBIJAKAN_PRIVASI: PasalKetentuan[] = [
  {
    judul: 'Data yang Dikumpulkan',
    isi: 'Stockin menyimpan data akun (nama, email, nomor telepon), data produk, dan riwayat transaksi gudang yang kamu masukkan ke dalam sistem.',
  },
  {
    judul: 'Penggunaan Data',
    isi: 'Data digunakan untuk menjalankan fitur aplikasi, termasuk analisis AI Insight untuk rekomendasi restock. Data tidak dibagikan ke pihak ketiga di luar kebutuhan sistem (seperti Gemini API untuk analisis AI).',
  },
  {
    judul: 'Keamanan Data',
    isi: 'Password disimpan dalam bentuk terenkripsi (hash), dan akses ke data dibatasi berdasarkan peran (Manager/Staf).',
  },
  {
    judul: 'Perubahan Kebijakan',
    isi: 'Kebijakan ini dapat berubah sewaktu-waktu sesuai kebutuhan pengembangan aplikasi.',
  },
];

export const SYARAT_KETENTUAN: PasalKetentuan[] = [
  {
    judul: 'Penggunaan Layanan',
    isi: 'Aplikasi ini disediakan untuk membantu pengelolaan inventori gudang. Akun Manager bertanggung jawab atas keakuratan data yang dimasukkan.',
  },
  {
    judul: 'Peran Pengguna',
    isi: 'Akun Manager hanya dapat diakses lewat web, dan akun Staf Gudang hanya dapat diakses lewat aplikasi mobile.',
  },
  {
    judul: 'Rekomendasi AI',
    isi: 'Rekomendasi restock dari AI bersifat saran berdasarkan data historis, keputusan akhir pembelian tetap berada di tangan Manager.',
  },
  {
    judul: 'Batasan Tanggung Jawab',
    isi: 'Pengembang tidak bertanggung jawab atas kerugian yang timbul dari kesalahan input data oleh pengguna.',
  },
];