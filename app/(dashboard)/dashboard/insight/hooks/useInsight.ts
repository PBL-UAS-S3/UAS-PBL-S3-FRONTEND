'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { usePagination } from '@/hooks/usePagination';
import type { Insight } from '../types';

export function useInsight() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [poLoadingSku, setPoLoadingSku] = useState<string | null>(null);
  const [poBerhasilSku, setPoBerhasilSku] = useState<string | null>(null);
  const [customJumlah, setCustomJumlah] = useState<Record<string, string>>({});
  const [galat, setGalat] = useState('');

  async function muat() {
    setLoading(true);
    setGalat('');
    const res = await api<Insight[]>('/ai-insights');
    if (res.sesiHabis) return;

    if (res.ok && Array.isArray(res.data)) {
      setInsights(res.data);
    } else {
      setInsights([]);
      setGalat((res.data as any)?.error || 'Gagal memuat data insight');
    }
    setLoading(false);
  }

  useEffect(() => {
    muat();
  }, []);

  async function generate() {
    setGenerating(true);
    setGalat('');
    const res = await api<{ error?: string }>('/ai-insights/generate', { method: 'POST' });
    if (res.sesiHabis) return;

    if (res.ok) {
      await muat();
    } else {
      setGalat(res.data.error || 'Gagal membuat analisis AI');
    }
    setGenerating(false);
  }

  async function buatPO(sku: string, jumlahStr: string, rekomendasi: string) {
    const jumlah = parseInt(jumlahStr || '0', 10);
    if (!jumlah || jumlah <= 0) {
      setGalat('Jumlah PO harus lebih dari 0');
      return;
    }

    setPoLoadingSku(sku);
    setGalat('');
    const res = await api<{ error?: string }>('/purchase-orders', {
      method: 'POST',
      body: { sku, jumlah, catatan: `Dibuat dari AI Insight: ${rekomendasi}` },
    });
    if (res.sesiHabis) return;

    if (res.ok) {
      setPoBerhasilSku(sku);
    } else {
      setGalat(res.data.error || 'Gagal membuat Purchase Order');
    }
    setPoLoadingSku(null);
  }

  function jumlahTampil(item: Insight) {
    return customJumlah[item.sku] ?? String(item.jumlah_restock_disarankan);
  }

  function ubahJumlah(sku: string, raw: string) {
    let bersih = raw.replace(/[^0-9]/g, '');
    if (bersih.length > 1) bersih = bersih.replace(/^0+/, '') || '0';
    setCustomJumlah({ ...customJumlah, [sku]: bersih });
  }

  const halaman = usePagination(insights, 10, String(insights.length));

  return {
    loading,
    generating,
    galat,
    setGalat,
    jumlahData: insights.length,
    halaman,
    poLoadingSku,
    poBerhasilSku,
    jumlahTampil,
    ubahJumlah,
    generate,
    buatPO,
  };
}