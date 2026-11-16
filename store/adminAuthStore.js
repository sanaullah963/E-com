'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Admin Auth Store — OMS অ্যাডমিন সেশন (কাস্টমার সেশন `authStore` থেকে সম্পূর্ণ আলাদা)।
 * টোকেন = OMS JWT (Bearer)। শুধু /admin/* পেজের অনুরোধে পাঠানো হয় (lib/apiClient.js)।
 */
const useAdminAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null, // { _id, name, phone, role: 'admin' }
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: 'shopbd-admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAdminAuthStore;
