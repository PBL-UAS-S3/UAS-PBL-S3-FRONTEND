import type { PasalKetentuan } from '../constants';

export function DaftarPasal({ pasal }: { pasal: PasalKetentuan[] }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 text-base text-slate-700 leading-relaxed">
      {pasal.map((p, i) => (
        <p key={p.judul}>
          <b className="text-slate-900">
            {i + 1}. {p.judul}.
          </b>{' '}
          {p.isi}
        </p>
      ))}
    </div>
  );
}