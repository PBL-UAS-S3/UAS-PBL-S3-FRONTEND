'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const BASE_URL = 'http://localhost:3000';

export default function HubungiKamiPage() {
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [sukses, setSukses] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function kirim() {
    setPesanError('');
    setSukses('');
    if (!pesan.trim()) {
      setPesanError('Pesan tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/keluhan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pesan }),
      });
      const data = await res.json();
      if (res.ok) {
        setSukses(data.message || 'Pesan berhasil dikirim');
        setPesan('');
      } else {
        setPesanError(data.error || 'Gagal mengirim pesan');
      }
    } catch (err) {
      setPesanError('Tidak dapat terhubung ke server');
    }
    setLoading(false);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={28} className="text-[#F2842F]" /> Hubungi Kami
          </h1>
          <p className="text-slate-600 text-base">Laporkan kendala, bug, atau masukan untuk tim kami</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Pesan / Keluhan</label>
          <textarea
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Jelaskan kendala yang kamu alami..."
            rows={8}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F2842F] focus:ring-2 focus:ring-[#F2842F]/30"
          />

          {pesanError && <p className="text-red-700 text-base font-semibold mt-3">{pesanError}</p>}
          {sukses && <p className="text-emerald-700 text-base font-semibold mt-3">{sukses}</p>}

          <button
            onClick={kirim}
            disabled={loading}
            className="flex items-center gap-2 bg-[#F2842F] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#DD6F1B] transition disabled:opacity-50 mt-5"
          >
            <Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </div>
      </div>
    </main>
  );
}