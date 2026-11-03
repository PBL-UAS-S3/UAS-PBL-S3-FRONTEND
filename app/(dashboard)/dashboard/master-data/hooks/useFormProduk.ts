'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/types/produk';
import { FORM_KOSONG } from '../constants';
import { bersihkanAngka, rusakDari } from '../helpers';
import type { FormProduk } from '../types';

export function useFormProduk({ onBerhasil }: { onBerhasil: (pesan: string) => void }) {
  const [buka, setBuka] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSku, setEditingSku] = useState('');
  const [editingRusak, setEditingRusak] = useState(0);
  const [form, setForm] = useState<FormProduk>(FORM_KOSONG);
  const [pesan, setPesan] = useState('');
  const [uploading, setUploading] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  function bukaTambah() {
    setForm(FORM_KOSONG);
    setEditingId(null);
    setEditingSku('');
    setEditingRusak(0);
    setPesan('');
    setBuka(true);
  }

  function bukaEdit(p: Product) {
    setEditingId(p.id);
    setEditingSku(p.sku);
    setEditingRusak(rusakDari(p));
    setForm({
      nama: p.nama,
      kategori: p.kategori ?? '',
      satuan: p.satuan ?? '',
      harga: String(p.harga ?? 0),
      gambar: p.gambar ?? '',
      stok_saat_ini: String(p.stok_saat_ini ?? 0),
      stok_minimum: String(p.stok_minimum ?? 0),
    });
    setPesan('');
    setBuka(true);
  }

  function tutup() {
    setBuka(false);
  }

  function ubahTeks(field: 'nama' | 'kategori' | 'satuan', nilai: string) {
    setForm((prev) => ({ ...prev, [field]: nilai }));
  }

  function ubahAngka(field: 'harga' | 'stok_saat_ini' | 'stok_minimum', raw: string) {
    setForm((prev) => ({ ...prev, [field]: bersihkanAngka(raw) }));
  }

  async function unggahGambar(file: File) {
    setUploading(true);
    setPesan('');

    const formData = new FormData();
    formData.append('gambar', file);
    const res = await api<{ url?: string; error?: string }>('/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.sesiHabis) return;

    if (res.ok && res.data.url) {
      const url = res.data.url;
      setForm((prev) => ({ ...prev, gambar: url }));
    } else {
      setPesan(res.data.error || 'Gagal mengunggah gambar');
    }
    setUploading(false);
  }

  async function simpan() {
    setPesan('');

    if (!form.nama || form.nama.trim().length < 3) {
      setPesan('Nama produk wajib diisi (minimal 3 karakter)');
      return;
    }
    if (!form.kategori) {
      setPesan('Kategori produk wajib diisi');
      return;
    }
    if (!form.satuan) {
      setPesan('Satuan produk wajib diisi');
      return;
    }
    if (Number(form.harga || 0) <= 0) {
      setPesan('Harga per unit wajib lebih dari 0');
      return;
    }
    // Saat edit, stok layak boleh 0 (produk yang sudah habis tetap bisa diedit)
    if (!editingId && Number(form.stok_saat_ini || 0) <= 0) {
      setPesan('Stok saat ini wajib lebih dari 0');
      return;
    }
    if (Number(form.stok_minimum || 0) <= 0) {
      setPesan('Stok minimum wajib lebih dari 0');
      return;
    }

    setMenyimpan(true);
    const res = await api<{ error?: string }>(
      editingId ? `/products/${editingId}` : '/products',
      {
        method: editingId ? 'PUT' : 'POST',
        body: {
          nama: form.nama,
          kategori: form.kategori,
          satuan: form.satuan,
          harga: Number(form.harga || 0),
          gambar: form.gambar,
          stok_saat_ini: Number(form.stok_saat_ini || 0),
          stok_minimum: Number(form.stok_minimum || 0),
        },
      },
    );
    if (res.sesiHabis) return;

    if (res.ok) {
      setBuka(false);
      onBerhasil(
        editingId
          ? `Produk "${form.nama}" berhasil diperbarui`
          : `Produk "${form.nama}" berhasil ditambahkan`,
      );
    } else {
      setPesan(res.data.error || 'Gagal menyimpan produk');
    }
    setMenyimpan(false);
  }

  return {
    buka, editingId, editingSku, editingRusak,
    form, pesan, setPesan,
    uploading, menyimpan,
    bukaTambah, bukaEdit, tutup,
    ubahTeks, ubahAngka, unggahGambar, simpan,
  };
}