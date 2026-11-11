export type Insight = {
  id: number;
  nama: string;
  sku: string;
  gambar: string | null;
  stok_saat_ini: number;
  stok_minimum: number;
  rekomendasi: string;
  jumlah_restock_disarankan: number;
  generated_at: string;
  is_terbaru: number;
};