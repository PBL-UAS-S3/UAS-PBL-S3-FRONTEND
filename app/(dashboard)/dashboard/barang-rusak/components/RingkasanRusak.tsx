import { AlertTriangle, Package, Wallet } from 'lucide-react';
import { KartuRingkasan } from '@/components/ui/KartuRingkasan';
import { formatRupiah } from '@/lib/format';

export function RingkasanRusak({
  loading,
  totalUnit,
  produkTerdampak,
  kerugian,
}: {
  loading: boolean;
  totalUnit: number;
  produkTerdampak: number;
  kerugian: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
      <KartuRingkasan
        label="Total Unit Rusak"
        nilai={loading ? '-' : totalUnit}
        Ikon={AlertTriangle}
        warnaNilai="text-violet-800"
        warnaIkon="bg-violet-100 text-violet-700"
      />
      <KartuRingkasan
        label="Produk Terdampak"
        nilai={loading ? '-' : produkTerdampak}
        Ikon={Package}
      />
      <KartuRingkasan
        label="Estimasi Kerugian"
        nilai={loading ? '-' : formatRupiah(kerugian)}
        Ikon={Wallet}
        warnaNilai="text-red-700"
        warnaIkon="bg-red-100 text-red-600"
        nilaiKelas="text-2xl md:text-3xl"
      />
    </div>
  );
}