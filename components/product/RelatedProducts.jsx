import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers.js';

/**
 * RelatedProducts — V5
 * Horizontal scrollable related product strip
 */
export default function RelatedProducts({ products = [], title = 'Related Products' }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-surface-100">
      <h2 className="text-xl font-bold text-surface-900 mb-5">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="group card overflow-hidden hover:-translate-y-0.5 transition-transform duration-200"
          >
            <div className="relative aspect-square bg-surface-50">
              <Image
                src={product.thumbnailImage?.url || getPlaceholderImage(product.name)}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-surface-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-sm text-primary-600">
                  {formatPrice(product.salePrice || product.regularPrice)}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-surface-400 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
