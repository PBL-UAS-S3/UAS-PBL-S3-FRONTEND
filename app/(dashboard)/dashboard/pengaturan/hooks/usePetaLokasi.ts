'use client';

import { useEffect, useRef } from 'react';
import { TITIK_AWAL } from '../constants';

// Mengurus peta Leaflet: dibuat setelah data siap (div peta sudah ada di halaman),
// pin bisa digeser, peta bisa diklik, dan dibersihkan saat halaman ditutup.
export function usePetaLokasi({
  siap,
  awalLat,
  awalLon,
  onTitikDipilih,
}: {
  siap: boolean;
  awalLat: number | null;
  awalLon: number | null;
  onTitikDipilih: (lat: number, lon: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const callbackRef = useRef(onTitikDipilih);
  callbackRef.current = onTitikDipilih;

  useEffect(() => {
    if (!siap || !mapRef.current || mapInstance.current) return;

    let hidup = true;

    async function init() {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      if (!hidup || !mapRef.current || mapInstance.current) return;

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const posisiAwal: [number, number] = [awalLat ?? TITIK_AWAL[0], awalLon ?? TITIK_AWAL[1]];

      const map = L.map(mapRef.current).setView(posisiAwal, 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(posisiAwal, { draggable: true, icon }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        callbackRef.current(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        callbackRef.current(e.latlng.lat, e.latlng.lng);
      });

      mapInstance.current = map;
      markerInstance.current = marker;
    }

    init();

    return () => {
      hidup = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [siap]);

  function pindahKe(lat: number, lon: number) {
    if (mapInstance.current && markerInstance.current) {
      mapInstance.current.setView([lat, lon], 16);
      markerInstance.current.setLatLng([lat, lon]);
    }
  }

  return { mapRef, pindahKe };
}