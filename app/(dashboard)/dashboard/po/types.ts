export type StatusPO = 'pending' | 'selesai' | 'ditolak';
export type TabPO = 'menunggu' | 'semua' | 'ditolak';

export type PO = {
  id: number;
  nama: string;
  sku: string;
  harga: number;
  gambar: string | null;
  jumlah: number;
  status: StatusPO;
  catatan: string | null;
  created_at: string;
};