'use client';

import { Loader2, MapPin } from 'lucide-react';
import { DialogKonfirmasi } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { KartuKodeGudang } from '@/components/gudang/KartuKodeGudang';
import { useKodeGudang } from './hooks/useKodeGudang';
import { useAlamatGudang } from './hooks/useAlamatGudang';
import { usePetaLokasi } from './hooks/usePetaLokasi';
import { FormAlamat } from './components/FormAlamat';
import { PetaLokasi } from './components/PetaLokasi';
import { DaftarTautan } from './components/DaftarTautan';

export default function PengaturanPage() {
  const k = useKodeGudang();
  const a = useAlamatGudang();
  const peta = usePetaLokasi({
    siap: !a.loadingAwal,
    awalLat: a.lat,
    awalLon: a.lon,
    onTitikDipilih: a.pilihTitik,
  });

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          judul="Pengaturan"
          deskripsi="Kelola kode gudang, alamat gudang, dan bantuan"
        />

        <KartuKodeGudang
          kode={k.kode}
          tersalin={k.tersalin}
          onSalin={k.salin}
          onBuatBaru={() => k.setKonfirmasi(true)}
          membuat={k.membuat}
          deskripsi="Bagikan kode ini ke staf gudang. Staf mendaftar dulu di aplikasi mobile, lalu memasukkan kode ini di halaman Gudang Saya untuk mengajukan bergabung, dan kamu setujui di menu Staf Gudang. Kalau kode bocor, buat kode baru. Kode lama langsung tidak berlaku, staf yang sudah tergabung tidak terpengaruh."
        >
          <NotifAlert notif={k.notif.notif} onTutup={k.notif.tutup} className="mb-4" />
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

          {a.loadingAwal ? (
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
        buka={k.konfirmasi}
        judul="Buat kode gudang baru?"
        pesan="Kode lama langsung tidak berlaku. Staf yang sudah tergabung tidak terpengaruh, tapi staf baru harus memakai kode yang baru."
        labelYa="Ya, buat kode baru"
        bahaya={false}
        memproses={k.membuat}
        onYa={k.buatBaru}
        onBatal={() => !k.membuat && k.setKonfirmasi(false)}
      />
    </main>
  );
}