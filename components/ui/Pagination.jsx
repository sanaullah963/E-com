'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Pagination Component
 * URL-based pagination for SEO and shareability
 */
export default function Pagination({ pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalCount, limit } = pagination;

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Pages around current

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Result count */}
      <p className="text-sm text-surface-500">
        Showing <span className="font-medium text-surface-800">{startItem}–{endItem}</span>{' '}
        of <span className="font-medium text-surface-800">{totalCount}</span> products
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="w-9 h-9 rounded-lg border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-surface-400 text-sm">
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`
                w-9 h-9 rounded-lg text-sm font-medium transition-colors
                ${currentPage === page
                  ? 'bg-primary-600 text-white border border-primary-600'
                  : 'border border-surface-200 text-surface-700 hover:bg-surface-50'
                }
              `}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="w-9 h-9 rounded-lg border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
