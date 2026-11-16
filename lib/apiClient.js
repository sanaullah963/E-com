import axios from 'axios';
import { API_URL } from '../constants/index.js';
import useAuthStore from '../store/authStore.js';
import useAdminAuthStore from '../store/adminAuthStore.js';

/**
 * Axios instance — OMS /api/ecommerce (same-origin proxy)
 *  • কাস্টমার: httpOnly cookie (withCredentials) — টোকেন JS-এ নেই
 *  • অ্যাডমিন (/admin/* পেজ): OMS Bearer টোকেন (adminAuthStore)
 *  এই দুই সেশন কখনো মেশে না: সার্ভার কাস্টমার টোকেন দিয়ে অ্যাডমিন API এবং অ্যাডমিন টোকেন দিয়ে কাস্টমার API গ্রহণ করে না।
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

const onAdminPage = () => typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (onAdminPage()) {
      const token = useAdminAuthStore.getState().token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    const statusCode = error.response?.status || 500;
    const errors = error.response?.data?.errors || null;
    const url = error.config?.url || '';

    if (statusCode === 401 || (statusCode === 403 && onAdminPage())) {
      if (onAdminPage()) {
        // অ্যাডমিন সেশন অবৈধ/মেয়াদোত্তীর্ণ/অনুমতিহীন → লগইনে
        if (useAdminAuthStore.getState().token && !window.location.pathname.startsWith('/admin/login')) {
          useAdminAuthStore.getState().clearSession();
          window.location.href = '/admin/login';
        }
      } else if (!url.startsWith('/auth/login') && !url.startsWith('/auth/register') && !url.startsWith('/auth/change-password') && useAuthStore.getState().isAuthenticated) {
        // কাস্টমার সেশন শেষ — লোকাল স্টেট পরিষ্কার (পাবলিক পেজ চলতে থাকে)
        useAuthStore.getState().clearUser();
      }
    }

    return Promise.reject({ message, statusCode, errors });
  }
);

export default apiClient;
