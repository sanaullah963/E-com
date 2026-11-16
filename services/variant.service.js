import apiClient from '../lib/apiClient.js';

export const getVariantsApi = (productId) =>
  apiClient.get(`/products/${productId}/variants`);

export const createVariantApi = (productId, data) =>
  apiClient.post(`/products/${productId}/variants`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateVariantApi = (productId, variantId, data) =>
  apiClient.put(`/products/${productId}/variants/${variantId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteVariantApi = (productId, variantId) =>
  apiClient.delete(`/products/${productId}/variants/${variantId}`);

export const adjustVariantStockApi = (productId, variantId, adjustment) =>
  apiClient.patch(`/products/${productId}/variants/${variantId}/stock`, { adjustment });

export const compareProductsApi = (ids) =>
  apiClient.get('/products/compare', { params: { ids: ids.join(',') } });

export const getRelatedProductsApi = (slug) =>
  apiClient.get(`/products/${slug}/related`);

export const setRelatedProductsApi = (productId, relatedIds, frequentlyBoughtIds) =>
  apiClient.put(`/products/${productId}/related`, { relatedIds, frequentlyBoughtIds });

export const updateProductFlagsApi = (productId, flags) =>
  apiClient.put(`/products/${productId}/flags`, { flags });
