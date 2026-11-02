'use client';

export function TombolAuth({
  label,
  labelLoading,
  loading,
  onClick,
}: {
  label: string;
  labelLoading: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full bg-[#1E3A8A] text-white text-base font-semibold py-3 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 shadow-sm"
    >
      {loading ? labelLoading : label}
    </button>
  );
}