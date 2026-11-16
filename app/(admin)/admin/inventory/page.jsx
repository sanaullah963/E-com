'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FiAlertTriangle, FiPlus, FiMinus } from 'react-icons/fi';
import { getLowStockApi, adjustStockApi } from '@/services/admin.service.js';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/helpers.js';

export default function AdminInventoryPage() {
  const [threshold, setThreshold] = useState(5);
  const [adjusting, setAdjusting] = useState({}); // { productId: value }
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['low-stock', threshold],
    queryFn: () => getLowStockApi(threshold),
  });

  const { mutate: adjustStock } = useMutation({
    mutationFn: ({ id, adjustment, note }) => adjustStockApi(id, adjustment, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['low-stock'] });
      toast.success('Stock adjusted!');
      setAdjusting({});
    },
    onError: (err) => toast.error(err.message),
  });

  const products = data?.data || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Inventory Management</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-surface-600">Low stock threshold:</label>
          <select
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="input w-20 text-sm"
          >
            {[3, 5, 10, 15, 20].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Low Stock', value: products.filter(p => p.stock > 0).length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, color: 'text-red-600 bg-red-50' },
          { label: 'Total Affected', value: products.length, color: 'text-surface-600 bg-surface-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-3xl font-black ${s.color.split(' ')[0]}`}>{s.value}</p>
            <p className="text-xs text-surface-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className="card p-8 text-center"><span className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin inline-block" /></div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-surface-600 font-medium">All products are adequately stocked!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 border-b border-surface-100">
              <tr>
                {['Product', 'Category', 'Current Stock', 'Status', 'Adjust Stock'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-surface-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                        <Image
                          src={product.thumbnailImage?.url || getPlaceholderImage(product.name)}
                          alt={product.name}
                          fill sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-surface-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-surface-400 font-mono">{product.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-lg font-black ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stock}
                    </span>
                    <span className="text-xs text-surface-400 ml-1">units</span>
                  </td>
                  <td className="px-4 py-3">
                    {product.stock === 0 ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                        <FiAlertTriangle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
                        <FiAlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAdjusting(prev => ({ ...prev, [product._id]: (prev[product._id] || 0) - 1 }))}
                        className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-50 text-surface-600"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={adjusting[product._id] || 0}
                        onChange={(e) => setAdjusting(prev => ({ ...prev, [product._id]: parseInt(e.target.value) || 0 }))}
                        className="w-16 text-center input text-sm py-1.5"
                      />
                      <button
                        onClick={() => setAdjusting(prev => ({ ...prev, [product._id]: (prev[product._id] || 0) + 1 }))}
                        className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-50 text-surface-600"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          const adj = adjusting[product._id] || 0;
                          if (adj === 0) return toast.error('Enter a non-zero value');
                          adjustStock({ id: product._id, adjustment: adj, note: 'Manual adjustment' });
                        }}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Apply
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
