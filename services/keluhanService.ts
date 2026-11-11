import { api } from '@/lib/api';

export function kirimKeluhan(pesan: string) {
  return api<{ message?: string; error?: string }>('/keluhan', {
    method: 'POST',
    body: { pesan },
  });
}