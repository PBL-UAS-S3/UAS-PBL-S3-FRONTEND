'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  sku: string;
  nama: string;
  kategori: string | null;
  satuan: string | null;
  stok_saat_ini: number;
  stok_minimum: number;
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    sku: '', nama: '', kategori: '', satuan: '', stok_saat_ini: 0, stok_minimum: 0,
  });
  const [pesan, setPesan] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchProducts() {
    const res = await fetch('http://localhost:3000/products');
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function resetForm() {
    setForm({ sku: '', nama: '', kategori: '', satuan: '', stok_saat_ini: 0, stok_minimum: 0 });
    setEditingId(null);
  }

  async function simpanProduk() {
    setPesan('');
    const url = editingId
      ? `http://localhost:3000/products/${editingId}`
      : 'http://localhost:3000/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      resetForm();
      fetchProducts();
    } else {
      setPesan(data.error || 'Gagal menyimpan produk');
    }
  }

  function mulaiEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      nama: p.nama,
      kategori: p.kategori ?? '',
      satuan: p.satuan ?? '',
      stok_saat_ini: p.stok_saat_ini,
      stok_minimum: p.stok_minimum,
    });
  }

  async function hapusProduk(id: number) {
    if (!confirm('Yakin hapus produk ini?')) return;
    await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  }

  function statusBadge(p: Product) {
    if (p.stok_saat_ini <= p.stok_minimum) {
      return <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Stok Menipis</span>;
    }
    if (p.stok_saat_ini <= p.stok_minimum * 1.5) {
      return <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Perlu Dipantau</span>;
    }
    return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Aman</span>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex gap-4 text-sm">
          <span className="text-slate-900 font-semibold">Master Data</span>
          <Link href="/dashboard/riwayat" className="text-blue-600 hover:text-blue-800 font-medium">Riwayat Transaksi</Link>
          <Link href="/dashboard/insight" className="text-blue-600 hover:text-blue-800 font-medium">AI Insight</Link>
          <Link href="/dashboard/po" className="text-blue-600 hover:text-blue-800 font-medium">Purchase Order</Link>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Master Data Inventory</h1>
            <p className="text-slate-500">Kelola data produk dan pantau status stok gudang</p>
          </div>
        </div>

        {/* Form Tambah/Edit */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              placeholder="SKU"
              value={form.sku}
              disabled={!!editingId}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            />
            <input
              placeholder="Nama Produk"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Kategori"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Satuan (pcs, box, dll)"
              value={form.satuan}
              onChange={(e) => setForm({ ...form, satuan: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Stok Saat Ini"
              value={form.stok_saat_ini}
              onChange={(e) => setForm({ ...form, stok_saat_ini: Number(e.target.value) })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Stok Minimum"
              value={form.stok_minimum}
              onChange={(e) => setForm({ ...form, stok_minimum: Number(e.target.value) })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {pesan && <p className="text-red-600 mb-3 text-sm font-medium">{pesan}</p>}
          <div className="flex gap-3">
            <button
              onClick={simpanProduk}
              className="bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? 'Update Produk' : '+ Tambah Produk'}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-200 transition"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Nama Produk</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Satuan</th>
                <th className="px-5 py-3">Stok</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-slate-500 font-mono text-sm">{p.sku}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{p.nama}</td>
                  <td className="px-5 py-3 text-slate-600">{p.kategori || '-'}</td>
                  <td className="px-5 py-3 text-slate-600">{p.satuan || '-'}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{p.stok_saat_ini}</td>
                  <td className="px-5 py-3">{statusBadge(p)}</td>
                  <td className="px-5 py-3 flex gap-3">
                    <button
                      onClick={() => mulaiEdit(p)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => hapusProduk(p.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Belum ada produk. Tambahkan produk pertamamu di atas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}