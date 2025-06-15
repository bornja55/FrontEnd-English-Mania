import { Suspense } from 'react';
import LinePageContent from './LinePageContent';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">LINE Login</h1>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <LinePageContent />
    </Suspense>
  );
}