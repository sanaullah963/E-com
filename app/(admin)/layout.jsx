'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiTag, FiAward, FiAlertTriangle, FiSettings,
  FiLogOut, FiChevronRight, FiImage, FiPercent, FiZap
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAdminAuthStore from '../../store/adminAuthStore.js';
import { getAdminMe } from '../../services/adminAuth.service.js';
import { OMS_URL } from '../../constants/index.js';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { href: '/admin/products', label: 'Products', icon: FiPackage },
  { href: '/admin/customers', label: 'Customers', icon: FiUsers },
  { href: '/admin/categories', label: 'Categories', icon: FiTag },
  { href: '/admin/brands', label: 'Brands', icon: FiAward },
  { href: '/admin/inventory', label: 'Inventory', icon: FiAlertTriangle },
  { section: 'Marketing' },
  { href: '/admin/banners', label: 'Banners', icon: FiImage },
  { href: '/admin/coupons', label: 'Coupons', icon: FiPercent },
  { href: '/admin/campaigns', label: 'Campaigns', icon: FiZap },
  { section: 'System' },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAdminAuthStore((s) => s.token);
  const user = useAdminAuthStore((s) => s.user);
  const setSession = useAdminAuthStore((s) => s.setSession);
  const clearSession = useAdminAuthStore((s) => s.clearSession);
  const isLogin = pathname === '/admin/login';

  // persist রিহাইড্রেশনের আগে রিডাইরেক্ট নয় (SSR/ক্লায়েন্ট মিসম্যাচ এড়াতে)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const done = () => setHydrated(true);
    if (useAdminAuthStore.persist.hasHydrated()) done();
    return useAdminAuthStore.persist.onFinishHydration(done);
  }, []);

  // সেশন যাচাই (টোকেন আছে কিন্তু সার্ভারে বাতিল/মডারেটর হলে → লগইনে; apiClient interceptor-ও এটি করে)
  useEffect(() => {
    if (!hydrated || isLogin) return;
    if (!token) { router.replace('/admin/login'); return; }
    getAdminMe(token).then((r) => setSession(token, r.data)).catch(() => {});
  }, [hydrated, isLogin, token, router, setSession]);

  const logout = () => { clearSession(); router.replace('/admin/login'); };

  // লগইন পেজ: সাইডবার ছাড়া
  if (isLogin) return <>{children}</>;
  if (!hydrated || !token) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-50"><span className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      <aside className="w-56 bg-surface-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-surface-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">ShopBD</p>
              <p className="text-xs text-surface-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <p key={idx} className="text-xs font-semibold text-surface-600 uppercase tracking-wider px-3 pt-4 pb-1">
                  {item.section}
                </p>
              );
            }
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                  isActive ? 'bg-primary-600 text-white' : 'text-surface-400 hover:bg-surface-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <FiChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-surface-800">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          {OMS_URL && (
            <a href={OMS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full px-3 py-2 mb-1 text-sm text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors">
              <FiShoppingBag className="w-4 h-4" />OMS ড্যাশবোর্ড
            </a>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-400 hover:text-red-400 hover:bg-surface-800 rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
