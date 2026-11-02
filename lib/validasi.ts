export const MIN_PASSWORD = 8;
export const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const JEDA_KIRIM_KODE = 60;

export function emailValid(email: string) {
  return POLA_EMAIL.test(email.trim());
}