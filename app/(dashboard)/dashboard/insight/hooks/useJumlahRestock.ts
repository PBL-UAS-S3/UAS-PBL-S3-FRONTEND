'use client';

import { useState } from 'react';
import type { Insight } from '../types';

export function useJumlahRestock() {
  const [custom, setCustom] = useState<Record<string, string>>({});

  function jumlahTampil(item: Insight) {
    return custom[item.sku] ?? String(item.jumlah_restock_disarankan);
  }

  function ubahJumlah(sku: string, raw: string) {
    let bersih = raw.replace(/[^0-9]/g, '');
    if (bersih.length > 1) bersih = bersih.replace(/^0+/, '') || '0';
    setCustom((prev) => ({ ...prev, [sku]: bersih }));
  }

  return { jumlahTampil, ubahJumlah };
}