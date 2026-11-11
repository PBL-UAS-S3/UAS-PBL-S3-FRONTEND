export type HasilPencarian = {
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
};

export type FormAlamatState = {
  nama_gudang: string;
  telepon: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  catatan: string;
};

export type HasilAksi = {
  ok: boolean;
  sesiHabis?: boolean;
  error?: string;
};