import { FileText, LifeBuoy, MessageSquare, User, Users } from 'lucide-react';
import type { FormAlamatState } from './types';

export const FORM_ALAMAT_KOSONG: FormAlamatState = {
  nama_gudang: '',
  telepon: '',
  alamat: '',
  provinsi: '',
  kota: '',
  kecamatan: '',
  kode_pos: '',
  catatan: '',
};

// Titik awal peta kalau alamat belum pernah disimpan: Malang
export const TITIK_AWAL: [number, number] = [-7.9666, 112.6326];

export const TAUTAN = [
  {
    href: '/dashboard/staf',
    Ikon: Users,
    label: 'Kelola Staf',
    desk: 'Setujui permintaan bergabung dan kelola staf gudang kamu',
  },
  {
    href: '/dashboard/profil',
    Ikon: User,
    label: 'Informasi Profil',
    desk: 'Ubah nama, nomor telepon, dan password',
  },
  {
    href: '/dashboard/bantuan',
    Ikon: LifeBuoy,
    label: 'Pusat Bantuan (FAQ)',
    desk: 'Panduan penggunaan dan solusi masalah umum',
  },
  {
    href: '/dashboard/hubungi-kami',
    Ikon: MessageSquare,
    label: 'Hubungi Kami',
    desk: 'Laporkan kendala atau bug ke tim kami',
  },
  {
    href: '/dashboard/ketentuan',
    Ikon: FileText,
    label: 'Ketentuan & Kebijakan',
    desk: 'Kebijakan Privasi dan Syarat Ketentuan Layanan',
  },
];