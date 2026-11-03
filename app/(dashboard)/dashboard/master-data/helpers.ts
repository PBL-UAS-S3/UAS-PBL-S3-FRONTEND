import type { Product } from '@/types/produk';
import type { StatusKey } from './types';

// Sama dengan aplikasi mobile: Habis, Menipis, Aman (dihitung dari stok layak saja)
export function statusKey(p: Product): StatusKey {
  if (p.stok_saat_ini <= 0) return 'habis';
  if (p.stok_saat_ini <= p.stok_minimum) return 'menipis';
  return 'aman';
}

export function rusakDari(p: Product): number {
  return Number(p.stok_rusak ?? 0);
}

// Hanya angka, tanpa nol di depan
export function bersihkanAngka(raw: string) {
  let bersih = raw.replace(/[^0-9]/g, '');
  if (bersih.length > 1) bersih = bersih.replace(/^0+/, '') || '0';
  return bersih;
}

export function formatRibuan(digits: string) {
  if (!digits) return '';
  return Number(digits).toLocaleString('id-ID');
}

// Membuat gambar QR + SKU + nama lalu mengunduhnya. true kalau berhasil.
export async function unduhBarcode(sku: string, nama: string): Promise<boolean> {
  const urlQr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(sku)}`;

  try {
    const res = await fetch(urlQr);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const img = await new Promise<HTMLImageElement>((ok, gagal) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => gagal(new Error('gambar QR gagal dimuat'));
      i.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 50, 30, 300, 300);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(sku, canvas.width / 2, 365);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText(nama, canvas.width / 2, 395);

    URL.revokeObjectURL(objectUrl);

    const hasil = await new Promise<Blob | null>((ok) => canvas.toBlob(ok));
    if (!hasil) return false;

    const tautan = URL.createObjectURL(hasil);
    const link = document.createElement('a');
    link.href = tautan;
    link.download = `barcode-${sku}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(tautan), 1000);
    return true;
  } catch (err) {
    return false;
  }
}