'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PO = {
  id: number;
  nama: string;
  sku: string;
  jumlah: number;
  status: 'pending' | 'selesai';
  catatan: string | null;
  created_at: string;
};

export default function PurchaseOrderPage() {
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [pesan, setPesan] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchPOs() {
    setLoading(true);
    setPesan('');
    try {
      const res = await fetch('http://localhost:3000/purchase-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setPos(data);
      } else {
        setPos([]);
        setPesan(data.error || 'Gagal memuat data Purchase Order');
      }
    } catch (err) {
      setPos([]);
      setPesan('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPOs();
  }, []);

  async function tandaiSelesai(id: number) {
    setProsesId(id);
    setPesan('');
    try {
      const res = await fetch(`http://localhost:3000/purchase-orders/${id}/selesai`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        await fetchPOs();
      } else {
        setPesan(data.error || 'Gagal menandai PO selesai');
      }
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setProsesId(null);
  }

  function formatWaktu(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function statusBadge(status: string) {
    if (status === 'selesai') {
      return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Selesai</span>;
    }
    return <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Pending</span>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-4 text-sm">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">Master Data</Link>
          <Link href="/dashboard/riwayat" className="text-blue-600 hover:text-blue-800 font-medium">Riwayat Transaksi</Link>
          <Link href="/dashboard/insight" className="text-blue-600 hover:text-blue-800 font-medium">AI Insight</Link>
          <span className="text-slate-900 font-semibold">Purchase Order</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Purchase Order</h1>
          <p className="text-slate-500">Daftar pesanan restock ke supplier</p>
        </div>

        {pesan && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {pesan}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 700 }}>
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Jumlah</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Catatan</th>
                  <th className="px-5 py-3">Dibuat</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>
                )}
                {!loading && pos.length === 0 && !pesan && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Belum ada Purchase Order. Buat dari halaman AI Insight.</td></tr>
                )}
                {pos.map((po) => (
                  <tr key={po.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{po.nama}</div>
                      <div className="text-xs text-slate-400 font-mono">{po.sku}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{po.jumlah}</td>
                    <td className="px-5 py-3">{statusBadge(po.status)}</td>
                    <td className="px-5 py-3 text-slate-500 text-sm">{po.catatan || '-'}</td>
                    <td className="px-5 py-3 text-slate-500 text-sm whitespace-nowrap">{formatWaktu(po.created_at)}</td>
                    <td className="px-5 py-3">
                      {po.status === 'pending' ? (
                        <button
                          onClick={() => tandaiSelesai(po.id)}
                          disabled={prosesId === po.id}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
                        >
                          {prosesId === po.id ? 'Memproses...' : 'Tandai Selesai'}
                        </button>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}