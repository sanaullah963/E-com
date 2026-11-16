'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiEyeOff } from 'react-icons/fi';
import { fetchProducts, deleteProduct, updateProduct } from '@/services/product.service.js';
import { formatPrice, getPlaceholderImage } from '@/utils/helpers.js';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', { search, page }],
    queryFn: () => fetchProducts({ search, page, limit: 15 }),
  });

  const { mutate: removeProduct } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Product deleted.'); },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: toggleVisibility } = useMutation({
    mutationFn: ({ id, status }) => updateProduct(id, { visibilityStatus: status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Visibility updated.'); },
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Products</h1>
        <Link href="/admin/products/create" className="btn-primary text-sm gap-1.5">
          <FiPlus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="input pl-9 text-sm" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Visibility', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-surface-100 rounded animate-pulse" /></td></tr>)
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-surface-400">No products found</td></tr>
            ) : products.map((product) => (
              <tr key={product._id} className="hover:bg-surface-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                      <Image src={product.thumbnailImage?.url || getPlaceholderImage(product.name)} alt={product.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-surface-800 line-clamp-1 max-w-[200px]">{product.name}</p>
                      <p className="text-xs text-surface-400 font-mono">{product.productId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-surface-600">{product.category}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-surface-800">{formatPrice(product.salePrice || product.regularPrice)}</p>
                  {product.salePrice && <p className="text-xs text-surface-400 line-through">{formatPrice(product.regularPrice)}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${product.visibilityStatus === 'visible' ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-surface-500'}`}>
                    {product.visibilityStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisibility({ id: product._id, status: product.visibilityStatus === 'visible' ? 'hidden' : 'visible' })}
                      className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                      title={product.visibilityStatus === 'visible' ? 'Hide' : 'Show'}
                    >
                      {product.visibilityStatus === 'visible' ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                    </button>
                    <Link href={`/admin/products/${product._id}/edit`} className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors">
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => { if (confirm(`Delete "${product.name}"?`)) removeProduct(product._id); }}
                      className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-surface-100 flex items-center justify-between">
            <p className="text-xs text-surface-500">Total: {pagination.totalCount} products</p>
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
