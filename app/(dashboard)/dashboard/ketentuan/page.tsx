'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabSwitch } from '@/components/ui/TabSwitch';
import { DaftarPasal } from './components/DaftarPasal';
import { KEBIJAKAN_PRIVASI, OPSI_TAB, SYARAT_KETENTUAN, type TabKetentuan } from './constants';

export default function KetentuanPage() {
  const [tab, setTab] = useState<TabKetentuan>('privasi');

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          Ikon={FileText}
          judul="Ketentuan & Kebijakan"
          deskripsi="Dokumen ini adalah contoh placeholder untuk keperluan tugas, belum ditinjau oleh ahli hukum."
        />

        <TabSwitch opsi={OPSI_TAB} nilai={tab} onGanti={setTab} className="mb-5" />

        <DaftarPasal pasal={tab === 'privasi' ? KEBIJAKAN_PRIVASI : SYARAT_KETENTUAN} />
      </div>
    </main>
  );
}