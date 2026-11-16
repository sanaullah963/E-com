import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getVariantsApi, createVariantApi, updateVariantApi,
  deleteVariantApi, adjustVariantStockApi,
  compareProductsApi, getRelatedProductsApi,
} from '../services/variant.service.js';

export const useVariants = (productId) =>
  useQuery({
    queryKey: ['variants', productId],
    queryFn: () => getVariantsApi(productId),
    enabled: !!productId,
  });

export const useRelatedProducts = (slug) =>
  useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => getRelatedProductsApi(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

export const useCompareProducts = (ids) =>
  useQuery({
    queryKey: ['compare-products', ids],
    queryFn: () => compareProductsApi(ids),
    enabled: ids?.length >= 2,
  });

export const useCreateVariant = (productId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createVariantApi(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      toast.success('Variant created!');
    },
    onError: (err) => toast.error(err.message || 'Failed to create variant'),
  });
};

export const useUpdateVariant = (productId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data }) => updateVariantApi(productId, variantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      toast.success('Variant updated!');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteVariant = (productId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variantId) => deleteVariantApi(productId, variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      toast.success('Variant deleted.');
    },
    onError: (err) => toast.error(err.message),
  });
};

export const useAdjustVariantStock = (productId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, adjustment }) => adjustVariantStockApi(productId, variantId, adjustment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['variants', productId] });
      toast.success('Stock adjusted!');
    },
    onError: (err) => toast.error(err.message),
  });
};
