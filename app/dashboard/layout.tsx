"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  History,
  Sparkles,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  User,
  Settings,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/master-data", label: "Master Data", Icon: Package },
  { href: "/dashboard/riwayat", label: "Riwayat Transaksi", Icon: History },
  { href: "/dashboard/insight", label: "AI Insight", Icon: Sparkles },
  { href: "/dashboard/po", label: "Purchase Order", Icon: ShoppingCart },
  { href: "/dashboard/profil", label: "Profil", Icon: User },
  { href: "/dashboard/pengaturan", label: "Pengaturan", Icon: Settings },
];

function Logo({ ukuran = "md" }: { ukuran?: "sm" | "md" }) {
  const kotak = ukuran === "sm" ? "w-9 h-9" : "w-11 h-11";
  return (
    <div
      className={`${kotak} rounded-xl bg-[#0000] flex items-center justify-center shrink-0 p-1.5`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo4.png"
        alt="Stockin Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sudahDicek, setSudahDicek] = useState(false);
  const [nama, setNama] = useState("");
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const namaTersimpan = localStorage.getItem("nama");

    if (!token || role !== "manager") {
      router.push("/login");
      return;
    }

    setNama(namaTersimpan || "Manager");
    setSudahDicek(true);
  }, [router]);

  useEffect(() => {
    setSidebarTerbuka(false);
  }, [pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    router.push("/login");
  }

  if (!sudahDicek) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <p className="text-slate-600 text-base">Memeriksa sesi login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Topbar khusus mobile */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b-2 border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarTerbuka(true)}
          className="text-slate-900"
        >
          <Menu size={26} />
        </button>
        <div className="flex items-center gap-2">
          <Logo ukuran="sm" />
          <span className="font-bold text-slate-900 text-lg">Stockin</span>
        </div>
        <div className="w-6" />
      </div>

      {sidebarTerbuka && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarTerbuka(false)}
        />
      )}

      {/* Sidebar — seluruh isinya bisa di-scroll kalau tinggi layar kurang,
          supaya tombol Logout di bawah tetap bisa dijangkau */}
      <aside
        className={`w-64 bg-white border-r-2 border-slate-200 fixed h-screen z-50 transition-transform duration-200 overflow-y-auto ${
          sidebarTerbuka ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col min-h-full">
          <div className="px-5 py-5 border-b-2 border-slate-100 flex items-start justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <span className="font-bold text-slate-900 text-xl leading-tight block">
                  Stockin
                </span>
                <p className="text-xs text-slate-500">Smart Warehouse System</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarTerbuka(false)}
              className="lg:hidden text-slate-500"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="px-3 py-4 space-y-1.5 shrink-0">
            <p className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menu
            </p>
            {menuItems.map(({ href, label, Icon }) => {
              const aktif = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold transition ${
                    aktif
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "text-slate-700 hover:bg-[#E8EEFC] hover:text-[#172554]"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t-2 border-slate-100 mt-auto shrink-0">
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-base font-bold shrink-0">
                {nama.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 truncate">
                  {nama}
                </p>
                <p className="text-sm text-slate-500">Manager</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">{children}</div>
    </div>
  );
}