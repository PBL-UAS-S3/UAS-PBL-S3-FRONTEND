import type { PO } from './types';

export function nomorPO(po: PO) {
  const tahun = new Date(po.created_at).getFullYear();
  return `PO-${tahun}-${String(po.id).padStart(3, '0')}`;
}

export function totalPO(po: PO) {
  return po.jumlah * Number(po.harga || 0);
}