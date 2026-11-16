import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  fetchProducts,
  fetchProductBySlug,
  fetchCategories,
  fetchBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service.js';
import { QUERY_KEYS, PAGINATION } from '../constants/index.js';
import { toast } from 'sonner';

/**
 * Hook: Fetch all products with filters from URL search params
 */
export const useProducts = (overrideParams = {}) => {
  const searchParams = useSearchParams();

  const params = {
    page: searchParams.get('page') || PAGINATION.DEFAULT_PAGE,
    limit: searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: searchParams.get('sortOrder') || undefined,
    inStock: searchParams.get('inStock') || undefined,
    ...overrideParams,
  };

  // Remove undefined values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  );

  return useQuery({
    queryKey: [QUERY_KEYS.products, cleanParams],
    queryFn: () => fetchProducts(cleanParams),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};

/**
 * Hook: Fetch single product by slug
 */
export const useProduct = (slug) => {
  return useQuery({
    queryKey: [QUERY_KEYS.product, slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
};

/**
 * Hook: Fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes (categories change rarely)
  });
};

/**
 * Hook: Fetch all brands
 */
export const useBrands = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.brands],
    queryFn: fetchBrands,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Create product mutation
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
      toast.success('Product created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

/**
 * Hook: Update product mutation
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.product] });
      toast.success('Product updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

/**
 * Hook: Delete product mutation
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
      toast.success('Product deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};
