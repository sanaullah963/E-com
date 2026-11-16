'use client';

import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand={false}
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    />
  );
}
