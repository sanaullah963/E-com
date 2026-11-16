'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { getDashboardApi } from '../../../../services/admin.service.js';
// import { formatPrice, formatDate } from '../../../../utils/helpers.js';
import { formatPrice, formatDate } from '@/utils/helpers.js';


const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getDashboardApi,
    refetchInterval: 60000,
  });

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="card p-5 h-24 animate-pulse bg-surface-100" />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.overview?.totalRevenue || 0), icon: FiDollarSign, color: 'text-green-600 bg-green-50', sub: `This month: ${formatPrice(stats?.overview?.monthRevenue || 0)}` },
    { label: 'Total Orders', value: stats?.overview?.totalOrders || 0, icon: FiShoppingBag, color: 'text-blue-600 bg-blue-50', sub: `Pending: ${stats?.orders?.pending || 0}` },
    { label: 'Products', value: stats?.overview?.totalProducts || 0, icon: FiPackage, color: 'text-purple-600 bg-purple-50', sub: `Low stock: ${stats?.inventory?.lowStock || 0}` },
    { label: 'Customers', value: stats?.overview?.totalCustomers || 0, icon: FiUsers, color: 'text-orange-600 bg-orange-50', sub: `Today orders: ${stats?.orders?.today || 0}` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-sm text-surface-500">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-surface-900">{card.value}</p>
            <p className="text-xs text-surface-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-surface-900 flex items-center gap-2"><FiClock className="w-4 h-4 text-primary-600" />Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-primary-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-surface-50 last:border-0">
                <div>
                  <p className="font-mono text-xs font-bold text-surface-800">{order.orderId}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{order.shippingAddress?.fullName} · {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
                  <p className="text-xs font-bold text-primary-600 mt-0.5">{formatPrice(order.pricing?.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-surface-900 flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4 text-amber-500" />
              Low Stock Alert
            </h2>
            <Link href="/admin/inventory" className="text-xs text-primary-600 hover:underline">Manage →</Link>
          </div>
          {stats?.inventory?.lowStock === 0 ? (
            <p className="text-sm text-green-600 py-4 text-center">✅ All products adequately stocked</p>
          ) : (
            <div className="space-y-2">
              {stats?.topProducts?.slice(0, 5).map((p) => (
                <div key={p._id} className="flex items-center justify-between py-1.5 border-b border-surface-50 last:border-0">
                  <p className="text-sm text-surface-700 line-clamp-1 flex-1">{p.name}</p>
                  <span className="text-xs font-bold text-amber-600 ml-2">{p.totalSold} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
