'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert, DialogKonfirmasi } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import type { Product } from '@/types/produk';
import { useProduk } from './hooks/useProduk';
import { useFormProduk } from './hooks/useFormProduk';
import { unduhBarcode } from './helpers';
import { FilterProduk } from './components/FilterProduk';
import { TabelProduk } from './components/TabelProduk';
import { FormProdukModal } from './components/FormProdukModal';
import { BarcodeModal } from './components/BarcodeModal';

export default function MasterDataPage() {
  const p = useProduk();
  const fp = useFormProduk({
    onBerhasil: (pesan) => {
      p.notif.tampil('sukses', pesan);
      p.muat();
    },
  });

  const [barcode, setBarcode] = useState<Product | null>(null);
  const [hapusTarget, setHapusTarget] = useState<Product | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  async function unduh(produk: Product) {
    const berhasil = await unduhBarcode(produk.sku, produk.nama);
    if (!berhasil) p.notif.tampil('error', 'Gagal membuat file barcode untuk diunduh');
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) return;
    await p.hapus(hapusTarget);
    setHapusTarget(null);
  }

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

        {p.galat && (
          <Alert jenis="error" onClose={() => p.setGalat('')} className="mb-4">
            {p.galat}{' '}
            <button onClick={p.muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <NotifAlert notif={p.notif.notif} onTutup={p.notif.tutup} />

        <FilterProduk {...p.filter} daftarKategori={p.daftarKategori} />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelProduk
            data={p.halaman.dataHalaman}
            loading={p.loading}
            kosong={p.jumlahCocok === 0}
            onEdit={fp.bukaEdit}
            onBarcode={setBarcode}
            onHapus={setHapusTarget}
            onZoom={setZoomUrl}
          />
          <Pagination
            halamanAktif={p.halaman.halamanAktif}
            totalHalaman={p.halaman.totalHalaman}
            onGanti={p.halaman.setHalaman}
            totalData={p.halaman.totalData}
            perHalaman={p.halaman.perHalaman}
          />
        </div>
      </div>

      <FormProdukModal fp={fp} daftarKategori={p.daftarKategori} daftarSatuan={p.daftarSatuan} />

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
        memproses={p.menghapus}
        onYa={konfirmasiHapus}
        onBatal={() => !p.menghapus && setHapusTarget(null)}
      />

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}