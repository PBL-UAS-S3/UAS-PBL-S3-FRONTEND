import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';

export function BannerRusak({ totalUnit, jumlahProduk }: { totalUnit: number; jumlahProduk: number }) {
  if (totalUnit <= 0) return null;

  return (
    <Alert jenis="rusak" judul={`${totalUnit} unit barang rusak tersortir`} className="mb-8">
      Tersebar di {jumlahProduk} produk dan tidak dihitung sebagai stok layak.{' '}
      <Link href="/dashboard/barang-rusak" className="font-bold underline">
        Kelola barang rusak
      </Link>
    </Alert>
  );
}