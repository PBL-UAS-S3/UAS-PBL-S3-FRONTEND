import { api } from '@/lib/api';
import type { Transaksi } from '@/types/transaksi';

export type DataTransaksi = {
  sku: string;
  tipe: string;
  jumlah: number;
  catatan: string | null;
};

export function ambilTransaksiTerbaru() {
  return api<Transaksi[]>('/transactions/recent');
}

export function catatTransaksi(data: DataTransaksi) {
  return api<{ error?: string }>('/transactions', { method: 'POST', body: data });
}