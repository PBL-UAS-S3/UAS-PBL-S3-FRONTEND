'use client';

export function TabSwitch<T extends string>({
  opsi,
  nilai,
  onGanti,
  className = '',
}: {
  opsi: { nilai: T; label: string }[];
  nilai: T;
  onGanti: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex bg-white border-2 border-slate-200 rounded-xl p-1 w-fit max-w-full overflow-x-auto ${className}`}
    >
      {opsi.map((o) => (
        <button
          key={o.nilai}
          onClick={() => onGanti(o.nilai)}
          className={`px-4 py-2 rounded-lg text-base font-semibold transition whitespace-nowrap ${
            nilai === o.nilai
              ? 'bg-[#1E3A8A] text-white shadow-sm'
              : 'text-slate-700 hover:bg-[#E8EEFC]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}