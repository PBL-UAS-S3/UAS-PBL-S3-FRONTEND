import { infoTipe } from '../constants';

export function TipeBadge({ tipe }: { tipe: string }) {
  const info = infoTipe(tipe);
  return (
    <span className={`${info.kelas} border text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap`}>
      {info.label}
    </span>
  );
}