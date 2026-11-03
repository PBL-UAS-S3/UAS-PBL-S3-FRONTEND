'use client';

import { LifeBuoy } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { AkordeonFaq } from '@/components/ui/AkordeonFaq';
import { DAFTAR_FAQ } from './constants';

export default function BantuanPage() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          Ikon={LifeBuoy}
          judul="Pusat Bantuan"
          deskripsi="Pertanyaan yang sering ditanyakan seputar Stockin"
        />
        <AkordeonFaq daftar={DAFTAR_FAQ} />
      </div>
    </main>
  );
}