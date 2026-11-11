'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Alert, DialogKonfirmasi } from '@/components/ui/Alert';
import { NotifAlert } from '@/components/ui/NotifAlert';
import { PageHeader } from '@/components/ui/PageHeader';
import { KartuKodeGudang } from '@/components/gudang/KartuKodeGudang';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { useSalinTeks } from '@/hooks/useSalinTeks';
import {
  ambilGudangSaya,
  ambilStaf,
  keluarkanStaf,
  setujuiStaf,
} from '@/services/gudangService';
import type { AksiStaf, Staf } from './types';
import { TabelPermintaan } from './components/TabelPermintaan';
import { TabelStafAktif } from './components/TabelStafAktif';

export default function StafPage() {
  const [staf, setStaf] = useState<Staf[]>([]);
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [konfirmasi, setKonfirmasi] = useState<{ staf: Staf; aksi: AksiStaf } | null>(null);

  const notif = useNotifikasi();
  const salinan = useSalinTeks(() =>
    notif.tampil('error', 'Gagal menyalin otomatis, salin manual dari kotak kode.'),
  );

  async function muat() {
    setLoading(true);
    setGalat('');

    const [resStaf, resGudang] = await Promise.all([ambilStaf(), ambilGudangSaya()]);
    if (resStaf.sesiHabis || resGudang.sesiHabis) return;

    if (resStaf.ok && Array.isArray(resStaf.data)) {
      setStaf(resStaf.data);
    } else {
      setGalat((resStaf.data as any)?.error || 'Gagal memuat daftar staf');
    }

    if (resGudang.ok) setKode(resGudang.data.kode || '');
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function jalankan(s: Staf, aksi: 'setujui' | 'keluarkan', pesanSukses: string) {
    setProsesId(s.id);

    const res = aksi === 'setujui' ? await setujuiStaf(s.id) : await keluarkanStaf(s.id);
    if (res.sesiHabis) return;

    if (res.ok) {
      notif.tampil('sukses', pesanSukses);
      await muat();
    } else {
      notif.tampil('error', res.data.error || 'Aksi gagal diproses');
    }
    setProsesId(null);
  }

  function setujui(s: Staf) {
    return jalankan(s, 'setujui', `${s.nama} sekarang tergabung di gudang kamu`);
  }

  // Tolak permintaan atau keluarkan staf: di backend keduanya sama (akun tidak dihapus)
  function hapusAkses(s: Staf, aksi: AksiStaf) {
    return jalankan(
      s,
      'keluarkan',
      aksi === 'tolak'
        ? `Permintaan ${s.nama} ditolak`
        : `${s.nama} sudah dikeluarkan dari gudang`,
    );
  }

  async function lanjutkan() {
    if (!konfirmasi) return;
    await hapusAkses(konfirmasi.staf, konfirmasi.aksi);
    setKonfirmasi(null);
  }

  const menunggu = staf.filter((s) => s.status_anggota === 'menunggu');
  const aktif = staf.filter((s) => s.status_anggota !== 'menunggu');

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          Ikon={Users}
          judul="Staf Gudang"
          deskripsi="Kelola staf dan permintaan bergabung ke gudang kamu"
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

        <KartuKodeGudang
          kode={kode}
          tersalin={salinan.tersalin}
          onSalin={() => salinan.salin(kode)}
          deskripsi="Staf mendaftar dulu di aplikasi mobile, lalu memasukkan kode ini di halaman Gudang Saya setelah login. Permintaan mereka muncul di bawah, dan mereka baru bisa memakai data gudang setelah kamu menyetujuinya. Kode bisa diganti kapan saja di menu Pengaturan."
        />

        {!loading && (
          <TabelPermintaan
            data={menunggu}
            prosesId={prosesId}
            onSetujui={setujui}
            onTolak={(st) => setKonfirmasi({ staf: st, aksi: 'tolak' })}
          />
        )}

        <TabelStafAktif
          data={aktif}
          loading={loading}
          prosesId={prosesId}
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
        memproses={konfirmasi ? prosesId === konfirmasi.staf.id : false}
        onYa={lanjutkan}
        onBatal={() => prosesId === null && setKonfirmasi(null)}
      />
    </main>
  );
}