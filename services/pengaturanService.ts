import { api } from '@/lib/api';

export type DataPengaturan = {
  nama_gudang: string;
  telepon: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  catatan: string;
  latitude: number | null;
  longitude: number | null;
};

export function ambilPengaturan() {
  return api<any>('/pengaturan');
}

export function simpanPengaturan(data: DataPengaturan) {
  return api<{ error?: string }>('/pengaturan', { method: 'PUT', body: data });
}