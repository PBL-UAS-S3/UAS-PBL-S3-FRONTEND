export type Product = {
  id: number;
  sku: string;
  nama: string;
  kategori: string | null;
  satuan: string | null;
  harga: number;
  gambar: string | null;
  stok_saat_ini: number;
  stok_rusak: number;
  stok_minimum: number;
};