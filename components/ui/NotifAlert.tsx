'use client';

import { Alert } from '@/components/ui/Alert';
import type { Notif } from '@/types/ui';

export function NotifAlert({
  notif,
  onTutup,
  className = 'mb-4',
}: {
  notif: Notif;
  onTutup: () => void;
  className?: string;
}) {
  if (!notif) return null;

  return (
    <Alert jenis={notif.jenis} onClose={onTutup} className={className}>
      {notif.pesan}
    </Alert>
  );
}