'use client';
import Link from 'next/link';
import { FiPackage, FiHeart, FiMapPin, FiUser, FiShoppingBag } from 'react-icons/fi';
import { useMe, useLogout } from '../../../hooks/useAuth.js';
import { useOrderHistory } from '../../../hooks/useAuth.js';
import { formatPrice, formatDate } from '../../../utils/helpers.js';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const { data: meData, isLoading } = useMe();
  const { data: ordersData } = useOrderHistory({ limit: 5 });
  const { mutate: logout } = useLogout();

  const user = meData?.data;
  const orders = ordersData?.data || [];

  if (isLoading) {
    return <div className="section-container py-16 text-center"><span className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin inline-block" /></div>;
  }

  const quickLinks = [
    { href: '/orders', label: 'My Orders', icon: FiPackage, count: orders.length, color: 'bg-blue-50 text-blue-600' },
    { href: '/wishlist', label: 'Wishlist', icon: FiHeart, count: user?.wishlist?.length || 0, color: 'bg-red-50 text-red-600' },
    { href: '/addresses', label: 'Addresses', icon: FiMapPin, count: user?.addresses?.length || 0, color: 'bg-green-50 text-green-600' },
    { href: '/profile', label: 'Profile', icon: FiUser, count: null, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="section-container py-8 max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-surface-500 text-sm mt-0.5">{user?.email}</p>
        </div>
        <button onClick={() => logout()} className="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50">Sign Out</button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="card p-4 hover:-translate-y-0.5 transition-transform duration-200">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${link.color}`}>
              <link.icon className="w-5 h-5" />
            </div>
            <p className="font-semibold text-surface-800 text-sm">{link.label}</p>
            {link.count !== null && <p className="text-xs text-surface-500 mt-0.5">{link.count} items</p>}
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-surface-900">Recent Orders</h2>
          <Link href="/orders" className="text-xs text-primary-600 hover:underline font-medium">View all →</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <FiShoppingBag className="w-10 h-10 text-surface-300 mx-auto mb-3" />
            <p className="text-surface-500 text-sm">No orders yet.</p>
            <Link href="/products" className="btn-primary text-xs mt-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2.5 border-b border-surface-50 last:border-0">
                <div>
                  <p className="font-mono text-sm font-semibold text-surface-800">{order.orderId}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{formatDate(order.createdAt)} · {order.items?.length} item(s)</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-surface-100 text-surface-600'}`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-bold text-primary-600">{formatPrice(order.pricing?.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
