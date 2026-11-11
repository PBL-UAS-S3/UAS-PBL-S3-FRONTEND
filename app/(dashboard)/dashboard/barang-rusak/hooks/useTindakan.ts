'use client';

import { useState } from 'react';
import type { DataTransaksi } from '@/services/transaksiService';
import type { Product } from '@/types/produk';
import { ALASAN, TIPE_BARU } from '../constants';
import type { HasilAksi, Mode } from '../types';

type Opsi = {
  products: Product[];
  onKirim: (data: DataTransaksi) => Promise<HasilAksi>;
  onBerhasil: (pesan: string) => void;
};

export function useTindakan({ products, onKirim, onBerhasil }: Opsi) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [produkDipilih, setProdukDipilih] = useState<Product | null>(null);
  const [skuPilihan, setSkuPilihan] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [alasan, setAlasan] = useState(ALASAN[0]);
  const [catatan, setCatatan] = useState('');
  const [pesan, setPesan] = useState('');
  const [memproses, setMemproses] = useState(false);

  // Produk yang sedang dikerjakan di dalam modal
  const produkAktif =
    mode === 'pisah' ? (products.find((p) => p.sku === skuPilihan) ?? null) : produkDipilih;

  const maksimal = produkAktif
    ? mode === 'pisah'
      ? produkAktif.stok_saat_ini
      : Number(produkAktif.stok_rusak)
    : 0;

  function buka(m: Mode, produk?: Product) {
    setMode(m);
    setProdukDipilih(produk ?? null);
    setSkuPilihan('');
    setJumlah('');
    setAlasan(ALASAN[0]);
    setCatatan('');
    setPesan('');
  }

  function tutup() {
    if (memproses) return;
    setMode(null);
    setProdukDipilih(null);
  }

  async function kirim() {
    if (!mode) return;
    setPesan('');

    if (!produkAktif) {
      setPesan('Pilih produk terlebih dahulu');
      return;
    }

    const angka = Number(jumlah);
    if (!Number.isInteger(angka) || angka <= 0) {
      setPesan('Jumlah harus berupa angka bulat lebih dari 0');
      return;
    }
    if (angka > maksimal) {
      setPesan(
        mode === 'pisah' ? `Stok layak hanya ${maksimal} unit` : `Stok rusak hanya ${maksimal} unit`,
      );
      return;
    }

    let teksCatatan = catatan.trim();
    if (mode === 'pisah') {
      if (alasan.startsWith('Lainnya') && !teksCatatan) {
        setPesan('Jelaskan kondisi barang pada kolom catatan');
        return;
      }
      teksCatatan = teksCatatan ? `${alasan} — ${teksCatatan}` : alasan;
    }

    setMemproses(true);
    const hasil = await onKirim({
      sku: produkAktif.sku,
      tipe: TIPE_BARU[mode],
      jumlah: angka,
      catatan: teksCatatan || null,
    });
    if (hasil.sesiHabis) return;

    if (hasil.ok) {
      const nama = produkAktif.nama;
      setMode(null);
      setProdukDipilih(null);
      onBerhasil(
        mode === 'pisah'
          ? `${angka} unit "${nama}" dipisahkan ke barang rusak`
          : mode === 'pulih'
            ? `${angka} unit "${nama}" dikembalikan ke stok layak`
            : `${angka} unit "${nama}" diafkir dan dihapus dari stok rusak`,
      );
    } else {
      setPesan(hasil.error || 'Gagal menyimpan transaksi');
    }
    setMemproses(false);
  }

  return {
    mode, produkAktif, maksimal,
    skuPilihan, setSkuPilihan,
    jumlah, setJumlah,
    alasan, setAlasan,
    catatan, setCatatan,
    pesan, setPesan,
    memproses,
    buka, tutup, kirim,
  };
}