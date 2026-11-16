import apiClient from '../lib/apiClient.js';

/**
 * Product API Service
 * All product-related API calls
 */

/**
 * Fetch all products with optional filters
 * @param {Object} params - Query parameters
 */
export const fetchProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  return response;
};

/**
 * Fetch single product by slug
 * @param {string} slug - Product slug
 */
export const fetchProductBySlug = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response;
};

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  const response = await apiClient.get('/products/meta/categories');
  return response;
};

/**
 * Fetch all brands
 */
export const fetchBrands = async () => {
  const response = await apiClient.get('/products/meta/brands');
  return response;
};

/**
 * Create new product (admin)
 * @param {FormData} formData - Product data with images
 */
export const createProduct = async (formData) => {
  const response = await apiClient.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response;
};

/**
 * Update product (admin)
 * @param {string} id - Product ID
 * @param {FormData|Object} data - Updated data
 */
export const updateProduct = async (id, data) => {
  const isFormData = data instanceof FormData;
  const response = await apiClient.put(`/products/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response;
};

/**
 * Delete product (admin)
 * @param {string} id - Product ID
 */
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response;
};
