'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { debounce } from '../../utils/helpers.js';

/**
 * SearchBar Component
 * URL-based search for SEO compatibility
 */
export default function SearchBar({ placeholder = 'Search products...', className = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');

  // Sync with URL params
  useEffect(() => {
    setValue(searchParams.get('search') || '');
  }, [searchParams]);

  const updateSearchParam = useCallback(
    debounce((query) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('search', query);
        params.delete('page'); // Reset to page 1 on search
      } else {
        params.delete('search');
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 400),
    [pathname, searchParams]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateSearchParam(newValue);
  };

  const handleClear = () => {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input pl-9 pr-9"
        aria-label="Search products"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          aria-label="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
