import { Suspense } from 'react';
import ProductsContent from './ProductsContent.jsx';

export const metadata = {
  title: 'All Products',
  description: 'Browse our complete product catalog. Filter by category, brand, price and more.',
};

/**
 * Products Listing Page
 * Server Component with Suspense boundary for streaming
 */
export default async function ProductsPage({ searchParams }) {
const searchkeyword = await searchParams;
  return (
    <div className="section-container py-8">
      <Suspense fallback={<ProductsLoadingFallback />}>
        <ProductsContent searchParams={searchkeyword} />
      </Suspense>
    </div>
  );
}

function ProductsLoadingFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-surface-200 rounded w-48" />
      <div className="flex gap-3">
        <div className="h-10 bg-surface-200 rounded flex-1" />
        <div className="h-10 bg-surface-200 rounded w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-surface-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

