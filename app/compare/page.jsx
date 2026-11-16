'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiX, FiPlus } from 'react-icons/fi';
import { useCompareProducts } from '../../hooks/useVariants.js';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers.js';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];

  const { data, isLoading } = useCompareProducts(ids);
  const products = data?.data || [];

  const removeProduct = (id) => {
    const newIds = ids.filter((i) => i !== id);
    if (newIds.length === 0) router.push('/products');
    else router.push(`/compare?ids=${newIds.join(',')}`);
  };

  // Collect all unique spec keys
  const specKeys = ['category', 'brand', 'sku', 'stock'];

  if (ids.length < 2) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">⚖️</p>
        <h2 className="text-xl font-bold text-surface-900 mb-2">Add products to compare</h2>
        <p className="text-surface-500 text-sm mb-6">Select at least 2 products to compare.</p>
        <Link href="/products" className="btn-primary text-sm">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Compare Products</h1>

      {isLoading ? (
        <div className="flex gap-4">
          {ids.map((id) => (
            <div key={id} className="flex-1 card h-64 animate-pulse bg-surface-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* Product Images + Names */}
            <thead>
              <tr>
                <th className="text-left py-3 pr-4 w-32 text-sm font-semibold text-surface-500 uppercase tracking-wide">Feature</th>
                {products.map((product) => (
                  <th key={product._id} className="px-4 py-3 align-top">
                    <div className="relative">
                      <button
                        onClick={() => removeProduct(product._id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-50 mb-3">
                        <Image
                          src={product.thumbnailImage?.url || getPlaceholderImage(product.name)}
                          alt={product.name}
                          fill sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <Link href={`/products/${product.slug}`} className="font-semibold text-sm text-surface-800 hover:text-primary-600 line-clamp-2 block">
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-100">
              {/* Price Row */}
              <tr>
                <td className="py-3 pr-4 text-sm font-medium text-surface-600">Price</td>
                {products.map((product) => (
                  <td key={product._id} className="px-4 py-3 text-center">
                    <p className="font-bold text-primary-600">{formatPrice(product.salePrice || product.regularPrice)}</p>
                    {product.salePrice && <p className="text-xs text-surface-400 line-through">{formatPrice(product.regularPrice)}</p>}
                  </td>
                ))}
              </tr>

              {/* Spec Rows */}
              {specKeys.map((key) => (
                <tr key={key}>
                  <td className="py-3 pr-4 text-sm font-medium text-surface-600 capitalize">{key}</td>
                  {products.map((product) => (
                    <td key={product._id} className="px-4 py-3 text-center text-sm text-surface-700">
                      {key === 'stock' ? (
                        <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      ) : (
                        product[key] || '—'
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Flags Row */}
              <tr>
                <td className="py-3 pr-4 text-sm font-medium text-surface-600">Badges</td>
                {products.map((product) => (
                  <td key={product._id} className="px-4 py-3 text-center">
                    {product.flags?.length > 0
                      ? product.flags.map((f, i) => (
                          <span key={i} className="inline-block text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mr-1 mb-1 font-medium capitalize">{f.type}</span>
                        ))
                      : <span className="text-surface-400 text-sm">—</span>
                    }
                  </td>
                ))}
              </tr>

              {/* CTA Row */}
              <tr>
                <td className="py-4 pr-4" />
                {products.map((product) => (
                  <td key={product._id} className="px-4 py-4 text-center">
                    <Link href={`/products/${product.slug}`} className="btn-primary text-xs px-4 py-2">
                      View Product
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="section-container py-16 text-center"><p>Loading...</p></div>}>
      <CompareContent />
    </Suspense>
  );
}
