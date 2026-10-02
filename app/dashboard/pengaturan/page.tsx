'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  MapPin, User, LifeBuoy, MessageSquare, FileText,
  Save, ChevronRight, Search, Loader2, Phone, Building2, StickyNote,
} from 'lucide-react';

const BASE_URL = 'http://localhost:3000';

const INPUT_KELAS =
  'w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30';

const LABEL_KELAS = 'text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5';

type HasilPencarian = {
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
};

function Field({
  label,
  Icon,
  children,
}: {
  label: string;
  Icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LABEL_KELAS}>
        {Icon && <Icon size={14} />} {label}
      </label>
      {children}
    </div>
  );
}

function KartuTautan({ href, Icon, label, desk }: { href: string; Icon: React.ElementType; label: string; desk: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-[#F2842F] hover:bg-[#FFF8F2] transition"
    >
      <div className="w-10 h-10 rounded-lg bg-[#FEF1E6] text-[#F2842F] flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-base">{label}</p>
        <p className="text-sm text-slate-500">{desk}</p>
      </div>
      <ChevronRight size={18} className="text-slate-400 shrink-0" />
    </Link>
  );
}

export default function PengaturanPage() {
  // ---- State alamat gudang ----
  const [namaGudang, setNamaGudang] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [catatan, setCatatan] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  const [loadingAwal, setLoadingAwal] = useState(true);
  const [savingAlamat, setSavingAlamat] = useState(false);
  const [pesanAlamat, setPesanAlamat] = useState('');
  const [suksesAlamat, setSuksesAlamat] = useState('');

  // ---- State pencarian alamat ----
  const [queryCari, setQueryCari] = useState('');
  const [hasilCari, setHasilCari] = useState<HasilPencarian[]>([]);
  const [sedangCari, setSedangCari] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Ambil data pengaturan dari backend sekali saat halaman dibuka.
  //    Peta BELUM diinisialisasi di sini — div peta belum tentu ada di DOM
  //    selama loadingAwal masih true (lihat JSX di bawah).
  useEffect(() => {
    async function fetchPengaturan() {
      setLoadingAwal(true);
      try {
        const res = await fetch(`${BASE_URL}/pengaturan`);
        if (res.ok) {
          const data = await res.json();
          setNamaGudang(data.nama_gudang || '');
          setTelepon(data.telepon || '');
          setAlamat(data.alamat || '');
          setProvinsi(data.provinsi || '');
          setKota(data.kota || '');
          setKecamatan(data.kecamatan || '');
          setKodePos(data.kode_pos || '');
          setCatatan(data.catatan || '');

          if (data.latitude && data.longitude) {
            setLat(Number(data.latitude));
            setLon(Number(data.longitude));
          }
        }
      } catch (err) {
        setPesanAlamat('Tidak dapat terhubung ke server');
      } finally {
        setLoadingAwal(false);
      }
    }

    fetchPengaturan();
  }, []);

  // 2. Setelah loadingAwal selesai, div peta sudah pasti ada di DOM,
  //    baru inisialisasi Leaflet. Ini menghindari deadlock peta vs loading.
  useEffect(() => {
    if (loadingAwal || !mapRef.current || mapInstance.current) return;

    let hidup = true;

    async function initMap() {
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

      const posisiAwal: [number, number] = [lat ?? -7.9666, lon ?? 112.6326]; // fallback: Malang

      const map = L.map(mapRef.current).setView(posisiAwal, 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(posisiAwal, { draggable: true, icon }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setLat(pos.lat);
        setLon(pos.lng);
        reverseGeocode(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        setLat(e.latlng.lat);
        setLon(e.latlng.lng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapInstance.current = map;
      markerInstance.current = marker;
    }

    initMap();

    return () => {
      hidup = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loadingAwal]);

  function handleQueryChange(nilai: string) {
    setQueryCari(nilai);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (nilai.trim().length < 3) {
      setHasilCari([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSedangCari(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=id&limit=5&q=${encodeURIComponent(nilai)}`;
        const res = await fetch(url);
        const data = await res.json();
        setHasilCari(data);
      } catch (err) {
        setHasilCari([]);
      }
      setSedangCari(false);
    }, 500);
  }

  function pilihHasil(item: HasilPencarian) {
    const latNum = parseFloat(item.lat);
    const lonNum = parseFloat(item.lon);

    setLat(latNum);
    setLon(lonNum);
    setAlamat(item.display_name);
    isiDariAddress(item.address);

    if (mapInstance.current && markerInstance.current) {
      mapInstance.current.setView([latNum, lonNum], 16);
      markerInstance.current.setLatLng([latNum, lonNum]);
    }

    setQueryCari('');
    setHasilCari([]);
  }

  async function reverseGeocode(latNum: number, lonNum: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${latNum}&lon=${lonNum}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.display_name) {
        setAlamat(data.display_name);
        isiDariAddress(data.address);
      }
    } catch (err) {
      // biarkan field alamat manual tidak berubah kalau reverse geocode gagal
    }
  }

  function isiDariAddress(address?: Record<string, string>) {
    if (!address) return;
    setProvinsi(address.state || '');
    setKota(address.city || address.county || address.city_district || '');
    setKecamatan(address.suburb || address.city_district || address.village || '');
    setKodePos(address.postcode || '');
  }

  async function simpanAlamat() {
    setSavingAlamat(true);
    setPesanAlamat('');
    setSuksesAlamat('');
    try {
      const res = await fetch(`${BASE_URL}/pengaturan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nama_gudang: namaGudang, telepon, alamat, provinsi, kota, kecamatan, kode_pos: kodePos,
          catatan, latitude: lat, longitude: lon,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuksesAlamat('Alamat gudang berhasil disimpan');
      } else {
        setPesanAlamat(data.error || 'Gagal menyimpan');
      }
    } catch (err) {
      setPesanAlamat('Tidak dapat terhubung ke server');
    }
    setSavingAlamat(false);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pengaturan</h1>
          <p className="text-slate-600 text-base">Kelola alamat gudang dan bantuan</p>
        </div>

        {/* ===================== Alamat Gudang ===================== */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <MapPin size={20} className="text-[#F2842F]" /> Alamat Gudang
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Satu alamat untuk seluruh sistem — berlaku sama untuk semua akun Manager dan ditampilkan juga
            ke semua akun Staf di aplikasi mobile. Cari alamat di kolom pencarian, lalu geser pin di peta
            untuk mengoreksi titik persis.
          </p>

          {loadingAwal ? (
            <div className="flex items-center gap-2 py-10 justify-center text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Memuat data pengaturan...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">
              {/* ---------- Kolom kiri: form ---------- */}
              <div className="space-y-5">
                {/* Pencarian */}
                <div className="relative">
                  <label className={LABEL_KELAS}>
                    <Search size={14} /> Cari Alamat
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      value={queryCari}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder="Ketik nama jalan, kecamatan, atau tempat..."
                      className={`${INPUT_KELAS} pl-11 pr-10`}
                    />
                    {sedangCari && (
                      <Loader2 className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 animate-spin" />
                    )}
                  </div>

                  {hasilCari.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border-2 border-slate-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                      {hasilCari.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => pilihHasil(item)}
                          className="w-full flex items-start gap-2 text-left px-4 py-2.5 hover:bg-[#FFF8F2] text-sm text-slate-700 border-b border-slate-100 last:border-0"
                        >
                          <MapPin size={14} className="text-[#F2842F] mt-0.5 shrink-0" />
                          <span>{item.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Identitas gudang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nama Gudang" Icon={Building2}>
                    <input
                      value={namaGudang}
                      onChange={(e) => setNamaGudang(e.target.value)}
                      placeholder="Contoh: Gudang Utama Malang"
                      className={INPUT_KELAS}
                    />
                  </Field>
                  <Field label="Nomor Telepon" Icon={Phone}>
                    <input
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="08xx-xxxx-xxxx"
                      className={INPUT_KELAS}
                    />
                  </Field>
                </div>

                <Field label="Alamat Lengkap" Icon={MapPin}>
                  <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Terisi otomatis dari pencarian, bisa diedit manual"
                    rows={2}
                    className={INPUT_KELAS}
                  />
                </Field>

                {/* Detail wilayah */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detail Wilayah</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Provinsi">
                      <input value={provinsi} onChange={(e) => setProvinsi(e.target.value)} className={INPUT_KELAS} />
                    </Field>
                    <Field label="Kota">
                      <input value={kota} onChange={(e) => setKota(e.target.value)} className={INPUT_KELAS} />
                    </Field>
                    <Field label="Kecamatan">
                      <input value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} className={INPUT_KELAS} />
                    </Field>
                    <Field label="Kode Pos">
                      <input value={kodePos} onChange={(e) => setKodePos(e.target.value)} className={INPUT_KELAS} />
                    </Field>
                  </div>
                </div>

                <Field label="Catatan (patokan, dll)" Icon={StickyNote}>
                  <input
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: sebelah SPBU, pagar hijau"
                    className={INPUT_KELAS}
                  />
                </Field>

                {pesanAlamat && <p className="text-red-700 text-sm font-semibold">{pesanAlamat}</p>}
                {suksesAlamat && <p className="text-emerald-700 text-sm font-semibold">{suksesAlamat}</p>}

                <button
                  onClick={simpanAlamat}
                  disabled={savingAlamat}
                  className="flex items-center gap-2 bg-[#F2842F] text-white text-base font-semibold px-5 py-2.5 rounded-xl hover:bg-[#DD6F1B] transition disabled:opacity-50"
                >
                  <Save size={18} /> {savingAlamat ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
              </div>

              {/* ---------- Kolom kanan: peta ---------- */}
              <div className="flex flex-col">
                <label className={LABEL_KELAS}>
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
            </div>
          )}
        </div>

        {/* ===================== Tautan lain ===================== */}
        <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-3">Akun & Bantuan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <KartuTautan href="/dashboard/profil" Icon={User} label="Informasi Profil" desk="Ubah nama, nomor telepon, dan password" />
          <KartuTautan href="/dashboard/bantuan" Icon={LifeBuoy} label="Pusat Bantuan (FAQ)" desk="Panduan penggunaan dan solusi masalah umum" />
          <KartuTautan href="/dashboard/hubungi-kami" Icon={MessageSquare} label="Hubungi Kami" desk="Laporkan kendala atau bug ke tim kami" />
          <KartuTautan href="/dashboard/ketentuan" Icon={FileText} label="Ketentuan & Kebijakan" desk="Kebijakan Privasi dan Syarat Ketentuan Layanan" />
        </div>
      </div>
    </main>
  );
}