export type JenisAlert = 'error' | 'sukses' | 'info' | 'peringatan' | 'rusak';

export type Notif = { jenis: JenisAlert; pesan: string } | null;