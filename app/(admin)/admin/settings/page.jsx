'use client';
import { FiShield, FiUser } from 'react-icons/fi';
import useAdminAuthStore from '../../../../store/adminAuthStore.js';
import { OMS_URL } from '../../../../constants/index.js';

/**
 * Admin Settings — অ্যাডমিন অ্যাকাউন্ট OMS-এর (ShopBD-র আলাদা অ্যাডমিন/পাসওয়ার্ড/প্রমোট সিস্টেম নেই)।
 * পাসওয়ার্ড/ইউজার ম্যানেজমেন্ট OMS-এ।
 */
export default function AdminSettingsPage() {
  const user = useAdminAuthStore((s) => s.user);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Settings</h1>

      <div className="card p-5 mb-5">
        <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
          <FiUser className="w-4 h-4 text-primary-600" /> Account Info
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-3"><span className="text-surface-500 w-20">Name:</span><span className="font-medium text-surface-800">{user?.name}</span></div>
          <div className="flex gap-3"><span className="text-surface-500 w-20">Phone:</span><span className="font-medium text-surface-800">{user?.phone}</span></div>
          <div className="flex gap-3"><span className="text-surface-500 w-20">Role:</span><span className="font-semibold text-primary-600 capitalize">{user?.role}</span></div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-surface-900 mb-2 flex items-center gap-2">
          <FiShield className="w-4 h-4 text-primary-600" /> অ্যাকাউন্ট ও ইউজার ম্যানেজমেন্ট
        </h2>
        <p className="text-sm text-surface-500">
          অ্যাডমিন/মডারেটর অ্যাকাউন্ট, অনুমোদন ও পারমিশন OMS ড্যাশবোর্ড থেকে ম্যানেজ হয়।
        </p>
        {OMS_URL && (
          <a href={OMS_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm inline-block mt-4">
            OMS ড্যাশবোর্ড খুলুন ↗
          </a>
        )}
      </div>
    </div>
  );
}
