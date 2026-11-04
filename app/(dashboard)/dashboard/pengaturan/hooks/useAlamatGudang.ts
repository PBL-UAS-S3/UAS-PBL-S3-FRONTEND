'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useNotifikasi } from '@/hooks/useNotifikasi';
import { FORM_ALAMAT_KOSONG } from '../constants';
import type { FormAlamatState, HasilPencarian } from '../types';

export function useAlamatGudang() {
  const [form, setForm] = useState<FormAlamatState>(FORM_ALAMAT_KOSONG);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [loadingAwal, setLoadingAwal] = useState(true);
  const [saving, setSaving] = useState(false);

  const [queryCari, setQueryCari] = useState('');
  const [hasilCari, setHasilCari] = useState<HasilPencarian[]>([]);
  const [sedangCari, setSedangCari] = useState(false);

  const notif = useNotifikasi();
  const alertRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tampilkan alert lalu gulir ke sana supaya tidak terlewat
  function tampilDanGulir(jenis: 'error' | 'sukses', pesan: string) {
    notif.tampil(jenis, pesan);
    setTimeout(() => {
      alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  useEffect(() => {
    async function muat() {
      setLoadingAwal(true);
      const res = await api<any>('/pengaturan');
      if (res.sesiHabis) return;

      if (res.ok) {
        const d = res.data;
        setForm({
          nama_gudang: d.nama_gudang || '',
          telepon: d.telepon || '',
          alamat: d.alamat || '',
          provinsi: d.provinsi || '',
          kota: d.kota || '',
          kecamatan: d.kecamatan || '',
          kode_pos: d.kode_pos || '',
          catatan: d.catatan || '',
        });
        if (d.latitude && d.longitude) {
          setLat(Number(d.latitude));
          setLon(Number(d.longitude));
        }
      } else {
        notif.tampil('error', res.data?.error || 'Tidak dapat terhubung ke server');
      }
      setLoadingAwal(false);
    }

    muat();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function ubah(field: keyof FormAlamatState, nilai: string) {
    setForm((prev) => ({ ...prev, [field]: nilai }));
  }

  function isiDariAddress(address?: Record<string, string>) {
    if (!address) return;
    setForm((prev) => ({
      ...prev,
      provinsi: address.state || '',
      kota: address.city || address.county || address.city_district || '',
      kecamatan: address.suburb || address.city_district || address.village || '',
      kode_pos: address.postcode || '',
    }));
  }

  async function reverseGeocode(latNum: number, lonNum: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${latNum}&lon=${lonNum}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.display_name) {
        ubah('alamat', data.display_name);
        isiDariAddress(data.address);
      }
    } catch (err) {
      // biarkan alamat manual tidak berubah kalau reverse geocode gagal
    }
  }

  // Dipanggil peta saat pin digeser atau peta diklik
  function pilihTitik(latNum: number, lonNum: number) {
    setLat(latNum);
    setLon(lonNum);
    reverseGeocode(latNum, lonNum);
  }

  // Dipanggil saat salah satu hasil pencarian dipilih. Mengembalikan titiknya untuk peta.
  function pilihHasil(item: HasilPencarian) {
    const latNum = parseFloat(item.lat);
    const lonNum = parseFloat(item.lon);

    setLat(latNum);
    setLon(lonNum);
    ubah('alamat', item.display_name);
    isiDariAddress(item.address);
    setQueryCari('');
    setHasilCari([]);

    return { lat: latNum, lon: lonNum };
  }

  function ubahQuery(nilai: string) {
    setQueryCari(nilai);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (nilai.trim().length < 3) {
      setHasilCari([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSedangCari(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=id&limit=5&q=${encodeURIComponent(nilai)}`;
        const res = await fetch(url);
        setHasilCari(await res.json());
      } catch (err) {
        setHasilCari([]);
      }
      setSedangCari(false);
    }, 500);
  }

  async function simpan() {
    setSaving(true);
    const res = await api<{ error?: string }>('/pengaturan', {
      method: 'PUT',
      body: { ...form, latitude: lat, longitude: lon },
    });
    if (res.sesiHabis) return;

    if (res.ok) {
      tampilDanGulir('sukses', 'Alamat gudang berhasil disimpan');
    } else {
      tampilDanGulir('error', res.data.error || 'Gagal menyimpan');
    }
    setSaving(false);
  }

  return {
    form, ubah,
    lat, lon,
    loadingAwal, saving,
    queryCari, ubahQuery, hasilCari, sedangCari,
    pilihTitik, pilihHasil,
    simpan,
    notif, alertRef,
  };
}