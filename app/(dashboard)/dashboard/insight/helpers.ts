import type { Insight } from './types';

export function sudahAman(item: Insight) {
  return item.stok_saat_ini > item.stok_minimum;
}

// Tombol Buat PO hanya untuk insight terbaru yang stoknya masih di bawah minimum.
// Status PO tidak ikut dihitung, jadi PO yang ditolak tidak menghalangi PO baru.
export function tampilkanTombolPO(item: Insight) {
  return item.is_terbaru === 1 && !sudahAman(item) && item.jumlah_restock_disarankan > 0;
}