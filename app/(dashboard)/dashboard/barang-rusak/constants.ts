import type { Mode } from './types';

export const ALASAN = [
  'Tidak berfungsi / mati',
  'Cacat produksi',
  'Rusak saat pengiriman',
  'Rusak saat penyimpanan',
  'Kedaluwarsa',
  'Lainnya (jelaskan di catatan)',
];

export const TIPE_BARU: Record<Mode, string> = {
  pisah: 'rusak',
  pulih: 'pulih_rusak',
  afkir: 'buang_rusak',
};

export const JUDUL_MODAL: Record<Mode, string> = {
  pisah: 'Pisahkan Barang Rusak',
  pulih: 'Pulihkan ke Stok Layak',
  afkir: 'Afkir Barang Rusak',
};

// Tipe transaksi yang ditampilkan di tabel aktivitas karantina
export const TIPE_KARANTINA = ['rusak', 'buang_rusak', 'pulih_rusak'];