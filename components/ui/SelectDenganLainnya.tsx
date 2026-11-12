'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { INPUT_KELAS } from '@/lib/ui';

const LAINNYA = '__lainnya__';

export function SelectDenganLainnya({
  label,
  value,
  onChange,
  opsi,
  placeholderKetik = 'Ketik nama baru',
}: {
  label: string;
  value: string;
  onChange: (nilai: string) => void;
  opsi: string[];
  placeholderKetik?: string;
}) {
  const [modeKetik, setModeKetik] = useState(false);

  // Kalau nilai yang sudah ada belum termasuk daftar (misalnya data lama saat edit),
  // langsung tampil sebagai kolom ketik
  useEffect(() => {
    if (value !== '' && !opsi.includes(value)) setModeKetik(true);
  }, [value, opsi]);

  function saatPilih(nilai: string) {
    if (nilai === LAINNYA) {
      setModeKetik(true);
      onChange('');
      return;
    }
    onChange(nilai);
  }

  function kembaliKeDaftar() {
    setModeKetik(false);
    onChange('');
  }

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>

      {modeKetik ? (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholderKetik}
            autoFocus
            className={INPUT_KELAS}
            style={{ paddingRight: 44 }}
          />
          <button
            type="button"
            onClick={kembaliKeDaftar}
            aria-label={`Pilih ${label.toLowerCase()} dari daftar`}
            title="Pilih dari daftar"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-800 transition"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => saatPilih(e.target.value)}
          className={INPUT_KELAS}
        >
          <option value="" disabled>
            Pilih {label.toLowerCase()}...
          </option>
          {opsi.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={LAINNYA}>Lainnya (ketik sendiri)</option>
        </select>
      )}
    </div>
  );
}