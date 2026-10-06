"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Shield,
  KeyRound,
  Save,
  LogOut,
} from "lucide-react";

const BASE_URL = "http://localhost:3000";

const INPUT_KELAS =
  "w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/30";

const INPUT_KUNCI_KELAS =
  "w-full border-2 border-dashed border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-500 bg-slate-50";

export default function ProfilPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [loadingProfil, setLoadingProfil] = useState(true);
  const [savingProfil, setSavingProfil] = useState(false);
  const [pesanProfil, setPesanProfil] = useState("");
  const [suksesProfil, setSuksesProfil] = useState("");

  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiBaru, setKonfirmasiBaru] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [pesanPassword, setPesanPassword] = useState("");
  const [suksesPassword, setSuksesPassword] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    router.push("/login");
  }

  async function fetchProfil() {
    setLoadingProfil(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/profil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNama(data.nama);
        setEmail(data.email);
        setTelepon(data.telepon || "");
      } else {
        setPesanProfil(data.error || "Gagal memuat profil");
      }
    } catch (err) {
      setPesanProfil("Tidak dapat terhubung ke server");
    }
    setLoadingProfil(false);
  }

  useEffect(() => {
    fetchProfil();
  }, []);

  async function simpanProfil() {
    setSavingProfil(true);
    setPesanProfil("");
    setSuksesProfil("");
    try {
      const res = await fetch(`${BASE_URL}/auth/profil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama, telepon }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("nama", nama);
        setSuksesProfil("Profil berhasil disimpan");
      } else {
        setPesanProfil(data.error || "Gagal menyimpan profil");
      }
    } catch (err) {
      setPesanProfil("Tidak dapat terhubung ke server");
    }
    setSavingProfil(false);
  }

  async function simpanPassword() {
    setPesanPassword("");
    setSuksesPassword("");

    if (!passwordLama || !passwordBaru || !konfirmasiBaru) {
      setPesanPassword("Semua kolom wajib diisi");
      return;
    }
    if (passwordBaru.length < 6) {
      setPesanPassword("Password baru minimal 6 karakter");
      return;
    }
    if (passwordBaru !== konfirmasiBaru) {
      setPesanPassword("Konfirmasi password tidak sama");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/ganti-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password_lama: passwordLama,
          password_baru: passwordBaru,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuksesPassword("Password berhasil diubah");
        setPasswordLama("");
        setPasswordBaru("");
        setKonfirmasiBaru("");
      } else {
        setPesanPassword(data.error || "Gagal mengubah password");
      }
    } catch (err) {
      setPesanPassword("Tidak dapat terhubung ke server");
    }
    setSavingPassword(false);
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Profil Saya
          </h1>
          <p className="text-slate-600 text-base">
            Kelola data akun dan keamanan login kamu
          </p>
        </div>

        {loadingProfil ? (
          <p className="text-slate-600 text-base">Memuat data...</p>
        ) : (
          <>
            {/* Kartu identitas ringkas */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold shrink-0">
                  {nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{nama}</p>
                  <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                    <Shield size={14} /> Manager
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            {/* Dua form berdampingan di layar besar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form data diri */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-[#1E3A8A]" /> Data Diri
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">
                      Nama Lengkap
                    </label>
                    <input
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className={INPUT_KELAS}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Mail size={14} /> Email
                    </label>
                    <div className={INPUT_KUNCI_KELAS}>{email}</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Email tidak dapat diubah
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone size={14} /> Nomor Telepon
                    </label>
                    <input
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="08xx-xxxx-xxxx"
                      className={INPUT_KELAS}
                    />
                  </div>
                </div>

                {pesanProfil && (
                  <p className="text-red-700 text-base font-semibold mt-4">
                    {pesanProfil}
                  </p>
                )}
                {suksesProfil && (
                  <p className="text-emerald-700 text-base font-semibold mt-4">
                    {suksesProfil}
                  </p>
                )}

                <button
                  onClick={simpanProfil}
                  disabled={savingProfil}
                  className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 mt-5"
                >
                  <Save size={18} />{" "}
                  {savingProfil ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>

              {/* Form ganti password */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <KeyRound size={20} className="text-[#1E3A8A]" /> Ganti
                  Password
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      value={passwordLama}
                      onChange={(e) => setPasswordLama(e.target.value)}
                      className={INPUT_KELAS}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwordBaru}
                      onChange={(e) => setPasswordBaru(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className={INPUT_KELAS}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={konfirmasiBaru}
                      onChange={(e) => setKonfirmasiBaru(e.target.value)}
                      className={INPUT_KELAS}
                    />
                  </div>
                </div>

                {pesanPassword && (
                  <p className="text-red-700 text-base font-semibold mt-4">
                    {pesanPassword}
                  </p>
                )}
                {suksesPassword && (
                  <p className="text-emerald-700 text-base font-semibold mt-4">
                    {suksesPassword}
                  </p>
                )}

                <button
                  onClick={simpanPassword}
                  disabled={savingPassword}
                  className="flex items-center gap-2 bg-[#1E3A8A] text-white text-base font-semibold px-6 py-2.5 rounded-xl hover:bg-[#172E6E] transition disabled:opacity-50 mt-5"
                >
                  <KeyRound size={18} />{" "}
                  {savingPassword ? "Menyimpan..." : "Ubah Password"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}