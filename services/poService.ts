import { api } from '@/lib/api';
import type { PO } from '@/types/po';

export type DataPO = {
  sku: string;
  jumlah: number;
  catatan: string;
};

export function ambilPO() {
  return api<PO[]>('/purchase-orders');
}

export function buatPurchaseOrder(data: DataPO) {
  return api<{ error?: string }>('/purchase-orders', { method: 'POST', body: data });
}

export function setujuiPO(id: number) {
  return api<{ stok_baru?: number; error?: string }>(`/purchase-orders/${id}/selesai`, {
    method: 'PUT',
  });
}

export function tolakPO(id: number, alasan: string) {
  return api<{ error?: string }>(`/purchase-orders/${id}/tolak`, {
    method: 'PUT',
    body: { alasan },
  });
}