import { MapPin } from 'lucide-react';

export function PetaLokasi({
  mapRef,
  lat,
  lon,
}: {
  mapRef: React.Ref<HTMLDivElement>;
  lat: number | null;
  lon: number | null;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
        <MapPin size={14} /> Lokasi di Peta
      </label>
      <div
        ref={mapRef}
        className="w-full flex-1 min-h-[420px] rounded-xl border-2 border-slate-200 overflow-hidden z-0"
      />
      <p className="text-xs text-slate-400 mt-2">
        {lat && lon
          ? `Koordinat: ${lat.toFixed(6)}, ${lon.toFixed(6)}`
          : 'Klik di peta atau geser pin untuk menentukan titik lokasi'}
      </p>
    </div>
  );
}