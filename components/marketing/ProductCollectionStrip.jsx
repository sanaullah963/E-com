import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import ProductFlagBadge from '../product/ProductFlagBadge.jsx';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers.js';

/**
 * ProductCollectionStrip — V6
 * Horizontal scrollable collection row
 * Used for: Featured, Trending, New Arrivals, Bestsellers
 */
export default function ProductCollectionStrip({
  title,
  subtitle,
  products = [],
  viewAllHref,
  isLoading = false,
  accentColor = 'text-primary-600',
  badgeColor = 'bg-primary-100 text-primary-700',
}) {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className={`text-xl md:text-2xl font-bold text-surface-900`}>{title}</h2>
            {subtitle && <p className="text-surface-500 text-sm mt-0.5">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className={`hidden sm:flex items-center gap-1.5 text-sm font-medium ${accentColor} hover:opacity-75 transition-opacity`}>
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Scrollable Grid */}
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-44 sm:w-52 snap-start">
                  <div className="aspect-square bg-surface-200 rounded-xl animate-pulse mb-3" />
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-surface-100 rounded w-1/2 animate-pulse" />
                </div>
              ))
            : products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="flex-shrink-0 w-44 sm:w-52 snap-start group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-50 mb-3">
                    <Image
                      src={product.thumbnailImage?.url || getPlaceholderImage(product.name)}
                      alt={product.name}
                      fill
                      sizes="208px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.flags?.length > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {product.flags[0]?.label || product.flags[0]?.type}
                        </span>
                      </div>
                    )}
                    {product.campaignPrice && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ৳{product.campaignPrice}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-surface-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-sm ${product.salePrice ? 'text-primary-600' : 'text-surface-800'}`}>
                      {formatPrice(product.campaignPrice || product.salePrice || product.regularPrice)}
                    </span>
                    {(product.salePrice || product.campaignPrice) && (
                      <span className="text-xs text-surface-400 line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
        </div>

        {/* Mobile: View All */}
        {viewAllHref && (
          <div className="sm:hidden mt-4 text-center">
            <Link href={viewAllHref} className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentColor}`}>
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
