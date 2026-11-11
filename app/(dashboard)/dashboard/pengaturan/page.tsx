'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { DialogKonfirmasi } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { KartuKodeGudang } from '@/components/gudang/KartuKodeGudang';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { useSalinTeks } from '@/hooks/useSalinTeks';
import { ambilGudangSaya, buatKodeBaru } from '@/services/gudangService';
import {
  ambilPengaturan,
  simpanPengaturan,
  type DataPengaturan,
} from '@/services/pengaturanService';
import type { HasilAksi } from './types';
import { useAlamatGudang } from './hooks/useAlamatGudang';
import { usePetaLokasi } from './hooks/usePetaLokasi';
import { FormAlamat } from './components/FormAlamat';
import { PetaLokasi } from './components/PetaLokasi';
import { DaftarTautan } from './components/DaftarTautan';

export default function PengaturanPage() {
  // Kode gudang
  const [kode, setKode] = useState('');
  const [membuat, setMembuat] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const notifKode = useNotifikasi();
  const salinan = useSalinTeks(() =>
    notifKode.tampil('error', 'Gagal menyalin otomatis, salin manual dari kotak kode.'),
  );

  // Alamat gudang
  const [loadingAwal, setLoadingAwal] = useState(true);

  async function simpanAlamat(data: DataPengaturan): Promise<HasilAksi> {
    const res = await simpanPengaturan(data);
    return { ok: res.ok, sesiHabis: res.sesiHabis, error: res.data?.error };
  }

  const a = useAlamatGudang({ onSimpan: simpanAlamat });
  const peta = usePetaLokasi({
    siap: !loadingAwal,
    awalLat: a.lat,
    awalLon: a.lon,
    onTitikDipilih: a.pilihTitik,
  });

  useEffect(() => {
    async function muatKode() {
      const res = await ambilGudangSaya();
      if (res.ok) setKode(res.data.kode || '');
    }

    async function muatAlamat() {
      setLoadingAwal(true);
      const res = await ambilPengaturan();
      if (res.sesiHabis) return;

      if (res.ok) {
        a.isiDariServer(res.data);
      } else {
        a.notif.tampil('error', res.data?.error || 'Tidak dapat terhubung ke server');
      }
      setLoadingAwal(false);
    }

    muatKode();
    muatAlamat();
  }, []);

  async function buatBaru() {
    setMembuat(true);

    const res = await buatKodeBaru();
    if (res.sesiHabis) return;

    if (res.ok && res.data.kode) {
      setKode(res.data.kode);
      notifKode.tampil(
        'sukses',
        `Kode gudang diganti menjadi ${res.data.kode}. Kode lama tidak berlaku lagi.`,
      );
    } else {
      notifKode.tampil('error', res.data.error || 'Gagal membuat kode baru');
    }
    setMembuat(false);
    setKonfirmasi(false);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          judul="Pengaturan"
          deskripsi="Kelola kode gudang, alamat gudang, dan bantuan"
        />

        <KartuKodeGudang
          kode={kode}
          tersalin={salinan.tersalin}
          onSalin={() => salinan.salin(kode)}
          onBuatBaru={() => setKonfirmasi(true)}
          membuat={membuat}
          deskripsi="Bagikan kode ini ke staf gudang. Staf mendaftar dulu di aplikasi mobile, lalu memasukkan kode ini di halaman Gudang Saya untuk mengajukan bergabung, dan kamu setujui di menu Staf Gudang. Kalau kode bocor, buat kode baru. Kode lama langsung tidak berlaku, staf yang sudah tergabung tidak terpengaruh."
        >
          <NotifAlert notif={notifKode.notif} onTutup={notifKode.tutup} className="mb-4" />
        </KartuKodeGudang>

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <MapPin size={20} className="text-[#1E3A8A]" /> Alamat Gudang
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Alamat ini berlaku untuk gudang kamu dan ditampilkan juga ke semua staf di aplikasi
            mobile. Cari alamat di kolom pencarian, lalu geser pin di peta untuk mengoreksi titik
            persis.
          </p>

          <div ref={a.alertRef}>
            <NotifAlert notif={a.notif.notif} onTutup={a.notif.tutup} className="mb-5" />
          </div>

          {loadingAwal ? (
            <div className="flex items-center gap-2 py-10 justify-center text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat data pengaturan...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">
              <FormAlamat
                a={a}
                onPilihHasil={(item) => {
                  const titik = a.pilihHasil(item);
                  peta.pindahKe(titik.lat, titik.lon);
                }}
              />
              <PetaLokasi mapRef={peta.mapRef} lat={a.lat} lon={a.lon} />
            </div>
          )}
        </div>

        <DaftarTautan />
      </div>

      <DialogKonfirmasi
        buka={konfirmasi}
        judul="Buat kode gudang baru?"
        pesan="Kode lama langsung tidak berlaku. Staf yang sudah tergabung tidak terpengaruh, tapi staf baru harus memakai kode yang baru."
        labelYa="Ya, buat kode baru"
        bahaya={false}
        memproses={membuat}
        onYa={buatBaru}
        onBatal={() => !membuat && setKonfirmasi(false)}
      />
    </main>
  );
}