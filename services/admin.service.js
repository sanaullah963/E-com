import apiClient from '../lib/apiClient.js';

export const getDashboardApi = () => apiClient.get('/admin/dashboard');
export const getCustomersApi = (params) => apiClient.get('/admin/customers', { params });
export const toggleCustomerStatusApi = (id) => apiClient.patch(`/admin/customers/${id}/toggle-status`);
export const getLowStockApi = (threshold) => apiClient.get('/admin/inventory/low-stock', { params: { threshold } });
export const adjustStockApi = (id, adjustment, note) => apiClient.patch(`/admin/inventory/${id}/adjust-stock`, { adjustment, note });
// ওয়েবসাইট অর্ডার: শুধু দেখা (read-only)। স্ট্যাটাস পরিবর্তন/কুরিয়ার/নোট OMS ড্যাশবোর্ডে হয়।
export const getAdminOrdersApi = (params) => apiClient.get('/admin/orders', { params });
export const getAdminOrderApi = (id) => apiClient.get(`/admin/orders/${id}`);
export const getCategoriesAdminApi = () => apiClient.get('/admin/categories');
export const createCategoryApi = (data) => apiClient.post('/admin/categories', data);
export const updateCategoryApi = (id, data) => apiClient.put(`/admin/categories/${id}`, data);
export const deleteCategoryApi = (id) => apiClient.delete(`/admin/categories/${id}`);
export const getBrandsAdminApi = () => apiClient.get('/admin/brands');
export const createBrandApi = (data) => apiClient.post('/admin/brands', data);
export const updateBrandApi = (id, data) => apiClient.put(`/admin/brands/${id}`, data);
export const deleteBrandApi = (id) => apiClient.delete(`/admin/brands/${id}`);

