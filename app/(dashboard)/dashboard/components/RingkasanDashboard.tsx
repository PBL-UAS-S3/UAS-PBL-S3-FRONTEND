import { AlertTriangle, Package, RefreshCw, Wallet } from 'lucide-react';
import { KartuRingkasan } from '@/components/ui/KartuRingkasan';
import { formatRupiah } from '@/lib/format';

function ukuranFontNilai(teks: string) {
  if (teks.length > 18) return 'text-lg md:text-xl';
  if (teks.length > 13) return 'text-xl md:text-2xl';
  return 'text-2xl md:text-3xl';
}

export function RingkasanDashboard({
  loading,
  totalProduk,
  stokMenipis,
  transaksiHariIni,
  nilaiStok,
}: {
  loading: boolean;
  totalProduk: number;
  stokMenipis: number;
  transaksiHariIni: number;
  nilaiStok: number;
}) {
  const teksNilai = loading ? '-' : formatRupiah(nilaiStok);

  return (
    <>
      <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
        Inventory Summary
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <KartuRingkasan label="Total Produk" nilai={loading ? '-' : totalProduk} Ikon={Package} />
        <KartuRingkasan
          label="Stok Menipis"
          nilai={loading ? '-' : stokMenipis}
          Ikon={AlertTriangle}
          warnaNilai="text-red-700"
          warnaIkon="bg-red-100 text-red-600"
        />
        <KartuRingkasan
          label="Transaksi Hari Ini"
          nilai={loading ? '-' : transaksiHariIni}
          Ikon={RefreshCw}
        />
        <KartuRingkasan
          gelap
          label="Nilai Stok Layak"
          nilai={teksNilai}
          Ikon={Wallet}
          nilaiKelas={ukuranFontNilai(teksNilai)}
        />
      </div>
    </>
  );
}