'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  UserMinus,
  UserCheck,
  UserX,
  KeyRound,
  Copy,
  Check,
  Mail,
  Phone,
  Clock,
} from 'lucide-react';
import { Alert, DialogKonfirmasi, useNotifikasi } from '@/components/ui/Alert';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Staf = {
  id: number;
  nama: string;
  email: string;
  telepon: string | null;
  status_anggota?: string;
};

type Konfirmasi = { staf: Staf; aksi: 'tolak' | 'keluarkan' } | null;

export default function StafPage() {
  const [staf, setStaf] = useState<Staf[]>([]);
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(true);
  const [galat, setGalat] = useState('');
  const [prosesId, setProsesId] = useState<number | null>(null);
  const [tersalin, setTersalin] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState<Konfirmasi>(null);

  const { notif, tampil, tutup } = useNotifikasi();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function fetchData() {
    setLoading(true);
    setGalat('');
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
        setGalat(dataStaf.error || 'Gagal memuat daftar staf');
      }

      if (resGudang.ok) {
        const dataGudang = await resGudang.json();
        setKode(dataGudang.kode || '');
      }
    } catch (err) {
      setGalat('Tidak dapat terhubung ke server');
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
      tampil('error', 'Gagal menyalin otomatis, salin manual dari kotak kode.');
    }
  }

  async function jalankanAksi(
    s: Staf,
    aksi: 'setujui' | 'keluarkan',
    pesanSukses: string
  ) {
    setProsesId(s.id);
    try {
      const res = await fetch(`${API_URL}/gudang/staf/${s.id}/${aksi}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        tampil('sukses', pesanSukses);
        await fetchData();
      } else {
        tampil('error', data.error || 'Aksi gagal diproses');
      }
    } catch (err) {
      tampil('error', 'Tidak dapat terhubung ke server');
    }
    setProsesId(null);
  }

  function setujui(s: Staf) {
    jalankanAksi(s, 'setujui', `${s.nama} sekarang tergabung di gudang kamu`);
  }

  async function lanjutkanKonfirmasi() {
    if (!konfirmasi) return;
    const { staf: s, aksi } = konfirmasi;
    await jalankanAksi(
      s,
      'keluarkan',
      aksi === 'tolak'
        ? `Permintaan ${s.nama} ditolak`
        : `${s.nama} sudah dikeluarkan dari gudang`
    );
    setKonfirmasi(null);
  }

  const menunggu = staf.filter((s) => s.status_anggota === 'menunggu');
  const aktif = staf.filter((s) => s.status_anggota !== 'menunggu');

  function Avatar({ nama }: { nama: string }) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-base font-bold shrink-0">
        {nama.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users size={28} className="text-[#1E3A8A]" /> Staf Gudang
          </h1>
          <p className="text-slate-600 text-base">Kelola staf dan permintaan bergabung ke gudang kamu</p>
        </div>

        {galat && (
          <Alert jenis="error" onClose={() => setGalat('')} className="mb-4">
            {galat}{' '}
            <button onClick={fetchData} className="font-bold underline">
              Coba lagi
            </button>
          </Alert>
        )}

        {notif && (
          <Alert jenis={notif.jenis} onClose={tutup} className="mb-4">
            {notif.pesan}
          </Alert>
        )}

        {/* Kartu kode gudang */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <KeyRound size={20} className="text-[#1E3A8A]" /> Kode Gudang
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Staf mendaftar dulu di aplikasi mobile, lalu memasukkan kode ini di halaman Gudang Saya setelah
            login. Permintaan mereka muncul di bawah, dan mereka baru bisa memakai data gudang setelah kamu
            menyetujuinya. Kode bisa diganti kapan saja di menu Pengaturan.
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

        {/* Permintaan bergabung */}
        {!loading && menunggu.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-[#1E3A8A]" />
              <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide">Permintaan Bergabung</h2>
              <span className="bg-[#1E3A8A] text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {menunggu.length}
              </span>
            </div>
            <div className="bg-white border-2 border-[#1E3A8A]/30 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: 700 }}>
                  <tbody>
                    {menunggu.map((s) => (
                      <tr key={s.id} className="border-b border-slate-200 last:border-0 hover:bg-[#F4F7FF] transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar nama={s.nama} />
                            <div>
                              <p className="font-semibold text-slate-900 text-base">{s.nama}</p>
                              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                <Mail size={13} /> {s.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-700 text-base">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone size={14} className="text-slate-400" /> {s.telepon || '-'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 justify-end whitespace-nowrap">
                            <button
                              onClick={() => setujui(s)}
                              disabled={prosesId === s.id}
                              className="flex items-center gap-1.5 bg-[#1E3A8A] text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#172E6E] transition disabled:opacity-50"
                            >
                              <UserCheck size={16} />
                              {prosesId === s.id ? 'Memproses...' : 'Setujui'}
                            </button>
                            <button
                              onClick={() => setKonfirmasi({ staf: s, aksi: 'tolak' })}
                              disabled={prosesId === s.id}
                              className="flex items-center gap-1.5 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                            >
                              <UserX size={16} /> Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Staf aktif */}
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-[#1E3A8A]" />
          <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide">Staf Aktif</h2>
          {!loading && (
            <span className="bg-slate-200 text-slate-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {aktif.length}
            </span>
          )}
        </div>
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
                {!loading && aktif.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-600 text-base">
                      Belum ada staf aktif. Bagikan kode gudang di atas ke staf kamu.
                    </td>
                  </tr>
                )}
                {aktif.map((s) => (
                  <tr key={s.id} className="border-b border-slate-200 hover:bg-[#F4F7FF] transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar nama={s.nama} />
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
                        onClick={() => setKonfirmasi({ staf: s, aksi: 'keluarkan' })}
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

      <DialogKonfirmasi
        buka={!!konfirmasi}
        judul={
          konfirmasi?.aksi === 'tolak'
            ? 'Tolak permintaan bergabung?'
            : 'Keluarkan staf dari gudang?'
        }
        pesan={
          konfirmasi
            ? konfirmasi.aksi === 'tolak'
              ? `${konfirmasi.staf.nama} (${konfirmasi.staf.email}) tidak akan tergabung ke gudang kamu. Dia masih bisa mengajukan lagi dengan kode gudang.`
              : `${konfirmasi.staf.nama} tidak bisa lagi memakai data gudang. Akunnya tidak dihapus dan riwayat transaksinya tetap ada. Untuk masuk lagi, dia harus mengajukan bergabung dan kamu setujui.`
            : ''
        }
        labelYa={konfirmasi?.aksi === 'tolak' ? 'Ya, tolak' : 'Ya, keluarkan'}
        memproses={konfirmasi ? prosesId === konfirmasi.staf.id : false}
        onYa={lanjutkanKonfirmasi}
        onBatal={() => prosesId === null && setKonfirmasi(null)}
      />
    </main>
  );
}