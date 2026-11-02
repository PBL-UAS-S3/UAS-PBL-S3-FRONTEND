export type Sesi = { token: string; role: string; nama: string };

export function ambilToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function ambilSesi(): Sesi | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || !role) return null;
  return { token, role, nama: localStorage.getItem('nama') || '' };
}

export function simpanSesi(sesi: Sesi) {
  localStorage.setItem('token', sesi.token);
  localStorage.setItem('role', sesi.role);
  localStorage.setItem('nama', sesi.nama);
}

export function hapusSesi() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('nama');
}

// Sesi habis atau tidak valid: bersihkan data login lalu ke halaman login
export function keLogin() {
  hapusSesi();
  window.location.href = '/login';
}