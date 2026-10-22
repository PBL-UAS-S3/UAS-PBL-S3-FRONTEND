'use client';

import { useEffect, useState } from 'react';
import { Users, UserMinus, KeyRound, Copy, Check, Mail, Phone } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Staf = {
  id: number;
  nama: string;
  email: string;
  telepon: string | null;
};

export default function StafPage() {
  const [staf, setStaf] = useState<Staf[]>([]);
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(true);
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [pesan, setPesan] = useState('');
  const [sukses, setSukses] = useState('');
  const [tersalin, setTersalin] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchData() {
    setLoading(true);
    setPesan('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resStaf, resGudang] = await Promise.all([
        fetch(`${API_URL}/gudang/staf`, { headers }),
        fetch(`${API_URL}/gudang/saya`, { headers }),
      ]);

      if (resStaf.status === 401 || resStaf.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('nama');
        window.location.href = '/login';
        return;
      }

      const dataStaf = await resStaf.json();
      if (resStaf.ok) {
        setStaf(Array.isArray(dataStaf) ? dataStaf : []);
      } else {
        setPesan(dataStaf.error || 'Gagal memuat daftar staf');
      }

      if (resGudang.ok) {
        const dataGudang = await resGudang.json();
        setKode(dataGudang.kode || '');
      }
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function salinKode() {
    if (!kode) return;
    try {
      await navigator.clipboard.writeText(kode);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch (err) {
      setPesan('Gagal menyalin otomatis, salin manual dari kotak kode.');
    }
  }

  async function keluarkan(s: Staf) {
    if (
      !confirm(
        `Keluarkan ${s.nama} dari gudang? Akunnya tidak dihapus dan riwayat transaksinya tetap ada, tapi dia tidak bisa masuk lagi sebelum bergabung dengan kode gudang.`
      )
    )
      return;

    setProsesId(s.id);
    setPesan('');
    setSukses('');
    try {
      const res = await fetch(`${API_URL}/gudang/staf/${s.id}/keluarkan`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSukses(`${s.nama} sudah dikeluarkan dari gudang`);
        await fetchData();
      } else {
        setPesan(data.error || 'Gagal mengeluarkan staf');
      }
    } catch (err) {
      setPesan('Tidak dapat terhubung ke server');
    }
    setProsesId(null);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users size={28} className="text-[#1E3A8A]" /> Staf Gudang
          </h1>
          <p className="text-slate-600 text-base">Kelola staf yang tergabung di gudang kamu</p>
        </div>

        {/* Kartu kode gudang */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <KeyRound size={20} className="text-[#1E3A8A]" /> Kode Gudang
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Staf baru memasukkan kode ini saat mendaftar di aplikasi mobile. Kode bisa diganti kapan saja di menu Pengaturan.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-5 py-3 rounded-xl bg-[#E8EEFC] border-2 border-[#1E3A8A]/30 text-2xl font-bold tracking-[0.3em] text-[#1E3A8A] font-mono min-w-[190px] text-center">
              {kode || '------'}
            </div>
            <button
              onClick={salinKode}
              disabled={!kode}
              className="flex items-center gap-2 border-2 border-[#1E3A8A] text-[#1E3A8A] text-base font-semibold px-4 py-2.5 rounded-xl hover:bg-[#E8EEFC] transition disabled:opacity-50"
            >
              {tersalin ? <Check size={18} /> : <Copy size={18} />}
              {tersalin ? 'Tersalin' : 'Salin Kode'}
            </button>
          </div>
        </div>

        {pesan && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 text-base font-medium rounded-xl px-4 py-3 mb-4">
            {pesan}
          </div>
        )}
        {sukses && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-base font-medium rounded-xl px-4 py-3 mb-4">
            {sukses}
          </div>
        )}

        {/* Daftar staf */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 640 }}>
              <thead className="bg-[#DBE5FB] text-[#172554] text-sm uppercase tracking-wide border-b-2 border-[#1E3A8A]/40">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Staf</th>
                  <th className="px-5 py-3.5 font-bold">Email</th>
                  <th className="px-5 py-3.5 font-bold">Telepon</th>
                  <th className="px-5 py-3.5 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-600 text-base">Memuat data...</td></tr>
                )}
                {!loading && staf.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-600 text-base">
                      Belum ada staf yang tergabung. Bagikan kode gudang di atas ke staf kamu.
                    </td>
                  </tr>
                )}
                {staf.map((s) => (
                  <tr key={s.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-base font-bold shrink-0">
                          {s.nama.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 text-base">{s.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700 text-base">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={14} className="text-slate-400" /> {s.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700 text-base">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={14} className="text-slate-400" /> {s.telepon || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => keluarkan(s)}
                        disabled={prosesId === s.id}
                        className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-3 py-1.5 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                      >
                        <UserMinus size={16} />
                        {prosesId === s.id ? 'Memproses...' : 'Keluarkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}