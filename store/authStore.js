'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Customer Auth Store
 * শুধু ওয়েবসাইট কাস্টমারের তথ্য (টোকেন httpOnly cookie-তে; JS-এ আসে না)।
 * কাস্টমারের কোনো role নেই। অ্যাডমিন সেশন আলাদা: store/adminAuthStore.js
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, isAuthenticated: false }),

      // (পুরোনো API সামঞ্জস্য) — কাস্টমার কখনো অ্যাডমিন নয়
      isAdmin: () => false,
      isCustomer: () => !!get().user,
    }),
    {
      name: 'shopbd-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
