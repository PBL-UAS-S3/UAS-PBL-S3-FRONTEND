'use client';

import { Building2, MapPin, Phone, Save, StickyNote } from 'lucide-react';
import { INPUT_KELAS } from '@/lib/ui';
import type { HasilPencarian } from '../types';
import type { useAlamatGudang } from '../hooks/useAlamatGudang';
import { PencarianAlamat } from './PencarianAlamat';

function Field({
  label,
  Ikon,
  children,
}: {
  label: string;
  Ikon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
        {Ikon && <Ikon size={14} />} {label}
      </label>
      {children}
    </div>
  );
}

export function FormAlamat({
  a,
  onPilihHasil,
}: {
  a: ReturnType<typeof useAlamatGudang>;
  onPilihHasil: (item: HasilPencarian) => void;
}) {
  const f = a.form;

  return (
    <div className="space-y-5">
      <PencarianAlamat
        query={a.queryCari}
        onQueryChange={a.ubahQuery}
        hasil={a.hasilCari}
        sedangCari={a.sedangCari}
        onPilih={onPilihHasil}
      />

      {/* Identitas gudang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nama Gudang" Ikon={Building2}>
          <input
            value={f.nama_gudang}
            onChange={(e) => a.ubah('nama_gudang', e.target.value)}
            placeholder="Contoh: Gudang Utama Malang"
            className={INPUT_KELAS}
          />
        </Field>
        <Field label="Nomor Telepon" Ikon={Phone}>
          <input
            value={f.telepon}
            onChange={(e) => a.ubah('telepon', e.target.value)}
            placeholder="08xx-xxxx-xxxx"
            className={INPUT_KELAS}
          />
        </Field>
      </div>

      <Field label="Alamat Lengkap" Ikon={MapPin}>
        <textarea
          value={f.alamat}
          onChange={(e) => a.ubah('alamat', e.target.value)}
          placeholder="Terisi otomatis dari pencarian, bisa diedit manual"
          rows={2}
          className={INPUT_KELAS}
        />
      </Field>

      {/* Detail wilayah */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Detail Wilayah
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Provinsi">
            <input
              value={f.provinsi}
              onChange={(e) => a.ubah('provinsi', e.target.value)}
              className={INPUT_KELAS}
            />
          </Field>
          <Field label="Kota">
            <input
              value={f.kota}
              onChange={(e) => a.ubah('kota', e.target.value)}
              className={INPUT_KELAS}
            />
          </Field>
          <Field label="Kecamatan">
            <input
              value={f.kecamatan}
              onChange={(e) => a.ubah('kecamatan', e.target.value)}
              className={INPUT_KELAS}
            />
          </Field>
          <Field label="Kode Pos">
            <input
              value={f.kode_pos}
              onChange={(e) => a.ubah('kode_pos', e.target.value)}
              className={INPUT_KELAS}
            />
          </Field>
        </div>
      </div>

      <Field label="Catatan (patokan, dll)" Ikon={StickyNote}>
        <input
          value={f.catatan}
          onChange={(e) => a.ubah('catatan', e.target.value)}
          placeholder="Contoh: sebelah SPBU, pagar hijau"
          className={INPUT_KELAS}
        />
      </Field>

      <button
        onClick={a.simpan}
        disabled={a.saving}
        className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-5 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50"
      >
        <Save size={18} /> {a.saving ? 'Menyimpan...' : 'Simpan Alamat'}
      </button>
    </div>
  );
}