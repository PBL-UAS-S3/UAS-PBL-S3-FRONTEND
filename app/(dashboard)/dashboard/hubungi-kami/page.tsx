'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { PageHeader } from '@/components/ui/PageHeader';
import { kirimKeluhan } from '@/services/keluhanService';
import { FormKeluhan } from './components/FormKeluhan';

export default function HubungiKamiPage() {
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [galat, setGalat] = useState('');
  const [sukses, setSukses] = useState('');

  async function kirim() {
    setGalat('');
    setSukses('');

    if (!pesan.trim()) {
      setGalat('Pesan tidak boleh kosong');
      return;
    }

    setLoading(true);
    const res = await kirimKeluhan(pesan);
    if (res.sesiHabis) return;

    if (res.ok) {
      setSukses(res.data.message || 'Pesan berhasil dikirim');
      setPesan('');
    } else {
      setGalat(res.data.error || 'Gagal mengirim pesan');
    }
    setLoading(false);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          Ikon={MessageSquare}
          judul="Hubungi Kami"
          deskripsi="Laporkan kendala, bug, atau masukan untuk tim kami"
        />

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
          {galat && (
            <Alert jenis="error" onClose={() => setGalat('')} className="mb-5">
              {galat}
            </Alert>
          )}
          {sukses && (
            <Alert jenis="sukses" onClose={() => setSukses('')} className="mb-5">
              {sukses}
            </Alert>
          )}

          <FormKeluhan pesan={pesan} setPesan={setPesan} loading={loading} onKirim={kirim} />
        </div>
      </div>
    </main>
  );
}