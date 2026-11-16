'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { useState } from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
import { ProductGridSkeleton } from '../../components/product/ProductCardSkeleton.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import SearchBar from '../../components/ui/SearchBar.jsx';
import { useProducts, useCategories, useBrands } from '../../hooks/useProducts.js';
import { SORT_OPTIONS } from '../../constants/index.js';

/**
 * ProductsContent - Client Component
 * Handles all interactive filtering, search, and pagination
 */
export default  function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =  useSearchParams();
  const [showFilters, setShowFilters] = useState(false);


  const { data: productsData, isLoading, isError, error } = useProducts();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = `${searchParams.get('sortBy') || 'createdAt'}:${searchParams.get('sortOrder') || 'desc'}`;
  const activeSearch = searchParams.get('search') || '';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split(':');
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory || currentBrand || activeSearch;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">All Products</h1>
          {pagination && (
            <p className="text-sm text-surface-500 mt-0.5">
              {pagination.totalCount} products found
            </p>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden btn-secondary text-sm gap-1.5"
        >
          <FiFilter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className={`
          lg:w-56 flex-shrink-0
          ${showFilters ? 'block' : 'hidden lg:block'}
        `}>
          <div className="card p-4 space-y-5 sticky top-20">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-800 text-sm">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                >
                  <FiX className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>

            {/* In Stock Toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={searchParams.get('inStock') === 'true'}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="text-sm font-medium text-surface-700 group-hover:text-surface-900">
                  In Stock Only
                </span>
              </label>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                      !currentCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat === currentCategory ? '' : cat)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        currentCategory === cat ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2.5">
                  Brand
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('brand', '')}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                      !currentBrand ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => updateFilter('brand', brand === currentBrand ? '' : brand)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                        currentBrand === brand ? 'bg-primary-50 text-primary-700 font-medium' : 'text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <SearchBar
              placeholder="Search products..."
              className="flex-1"
            />
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input sm:w-48 text-sm"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeSearch && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-200 font-medium">
                  "{activeSearch}"
                  <button onClick={() => updateFilter('search', '')} className="hover:text-primary-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentCategory && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-200 font-medium">
                  {currentCategory}
                  <button onClick={() => updateFilter('category', '')} className="hover:text-primary-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentBrand && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-200 font-medium">
                  {currentBrand}
                  <button onClick={() => updateFilter('brand', '')} className="hover:text-primary-900">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load products</h3>
              <p className="text-surface-500 text-sm mb-4">{error?.message || 'Something went wrong'}</p>
              <button onClick={() => window.location.reload()} className="btn-primary text-sm">
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">No products found</h3>
              <p className="text-surface-500 text-sm mb-4">
                {hasActiveFilters ? 'Try adjusting your filters or search term.' : 'No products available yet.'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="btn-secondary text-sm">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="mt-6">
                <Pagination pagination={pagination} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
