export function PesanAuth({ error, sukses }: { error?: string; sukses?: string }) {
  return (
    <>
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 text-base font-medium rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}
      {sukses && (
        <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-base font-medium rounded-xl px-4 py-3 mb-5">
          {sukses}
        </div>
      )}
    </>
  );
}