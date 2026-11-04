'use client';

import { Plus } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { useBarangRusak } from './hooks/useBarangRusak';
import { useTindakan } from './hooks/useTindakan';
import { RingkasanRusak } from './components/RingkasanRusak';
import { TabelKarantina } from './components/TabelKarantina';
import { TabelAktivitas } from './components/TabelAktivitas';
import { ModalTindakan } from './components/ModalTindakan';

export default function BarangRusakPage() {
  const b = useBarangRusak();
  const t = useTindakan({
    products: b.products,
    onBerhasil: (pesan) => {
      b.notif.tampil('sukses', pesan);
      b.muat();
    },
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          judul="Barang Rusak"
          deskripsi="Karantina dan sortir barang cacat, terpisah dari stok layak"
          aksi={
            <button
              onClick={() => t.buka('pisah')}
              className="flex items-center gap-2 bg-violet-700 text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-violet-800 transition shadow-sm w-fit"
            >
              <Plus className="w-5 h-5" />
              <span>Pisahkan Barang Rusak</span>
            </button>
          }
        />

        {b.galat && (
          <Alert jenis="error" onClose={() => b.setGalat('')} className="mb-4">
            {b.galat}{' '}
            <button onClick={b.muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <NotifAlert notif={b.notif.notif} onTutup={b.notif.tutup} />

        <RingkasanRusak
          loading={b.loading}
          totalUnit={b.totalUnitRusak}
          produkTerdampak={b.produkRusak.length}
          kerugian={b.kerugian}
        />

        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
          Area Karantina &amp; Tersortir
        </h2>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <TabelKarantina
            data={b.produkRusak}
            loading={b.loading}
            onPulihkan={(p) => t.buka('pulih', p)}
            onAfkir={(p) => t.buka('afkir', p)}
          />
        </div>

        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
          Aktivitas Karantina Terbaru
        </h2>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelAktivitas data={b.aktivitas} loading={b.loading} />
        </div>
      </div>

      <ModalTindakan t={t} produkBisaDipisah={b.produkBisaDipisah} />
    </main>
  );
}