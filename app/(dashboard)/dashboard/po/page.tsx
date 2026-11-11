'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { ModalZoomGambar } from '@/components/ui/ModalZoomGambar';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { ambilPO, setujuiPO, tolakPO } from '@/services/poService';
import { useFilterPO } from './hooks/useFilterPO';
import { nomorPO, totalPO } from './helpers';
import type { PO } from './types';
import { RingkasanPO } from './components/RingkasanPO';
import { ToolbarPO } from './components/ToolbarPO';
import { TabelPO } from './components/TabelPO';
import { ModalDetailPO } from './components/ModalDetailPO';
import { ModalTolakPO } from './components/ModalTolakPO';

export default function PurchaseOrderPage() {
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [prosesId, setProsesId] = useState<number | null>(null);

  const [detail, setDetail] = useState<PO | null>(null);
  const [tolakTarget, setTolakTarget] = useState<PO | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  const notif = useNotifikasi();
  const { tab, setTab, searchText, setSearchText, jumlahSesuaiTab, jumlahTersaring, halaman } =
    useFilterPO(pos);

  async function muat() {
    setLoading(true);
    setGalat('');

    const res = await ambilPO();
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setPos(res.data);
    } else {
      setPos([]);
      setGalat((res.data as any)?.error || 'Gagal memuat data Purchase Order');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function setujui(po: PO) {
    setProsesId(po.id);

    const res = await setujuiPO(po.id);
    if (res.sesiHabis) return;

    if (res.ok) {
      notif.tampil(
        'sukses',
        `${nomorPO(po)} disetujui. Stok ${po.nama} bertambah ${po.jumlah} menjadi ${res.data.stok_baru}.`,
      );
      await muat();
    } else {
      notif.tampil('error', res.data.error || 'Gagal menyetujui Purchase Order');
    }
    setProsesId(null);
  }

  // Mengembalikan pesan error, atau null kalau berhasil
  async function tolak(po: PO, alasan: string): Promise<string | null> {
    setProsesId(po.id);

    const res = await tolakPO(po.id, alasan);
    if (res.sesiHabis) return null;
    setProsesId(null);

    if (res.ok) {
      notif.tampil('sukses', `${nomorPO(po)} ditolak. Stok tidak berubah.`);
      await muat();
      return null;
    }
    return res.data.error || 'Gagal menolak Purchase Order';
  }

  const jumlahMenunggu = pos.filter((p) => p.status === 'pending').length;
  const jumlahDitolak = pos.filter((p) => p.status === 'ditolak').length;
  const jumlahSelesai = pos.filter((p) => p.status === 'selesai').length;
  const nilaiBerjalan = pos
    .filter((p) => p.status === 'pending')
    .reduce((total, p) => total + totalPO(p), 0);

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          judul="Purchase Order"
          deskripsi="Kelola dan setujui pesanan pembelian inventori bahan dan pasokan gudang."
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

        <RingkasanPO
          loading={loading}
          menunggu={jumlahMenunggu}
          nilaiBerjalan={nilaiBerjalan}
          selesai={jumlahSelesai}
        />

        <ToolbarPO
          tab={tab}
          setTab={setTab}
          jumlahMenunggu={jumlahMenunggu}
          jumlahSemua={pos.length}
          jumlahDitolak={jumlahDitolak}
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <TabelPO
            data={halaman.dataHalaman}
            loading={loading}
            kosong={jumlahTersaring === 0}
            prosesId={prosesId}
            onSetujui={setujui}
            onTolak={setTolakTarget}
            onLihat={setDetail}
            onZoom={setZoomUrl}
          />
          {!loading && (
            <div className="px-5 py-3 border-t-2 border-slate-100 text-base text-slate-600">
              Total {jumlahTersaring} PO • Menampilkan {halaman.dataHalaman.length} dari{' '}
              {jumlahSesuaiTab} rekaman
            </div>
          )}
          <Pagination
            halamanAktif={halaman.halamanAktif}
            totalHalaman={halaman.totalHalaman}
            onGanti={halaman.setHalaman}
            totalData={halaman.totalData}
            perHalaman={halaman.perHalaman}
          />
        </div>
      </div>

      {detail && (
        <ModalDetailPO po={detail} onTutup={() => setDetail(null)} onZoom={setZoomUrl} />
      )}

      {tolakTarget && (
        <ModalTolakPO
          po={tolakTarget}
          memproses={prosesId === tolakTarget.id}
          onTolak={async (alasan) => {
            const err = await tolak(tolakTarget, alasan);
            if (!err) setTolakTarget(null);
            return err;
          }}
          onTutup={() => setTolakTarget(null)}
        />
      )}

      {zoomUrl && <ModalZoomGambar url={zoomUrl} onClose={() => setZoomUrl(null)} />}
    </main>
  );
}