'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { INPUT_KELAS } from '@/lib/ui';

export function FieldPassword({
  label,
  value,
  onChange,
  placeholder,
  onEnter,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
}) {
  const [terlihat, setTerlihat] = useState(false);

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
      <div className="relative">
        <input
          type={terlihat ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnter) onEnter();
          }}
          placeholder={placeholder}
          className={`${INPUT_KELAS} pr-11`}
        />
        <button
          type="button"
          onClick={() => setTerlihat(!terlihat)}
          aria-label={terlihat ? 'Sembunyikan password' : 'Tampilkan password'}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#1E3A8A]"
        >
          {terlihat ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}