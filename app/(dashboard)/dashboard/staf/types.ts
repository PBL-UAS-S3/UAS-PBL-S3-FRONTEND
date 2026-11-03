export type Staf = {
  id: number;
  nama: string;
  email: string;
  telepon: string | null;
  status_anggota?: string;
};

export type AksiStaf = 'tolak' | 'keluarkan';