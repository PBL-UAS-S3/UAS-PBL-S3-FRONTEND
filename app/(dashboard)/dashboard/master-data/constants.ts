import type { FormProduk } from './types';

export const PRESET_SATUAN = [
  'Pcs', 'Lusin', 'Kodi', 'Gross', 'Rim', 'Pasang', 'Dus', 'Kotak', 'Karton', 'Pak',
  'Bal', 'Sachet', 'Renceng', 'Kg', 'Gram', 'Ons', 'Liter', 'Ml', 'Meter', 'Cm',
];

export const FORM_KOSONG: FormProduk = {
  nama: '',
  kategori: '',
  satuan: '',
  harga: '',
  gambar: '',
  stok_saat_ini: '',
  stok_minimum: '',
};