import { Suspense } from 'react';
import ProductDetailContent from './ProductDetailContent.jsx';

/**
 * Product Detail Page - Server Component
 * Dynamic route: /products/[slug]
 */
export async function generateMetadata({ params }) {
  const {slug} = await params;
  try {
    // সার্ভার-সাইডে relative URL চলে না — OMS অরিজিন সরাসরি
    const configured = process.env.NEXT_PUBLIC_API_URL;
    const API_URL = configured && /^https?:\/\//.test(configured)
      ? configured
      : `${(process.env.OMS_API_ORIGIN || 'http://localhost:5000').replace(/\/$/, '')}/api/ecommerce`;
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return { title: 'Product Not Found' };

    const { data: product } = await res.json();

    return {
      title: product.name,
      description: product.shortDescription || `Buy ${product.name} online`,
      openGraph: {
        title: product.name,
        description: product.shortDescription,
        images: product.thumbnailImage?.url ? [{ url: product.thumbnailImage.url }] : [],
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  return (
    <div className="section-container py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent slug={slug} />
      </Suspense>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-surface-200 rounded w-48 mb-6" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-surface-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-surface-200 rounded w-3/4" />
          <div className="h-6 bg-surface-200 rounded w-1/3" />
          <div className="h-4 bg-surface-100 rounded w-full" />
          <div className="h-4 bg-surface-100 rounded w-5/6" />
          <div className="h-12 bg-surface-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
