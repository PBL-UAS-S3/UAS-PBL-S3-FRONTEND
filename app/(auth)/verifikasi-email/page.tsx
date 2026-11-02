import { Suspense } from 'react';
import { VerifikasiEmailContent } from './components/VerifikasiEmailContent';

export default function VerifikasiEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifikasiEmailContent />
    </Suspense>
  );
}