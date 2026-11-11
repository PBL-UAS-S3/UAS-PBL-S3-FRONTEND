import { api } from '@/lib/api';
import type { Staf } from '@/types/staf';

export function ambilStaf() {
  return api<Staf[]>('/gudang/staf');
}

export function ambilGudangSaya() {
  return api<{ kode?: string }>('/gudang/saya');
}

export function buatKodeBaru() {
  return api<{ kode?: string; error?: string }>('/gudang/kode-baru', { method: 'POST' });
}

export function setujuiStaf(id: number) {
  return api<{ error?: string }>(`/gudang/staf/${id}/setujui`, { method: 'PUT' });
}

export function keluarkanStaf(id: number) {
  return api<{ error?: string }>(`/gudang/staf/${id}/keluarkan`, { method: 'PUT' });
}