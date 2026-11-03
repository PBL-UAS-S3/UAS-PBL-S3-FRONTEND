'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Alert, DialogKonfirmasi } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { KartuKodeGudang } from '@/components/gudang/KartuKodeGudang';
import { useStaf } from './hooks/useStaf';
import type { AksiStaf, Staf } from './types';
import { TabelPermintaan } from './components/TabelPermintaan';
import { TabelStafAktif } from './components/TabelStafAktif';

export default function StafPage() {
  const s = useStaf();
  const [konfirmasi, setKonfirmasi] = useState<{ staf: Staf; aksi: AksiStaf } | null>(null);

  async function lanjutkan() {
    if (!konfirmasi) return;
    await s.hapusAkses(konfirmasi.staf, konfirmasi.aksi);
    setKonfirmasi(null);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          Ikon={Users}
          judul="Staf Gudang"
          deskripsi="Kelola staf dan permintaan bergabung ke gudang kamu"
        />

        {s.galat && (
          <Alert jenis="error" onClose={() => s.setGalat('')} className="mb-4">
            {s.galat}{' '}
            <button onClick={s.muat} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        <NotifAlert notif={s.notif.notif} onTutup={s.notif.tutup} />

        <KartuKodeGudang
          kode={s.kode}
          tersalin={s.tersalin}
          onSalin={s.salinKode}
          deskripsi="Staf mendaftar dulu di aplikasi mobile, lalu memasukkan kode ini di halaman Gudang Saya setelah login. Permintaan mereka muncul di bawah, dan mereka baru bisa memakai data gudang setelah kamu menyetujuinya. Kode bisa diganti kapan saja di menu Pengaturan."
        />

        {!s.loading && (
          <TabelPermintaan
            data={s.menunggu}
            prosesId={s.prosesId}
            onSetujui={s.setujui}
            onTolak={(st) => setKonfirmasi({ staf: st, aksi: 'tolak' })}
          />
        )}

        <TabelStafAktif
          data={s.aktif}
          loading={s.loading}
          prosesId={s.prosesId}
          onKeluarkan={(st) => setKonfirmasi({ staf: st, aksi: 'keluarkan' })}
        />
      </div>

      <DialogKonfirmasi
        buka={!!konfirmasi}
        judul={
          konfirmasi?.aksi === 'tolak'
            ? 'Tolak permintaan bergabung?'
            : 'Keluarkan staf dari gudang?'
        }
        pesan={
          konfirmasi
            ? konfirmasi.aksi === 'tolak'
              ? `${konfirmasi.staf.nama} (${konfirmasi.staf.email}) tidak akan tergabung ke gudang kamu. Dia masih bisa mengajukan lagi dengan kode gudang.`
              : `${konfirmasi.staf.nama} tidak bisa lagi memakai data gudang. Akunnya tidak dihapus dan riwayat transaksinya tetap ada. Untuk masuk lagi, dia harus mengajukan bergabung dan kamu setujui.`
            : ''
        }
        labelYa={konfirmasi?.aksi === 'tolak' ? 'Ya, tolak' : 'Ya, keluarkan'}
        memproses={konfirmasi ? s.prosesId === konfirmasi.staf.id : false}
        onYa={lanjutkan}
        onBatal={() => s.prosesId === null && setKonfirmasi(null)}
      />
    </main>
  );
}