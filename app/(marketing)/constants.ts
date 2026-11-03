import { LayoutDashboard, ScanLine, ShoppingCart, Sparkles } from 'lucide-react';
import type { ItemFaq } from '@/components/ui/AkordeonFaq';

export const FITUR_LIST = [
  {
    ikon: '📷',
    judul: 'Scan Barcode/QR',
    desk: 'Staf gudang catat barang masuk & keluar cukup dengan scan dari HP.',
  },
  {
    ikon: '✨',
    judul: 'AI Insight',
    desk: 'Gemini menganalisis histori transaksi dan memberi rekomendasi restock.',
  },
  {
    ikon: '🛒',
    judul: 'Purchase Order',
    desk: 'Buat PO langsung dari rekomendasi AI, satu klik untuk approve.',
  },
  {
    ikon: '📊',
    judul: 'Dashboard Real-time',
    desk: 'Pantau stok, nilai inventori, dan tren transaksi dalam satu layar.',
  },
];

export const CARA_KERJA_LIST = [
  {
    Icon: ScanLine,
    judul: 'Staf Scan Barang',
    desk: 'Staf gudang scan barcode/QR produk lewat aplikasi mobile saat barang masuk atau keluar.',
  },
  {
    Icon: LayoutDashboard,
    judul: 'Data Masuk Otomatis',
    desk: 'Stok dan riwayat transaksi langsung terupdate real-time di dashboard web Manager.',
  },
  {
    Icon: Sparkles,
    judul: 'AI Menganalisis Tren',
    desk: 'Gemini membaca histori 30 hari terakhir dan memberi rekomendasi kapan & berapa jumlah restock.',
  },
  {
    Icon: ShoppingCart,
    judul: 'Manager Approve PO',
    desk: 'Manager tinggal review rekomendasi, buat Purchase Order, dan approve dalam satu klik.',
  },
];

export const FAQ_RINGKAS: ItemFaq[] = [
  {
    q: 'Apakah staf gudang bisa akses dashboard web?',
    a: 'Tidak. Dashboard web khusus untuk akun Manager, staf gudang menggunakan aplikasi mobile.',
  },
  {
    q: 'Bagaimana AI menentukan rekomendasi restock?',
    a: 'Gemini menganalisis rata-rata barang keluar 30 hari terakhir ditambah stok pengaman, lalu memberi estimasi kapan stok habis.',
  },
  {
    q: 'Apakah SKU dan barcode dibuat manual?',
    a: 'Tidak, SKU dibuat otomatis oleh sistem begitu produk baru ditambahkan, dan langsung bisa diunduh sebagai barcode/QR.',
  },
  {
    q: 'Apakah saya bisa mengubah jumlah restock dari AI?',
    a: 'Bisa. Rekomendasi AI hanya saran, Manager tetap bisa mengedit jumlah sebelum membuat Purchase Order.',
  },
];