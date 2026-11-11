'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { hapusSesi, ubahNamaSesi } from '@/lib/auth';
import { ambilProfil, gantiPassword, ubahProfil } from '@/services/profilService';
import type { HasilAksi } from './types';
import { useFormPassword } from './hooks/useFormPassword';
import { KartuIdentitas } from './components/KartuIdentitas';
import { FormDataDiri } from './components/FormDataDiri';
import { FormGantiPassword } from './components/FormGantiPassword';

export default function ProfilPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [savingProfil, setSavingProfil] = useState(false);

  const notifProfil = useNotifikasi();

  async function muat() {
    setLoading(true);

    const res = await ambilProfil();
    if (res.sesiHabis) return;

    if (res.ok) {
      setNama(res.data.nama);
      setEmail(res.data.email);
      setTelepon(res.data.telepon || '');
    } else {
      notifProfil.tampil('error', res.data.error || 'Gagal memuat profil');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function simpanProfil() {
    setSavingProfil(true);

    const res = await ubahProfil({ nama, telepon });
    if (res.sesiHabis) return;

    if (res.ok) {
      ubahNamaSesi(nama);
      notifProfil.tampil('sukses', 'Profil berhasil disimpan');
    } else {
      notifProfil.tampil('error', res.data.error || 'Gagal menyimpan profil');
    }
    setSavingProfil(false);
  }

  async function ubahPassword(passwordLama: string, passwordBaru: string): Promise<HasilAksi> {
    const res = await gantiPassword(passwordLama, passwordBaru);
    return { ok: res.ok, error: res.data?.error };
  }

  const pw = useFormPassword(ubahPassword);

  function logout() {
    hapusSesi();
    router.push('/login');
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader judul="Profil Saya" deskripsi="Kelola data akun dan keamanan login kamu" />

        {loading ? (
          <p className="text-slate-600 text-base">Memuat data...</p>
        ) : (
          <>
            <KartuIdentitas nama={nama} onLogout={logout} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormDataDiri
                nama={nama}
                setNama={setNama}
                email={email}
                telepon={telepon}
                setTelepon={setTelepon}
                saving={savingProfil}
                onSimpan={simpanProfil}
                notif={notifProfil.notif}
                onTutupNotif={notifProfil.tutup}
              />
              <FormGantiPassword
                passwordLama={pw.passwordLama}
                setPasswordLama={pw.setPasswordLama}
                passwordBaru={pw.passwordBaru}
                setPasswordBaru={pw.setPasswordBaru}
                konfirmasiBaru={pw.konfirmasiBaru}
                setKonfirmasiBaru={pw.setKonfirmasiBaru}
                saving={pw.saving}
                onSimpan={pw.simpan}
                notif={pw.notif.notif}
                onTutupNotif={pw.notif.tutup}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}