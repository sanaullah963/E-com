/**
 * ProductCardSkeleton
 * Loading placeholder matching ProductCard dimensions
 */
export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-surface-200" />

      {/* Content skeleton */}
      <div className="p-3 space-y-2.5">
        {/* Category */}
        <div className="h-3 bg-surface-200 rounded w-1/3" />

        {/* Name */}
        <div className="space-y-1.5">
          <div className="h-4 bg-surface-200 rounded w-full" />
          <div className="h-4 bg-surface-200 rounded w-3/4" />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 bg-surface-100 rounded w-full" />
          <div className="h-3 bg-surface-100 rounded w-5/6" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 bg-surface-200 rounded w-20" />
          <div className="h-3 bg-surface-100 rounded w-14" />
        </div>

        {/* Stock & CTA */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-surface-100 rounded-full w-16" />
          <div className="h-7 bg-surface-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of skeletons
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
