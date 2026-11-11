import { api } from '@/lib/api';

export type DataProfil = {
  nama: string;
  email: string;
  telepon: string | null;
  error?: string;
};

export function ambilProfil() {
  return api<DataProfil>('/auth/profil');
}

export function ubahProfil(data: { nama: string; telepon: string }) {
  return api<{ error?: string }>('/auth/profil', { method: 'PUT', body: data });
}

// 401 di sini berarti "password lama salah", bukan sesi habis
export function gantiPassword(passwordLama: string, passwordBaru: string) {
  return api<{ error?: string }>('/auth/ganti-password', {
    method: 'PUT',
    body: { password_lama: passwordLama, password_baru: passwordBaru },
    abaikanSesiHabis: true,
  });
}