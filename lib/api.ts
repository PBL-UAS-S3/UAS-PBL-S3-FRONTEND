import { API_URL } from './config';
import { ambilToken, keLogin } from './auth';

export type HasilApi<T = any> = {
  ok: boolean;
  status: number;
  data: T;
  sesiHabis: boolean;
};

type Opsi = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  // true untuk endpoint tanpa login (login, daftar, lupa password):
  // tidak membawa token dan 401/403 tidak dianggap sesi habis
  publik?: boolean;
  // true kalau 401/403 dari endpoint ini berarti error biasa (misalnya "password lama salah"),
  // bukan sesi habis. Token tetap dikirim, tapi tidak dialihkan ke halaman login.
  abaikanSesiHabis?: boolean;
};

// Satu pintu untuk semua panggilan ke backend:
// menambahkan token, menangani sesi habis (401/403), dan menangkap error jaringan.
export async function api<T = any>(path: string, opsi: Opsi = {}): Promise<HasilApi<T>> {
  const headers: Record<string, string> = {};

  if (!opsi.publik) {
    const token = ambilToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (opsi.body instanceof FormData) {
    body = opsi.body;
  } else if (opsi.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opsi.body);
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: opsi.method ?? 'GET',
      headers,
      body,
    });

    const cekSesi = !opsi.publik && !opsi.abaikanSesiHabis;
    if (cekSesi && (res.status === 401 || res.status === 403)) {
      keLogin();
      return {
        ok: false,
        status: res.status,
        data: { error: 'Sesi berakhir, silakan login ulang' } as unknown as T,
        sesiHabis: true,
      };
    }

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, sesiHabis: false };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: { error: 'Tidak dapat terhubung ke server' } as unknown as T,
      sesiHabis: false,
    };
  }
}