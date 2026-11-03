'use client';

import { MessageSquare } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { PageHeader } from '@/components/ui/PageHeader';
import { useHubungiKami } from './hooks/useHubungiKami';
import { FormKeluhan } from './components/FormKeluhan';

export default function HubungiKamiPage() {
  const h = useHubungiKami();

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          Ikon={MessageSquare}
          judul="Hubungi Kami"
          deskripsi="Laporkan kendala, bug, atau masukan untuk tim kami"
        />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
          {h.galat && (
            <Alert jenis="error" onClose={() => h.setGalat('')} className="mb-5">
              {h.galat}
            </Alert>
          )}
          {h.sukses && (
            <Alert jenis="sukses" onClose={() => h.setSukses('')} className="mb-5">
              {h.sukses}
            </Alert>
          )}

          <FormKeluhan
            pesan={h.pesan}
            setPesan={h.setPesan}
            loading={h.loading}
            onKirim={h.kirim}
          />
        </div>
      </div>
    </main>
  );
}