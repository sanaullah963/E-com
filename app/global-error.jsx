'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-50">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-surface-900 mb-3">Something went wrong!</h1>
            <p className="text-surface-500 mb-6 text-sm">
              An unexpected error occurred. Please try again.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={reset} className="btn-primary text-sm">Try Again</button>
              <Link href="/" className="btn-secondary text-sm">Go Home</Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
