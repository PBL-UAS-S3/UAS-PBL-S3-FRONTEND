'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert, DialogKonfirmasi } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { ambilProduk, hapusProduk, simpanProduk, type DataProduk } from '@/services/produkService';
import type { Product } from '@/types/produk';
import { useFilterProduk } from './hooks/useFilterProduk';
import { useFormProduk } from './hooks/useFormProduk';
import { unduhBarcode } from './helpers';
import type { HasilSimpan } from './types';
import { FilterProduk } from './components/FilterProduk';
import { TabelProduk } from './components/TabelProduk';
import { FormProdukModal } from './components/FormProdukModal';
import { BarcodeModal } from './components/BarcodeModal';

export default function MasterDataPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [menghapus, setMenghapus] = useState(false);

  const [barcode, setBarcode] = useState<Product | null>(null);
  const [hapusTarget, setHapusTarget] = useState<Product | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const notif = useNotifikasi();
  const { daftarKategori, daftarSatuan, jumlahCocok, halaman, filter } = useFilterProduk(products);

  async function muat() {
    setLoading(true);
    setGalat('');

    const res = await ambilProduk();
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setProducts(res.data);
    } else {
      setGalat((res.data as any)?.error || 'Gagal memuat data produk');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function simpan(id: number | null, data: DataProduk): Promise<HasilSimpan> {
    const res = await simpanProduk(id, data);
    return { ok: res.ok, sesiHabis: res.sesiHabis, error: res.data?.error };
  }

  async function hapus() {
    if (!hapusTarget) return;
    setMenghapus(true);

    const res = await hapusProduk(hapusTarget.id);
    if (res.sesiHabis) return;

    if (res.ok) {
      notif.tampil('sukses', `Produk "${hapusTarget.nama}" berhasil dihapus`);
      await muat();
    } else {
      notif.tampil('error', res.data.error || 'Gagal menghapus produk');
    }
    setMenghapus(false);
    setHapusTarget(null);
  }

  async function unduh(produk: Product) {
    const berhasil = await unduhBarcode(produk.sku, produk.nama);
    if (!berhasil) notif.tampil('error', 'Gagal membuat file barcode untuk diunduh');
  }

  const fp = useFormProduk({
    onSimpan: simpan,
    onBerhasil: (pesan) => {
      notif.tampil('sukses', pesan);
      muat();
    },
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          judul="Master Data Inventory"
          deskripsi="Kelola data produk dan pantau status stok gudang"
          aksi={
            <button
              onClick={fp.bukaTambah}
              className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#172E6E] transition shadow-sm w-fit"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Produk</span>
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

        <FilterProduk {...filter} daftarKategori={daftarKategori} />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelProduk
            data={halaman.dataHalaman}
            loading={loading}
            kosong={jumlahCocok === 0}
            onEdit={fp.bukaEdit}
            onBarcode={setBarcode}
            onHapus={setHapusTarget}
            onZoom={setZoomUrl}
          />
          <Pagination
            halamanAktif={halaman.halamanAktif}
            totalHalaman={halaman.totalHalaman}
            onGanti={halaman.setHalaman}
            totalData={halaman.totalData}
            perHalaman={halaman.perHalaman}
          />
        </div>
      </div>

      <FormProdukModal fp={fp} daftarKategori={daftarKategori} daftarSatuan={daftarSatuan} />

      {barcode && (
        <BarcodeModal produk={barcode} onUnduh={() => unduh(barcode)} onTutup={() => setBarcode(null)} />
      )}

      <DialogKonfirmasi
        buka={!!hapusTarget}
        judul="Hapus produk ini?"
        pesan={
          hapusTarget
            ? `"${hapusTarget.nama}" (${hapusTarget.sku}) akan dihapus dan tidak bisa dikembalikan.`
            : ''
        }
        labelYa="Ya, hapus"
        memproses={menghapus}
        onYa={hapus}
        onBatal={() => !menghapus && setHapusTarget(null)}
      />

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}