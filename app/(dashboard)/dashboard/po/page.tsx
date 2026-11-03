'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { usePO } from './hooks/usePO';
import type { PO } from './types';
import { RingkasanPO } from './components/RingkasanPO';
import { ToolbarPO } from './components/ToolbarPO';
import { TabelPO } from './components/TabelPO';
import { ModalDetailPO } from './components/ModalDetailPO';
import { ModalTolakPO } from './components/ModalTolakPO';

export default function PurchaseOrderPage() {
  const p = usePO();
  const [detail, setDetail] = useState<PO | null>(null);
  const [tolakTarget, setTolakTarget] = useState<PO | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          judul="Purchase Order"
          deskripsi="Kelola dan setujui pesanan pembelian inventori bahan dan pasokan gudang."
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

        <RingkasanPO
          loading={p.loading}
          menunggu={p.jumlahMenunggu}
          nilaiBerjalan={p.nilaiBerjalan}
          selesai={p.jumlahSelesai}
        />

        <ToolbarPO
          tab={p.tab}
          setTab={p.setTab}
          jumlahMenunggu={p.jumlahMenunggu}
          jumlahSemua={p.jumlahPO}
          jumlahDitolak={p.jumlahDitolak}
          searchText={p.searchText}
          setSearchText={p.setSearchText}
        />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelPO
            data={p.halaman.dataHalaman}
            loading={p.loading}
            kosong={p.jumlahTersaring === 0}
            prosesId={p.prosesId}
            onSetujui={p.setujui}
            onTolak={setTolakTarget}
            onLihat={setDetail}
            onZoom={setZoomUrl}
          />
          {!p.loading && (
            <div className="px-5 py-3 border-t-2 border-slate-100 text-base text-slate-600">
              Total {p.jumlahTersaring} PO • Menampilkan {p.halaman.dataHalaman.length} dari{' '}
              {p.jumlahSesuaiTab} rekaman
            </div>
          )}
          <Pagination
            halamanAktif={p.halaman.halamanAktif}
            totalHalaman={p.halaman.totalHalaman}
            onGanti={p.halaman.setHalaman}
            totalData={p.halaman.totalData}
            perHalaman={p.halaman.perHalaman}
          />
        </div>
      </div>

      {detail && (
        <ModalDetailPO po={detail} onTutup={() => setDetail(null)} onZoom={setZoomUrl} />
      )}

      {tolakTarget && (
        <ModalTolakPO
          po={tolakTarget}
          memproses={p.prosesId === tolakTarget.id}
          onTolak={async (alasan) => {
            const galat = await p.tolak(tolakTarget, alasan);
            if (!galat) setTolakTarget(null);
            return galat;
          }}
          onTutup={() => setTolakTarget(null)}
        />
      )}

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}