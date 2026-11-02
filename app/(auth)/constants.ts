export type PanelAuth = { gambar: string; alt: string; teks: string };

export const PANEL_AUTH: Record<string, PanelAuth> = {
  '/login': {
    gambar: '/paket3.png',
    alt: 'Ilustrasi Paket Gudang',
    teks: 'Kelola stok gudang lebih cerdas dengan bantuan AI',
  },
  '/register': {
    gambar: '/paket4.png',
    alt: 'Ilustrasi Gudang',
    teks: 'Simple, fast, dan powerful buat tim gudang kamu',
  },
  '/lupa-password': {
    gambar: '/paket2.png',
    alt: 'Ilustrasi Gudang',
    teks: 'Tenang, akses ke gudang kamu bisa dipulihkan dalam hitungan detik',
  },
  '/verifikasi-email': {
    gambar: '/paket7.png',
    alt: 'Ilustrasi Gudang',
    teks: 'Satu langkah lagi, pastikan email ini benar milik kamu',
  },
};

export const PANEL_DEFAULT: PanelAuth = PANEL_AUTH['/login'];