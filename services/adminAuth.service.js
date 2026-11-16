import axios from 'axios';
import apiClient from '../lib/apiClient.js';
import { ADMIN_LOGIN_URL } from '../constants/index.js';

/**
 * Admin login — OMS-এর বিদ্যমান POST /api/auth/login (ফোন + পাসওয়ার্ড), same-origin proxy হয়ে।
 * তারপর /admin/me দিয়ে যাচাই: শুধু OMS "admin" role ঢুকতে পারে (moderator 403)।
 */
export async function adminLogin(phone, password) {
  let token;
  try {
    const res = await axios.post(ADMIN_LOGIN_URL, { phone, password }, { timeout: 30000 });
    token = res.data?.token;
  } catch (e) {
    throw { message: e.response?.data?.message || 'লগইন করা যায়নি। আবার চেষ্টা করুন।', statusCode: e.response?.status || 500 };
  }
  if (!token) throw { message: 'লগইন করা যায়নি।', statusCode: 500 };
  try {
    const me = await getAdminMe(token);
    return { token, user: me.data };
  } catch (e) {
    if (e.statusCode === 403 || e.statusCode === 401) {
      throw { message: 'এই অ্যাকাউন্টে অ্যাডমিন প্যানেলের অনুমতি নেই। (শুধু অ্যাডমিন)', statusCode: 403 };
    }
    throw e;
  }
}

// token স্পষ্টভাবে পাঠানো হয় (এখনো store-এ নেই বলে)
export const getAdminMe = (token) =>
  apiClient.get('/admin/me', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
