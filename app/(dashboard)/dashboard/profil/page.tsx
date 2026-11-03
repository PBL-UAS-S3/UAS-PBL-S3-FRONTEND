'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useProfil } from './hooks/useProfil';
import { KartuIdentitas } from './components/KartuIdentitas';
import { FormDataDiri } from './components/FormDataDiri';
import { FormGantiPassword } from './components/FormGantiPassword';

export default function ProfilPage() {
  const p = useProfil();

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader judul="Profil Saya" deskripsi="Kelola data akun dan keamanan login kamu" />

        {p.loading ? (
          <p className="text-slate-600 text-base">Memuat data...</p>
        ) : (
          <>
            <KartuIdentitas nama={p.nama} onLogout={p.logout} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormDataDiri
                nama={p.nama}
                setNama={p.setNama}
                email={p.email}
                telepon={p.telepon}
                setTelepon={p.setTelepon}
                saving={p.savingProfil}
                onSimpan={p.simpanProfil}
                notif={p.notifProfil.notif}
                onTutupNotif={p.notifProfil.tutup}
              />
              <FormGantiPassword
                passwordLama={p.passwordLama}
                setPasswordLama={p.setPasswordLama}
                passwordBaru={p.passwordBaru}
                setPasswordBaru={p.setPasswordBaru}
                konfirmasiBaru={p.konfirmasiBaru}
                setKonfirmasiBaru={p.setKonfirmasiBaru}
                saving={p.savingPassword}
                onSimpan={p.simpanPassword}
                notif={p.notifPassword.notif}
                onTutupNotif={p.notifPassword.tutup}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}