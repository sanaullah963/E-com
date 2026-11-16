'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import { getCustomersApi, toggleCustomerStatusApi } from '@/services/admin.service.js';
import { formatDate } from '@/utils/helpers.js';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', { search, page }],
    queryFn: () => getCustomersApi({ search, page, limit: 20 }),
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: toggleCustomerStatusApi,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success(`Customer ${data.data.isActive ? 'activated' : 'deactivated'}.`);
    },
    onError: (err) => toast.error(err.message),
  });

  const customers = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Customers</h1>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="input pl-9 text-sm"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              {['Customer', 'Phone', 'Orders', 'Joined', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-surface-100 rounded animate-pulse" /></td></tr>)
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-surface-400">No customers found</td></tr>
            ) : customers.map((customer) => (
              <tr key={customer._id} className="hover:bg-surface-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 text-xs font-bold">{customer.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-surface-800">{customer.name}</p>
                      <p className="text-xs text-surface-400">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-surface-600">{customer.phone || '—'}</td>
                <td className="px-4 py-3 text-surface-600">{customer.totalOrders || 0}</td>
                <td className="px-4 py-3 text-surface-500 text-xs">{formatDate(customer.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {(
                    <button
                      onClick={() => toggleStatus(customer._id)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                        customer.isActive
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {customer.isActive ? <><FiUserX className="w-3 h-3" /> Deactivate</> : <><FiUserCheck className="w-3 h-3" /> Activate</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-surface-100 flex items-center justify-between">
            <p className="text-xs text-surface-500">Total: {pagination.totalCount} customers</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-surface-50">Prev</button>
              <span className="px-3 py-1 text-xs bg-primary-600 text-white rounded-lg">{page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNextPage} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-surface-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
