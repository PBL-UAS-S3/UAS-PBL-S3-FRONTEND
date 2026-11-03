import { CheckCircle2, Clock, Wallet } from 'lucide-react';
import { KartuRingkasan } from '@/components/ui/KartuRingkasan';
import { formatRupiah } from '@/lib/format';

export function RingkasanPO({
  loading,
  menunggu,
  nilaiBerjalan,
  selesai,
}: {
  loading: boolean;
  menunggu: number;
  nilaiBerjalan: number;
  selesai: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <KartuRingkasan
        label="Menunggu Approval"
        nilai={loading ? '-' : menunggu}
        Ikon={Clock}
        warnaNilai="text-[#1E3A8A]"
      />
      <KartuRingkasan
        gelap
        label="Total Nilai Berjalan"
        nilai={loading ? '-' : formatRupiah(nilaiBerjalan)}
        Ikon={Wallet}
      />
      <KartuRingkasan
        label="Total PO Selesai"
        nilai={loading ? '-' : selesai}
        Ikon={CheckCircle2}
        warnaNilai="text-emerald-700"
        warnaIkon="bg-emerald-100 text-emerald-700"
      />
    </div>
  );
}