export type FormProduk = {
  nama: string;
  kategori: string;
  satuan: string;
  harga: string;
  gambar: string;
  stok_saat_ini: string;
  stok_minimum: string;
};

export type StatusKey = 'aman' | 'menipis' | 'habis';

export type HasilSimpan = {
  ok: boolean;
  sesiHabis?: boolean;
  error?: string;
};