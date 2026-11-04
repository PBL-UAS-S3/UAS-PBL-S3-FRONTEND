import {
  AlertTriangle,
  History,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  User,
  Users,
} from 'lucide-react';

export const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/dashboard/master-data', label: 'Master Data', Icon: Package },
  { href: '/dashboard/barang-rusak', label: 'Barang Rusak', Icon: AlertTriangle },
  { href: '/dashboard/riwayat', label: 'Riwayat Transaksi', Icon: History },
  { href: '/dashboard/insight', label: 'AI Insight', Icon: Sparkles },
  { href: '/dashboard/po', label: 'Purchase Order', Icon: ShoppingCart },
  { href: '/dashboard/staf', label: 'Staf Gudang', Icon: Users },
  { href: '/dashboard/profil', label: 'Profil', Icon: User },
  { href: '/dashboard/pengaturan', label: 'Pengaturan', Icon: Settings },
];