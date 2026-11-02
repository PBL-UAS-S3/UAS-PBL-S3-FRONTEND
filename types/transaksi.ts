export type TipeTransaksi = 'in' | 'out' | 'rusak' | 'buang_rusak' | 'pulih_rusak';

export type Transaksi = {
  id: number;
  nama: string;
  sku: string;
  gambar: string | null;
  tipe: TipeTransaksi;
  jumlah: number;
  catatan: string | null;
  created_at: string;
  nama_staf: string;
};