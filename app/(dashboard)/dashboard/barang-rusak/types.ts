export type Mode = 'pisah' | 'pulih' | 'afkir';

export type HasilAksi = {
  ok: boolean;
  sesiHabis?: boolean;
  error?: string;
};