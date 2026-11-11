import { api } from '@/lib/api';
import type { ResponAuth } from '@/types/auth';

export function masuk(email: string, password: string) {
  return api<ResponAuth>('/auth/login', {
    method: 'POST',
    body: { email, password },
    publik: true,
  });
}

export function daftarManager(data: {
  nama: string;
  email: string;
  password: string;
  telepon: string;
}) {
  return api<ResponAuth>('/auth/register', {
    method: 'POST',
    body: data,
    publik: true,
  });
}

export function kirimKodeReset(email: string) {
  return api<ResponAuth>('/auth/lupa-password', {
    method: 'POST',
    body: { email },
    publik: true,
  });
}

export function aturUlangPassword(email: string, kode: string, passwordBaru: string) {
  return api<ResponAuth>('/auth/reset-password', {
    method: 'POST',
    body: { email, kode, password_baru: passwordBaru },
    publik: true,
  });
}

export function kirimUlangKode(email: string) {
  return api<ResponAuth>('/auth/kirim-ulang-kode', {
    method: 'POST',
    body: { email },
    publik: true,
  });
}

export function verifikasiKode(email: string, kode: string) {
  return api<ResponAuth>('/auth/verifikasi-email', {
    method: 'POST',
    body: { email, kode },
    publik: true,
  });
}