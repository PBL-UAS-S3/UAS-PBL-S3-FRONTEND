import { api } from '@/lib/api';
import type { Product } from '@/types/produk';

export type DataProduk = {
  nama: string;
  kategori: string;
  satuan: string;
  harga: number;
  gambar: string;
  stok_saat_ini: number;
  stok_minimum: number;
};

export function ambilProduk() {
  return api<Product[]>('/products');
}

export function hapusProduk(id: number) {
  return api<{ error?: string }>(`/products/${id}`, { method: 'DELETE' });
}

export function simpanProduk(id: number | null, data: DataProduk) {
  return api<{ error?: string }>(id ? `/products/${id}` : '/products', {
    method: id ? 'PUT' : 'POST',
    body: data,
  });
}

export function unggahFotoProduk(file: File) {
  const formData = new FormData();
  formData.append('gambar', file);
  return api<{ url?: string; error?: string }>('/upload', {
    method: 'POST',
    body: formData,
  });
}