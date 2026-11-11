'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { ambilProduk } from '@/services/produkService';
import {
  ambilTransaksiTerbaru,
  catatTransaksi,
  type DataTransaksi,
} from '@/services/transaksiService';
import type { Product } from '@/types/produk';
import type { Transaksi } from '@/types/transaksi';
import { useRingkasanRusak } from './hooks/useRingkasanRusak';
import { useTindakan } from './hooks/useTindakan';
import type { HasilAksi } from './types';
import { RingkasanRusak } from './components/RingkasanRusak';
import { TabelKarantina } from './components/TabelKarantina';
import { TabelAktivitas } from './components/TabelAktivitas';
import { ModalTindakan } from './components/ModalTindakan';

export default function BarangRusakPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');

  const notif = useNotifikasi();
  const { produkRusak, totalUnitRusak, kerugian, produkBisaDipisah, aktivitas } =
    useRingkasanRusak(products, transaksi);

  async function muat() {
    setLoading(true);
    setGalat('');

    const [resProduk, resTransaksi] = await Promise.all([
      ambilProduk(),
      ambilTransaksiTerbaru(),
    ]);
    if (resProduk.sesiHabis || resTransaksi.sesiHabis) return;

    if (resProduk.ok && Array.isArray(resProduk.data)) {
      setProducts(resProduk.data);
    } else {
      setGalat((resProduk.data as any)?.error || 'Gagal memuat data produk');
    }
    setTransaksi(Array.isArray(resTransaksi.data) ? resTransaksi.data : []);
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function kirim(data: DataTransaksi): Promise<HasilAksi> {
    const res = await catatTransaksi(data);
    return { ok: res.ok, sesiHabis: res.sesiHabis, error: res.data?.error };
  }

  const t = useTindakan({
    products,
    onKirim: kirim,
    onBerhasil: (pesan) => {
      notif.tampil('sukses', pesan);
      muat();
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

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-4">
            {galat}{' '}
            <button onClick={muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <NotifAlert notif={notif.notif} onTutup={notif.tutup} />

        <RingkasanRusak
          loading={loading}
          totalUnit={totalUnitRusak}
          produkTerdampak={produkRusak.length}
          kerugian={kerugian}
        />

        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
          Area Karantina &amp; Tersortir
        </h2>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <TabelKarantina
            data={produkRusak}
            loading={loading}
            onPulihkan={(p) => t.buka('pulih', p)}
            onAfkir={(p) => t.buka('afkir', p)}
          />
        </div>

        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">
          Aktivitas Karantina Terbaru
        </h2>
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelAktivitas data={aktivitas} loading={loading} />
        </div>
      </div>

      <ModalTindakan t={t} produkBisaDipisah={produkBisaDipisah} />
    </main>
  );
}