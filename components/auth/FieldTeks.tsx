'use client';

import { INPUT_GALAT_KELAS, INPUT_KELAS } from '@/lib/ui';

export function FieldTeks({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  bantuan,
  onEnter,
  autoComplete,
  galat = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  bantuan?: string;
  onEnter?: () => void;
  autoComplete?: string;
  galat?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter();
        }}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={galat ? INPUT_GALAT_KELAS : INPUT_KELAS}
      />
      {bantuan && <p className="text-xs text-slate-500 mt-1">{bantuan}</p>}
    </div>
  );
}