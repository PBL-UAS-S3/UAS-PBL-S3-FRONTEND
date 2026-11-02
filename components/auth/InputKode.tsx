'use client';

export function InputKode({
  value,
  onChange,
  onEnter,
  label = 'Kode Verifikasi',
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  label?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) onEnter();
        }}
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="••••••"
        maxLength={6}
        className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-2xl text-center font-bold tracking-[0.5em] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30"
      />
    </div>
  );
}