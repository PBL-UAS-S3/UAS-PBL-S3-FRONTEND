import type { ItemFaq } from '@/components/ui/AkordeonFaq';

export const DAFTAR_FAQ: ItemFaq[] = [
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
    a: 'Di halaman Login, klik "Lupa password?", masukkan email akunmu, lalu masukkan kode 6 digit yang dikirim ke email tersebut dan buat password baru. Untuk akun Staf, gunakan fitur "Lupa password" di aplikasi mobile.',
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