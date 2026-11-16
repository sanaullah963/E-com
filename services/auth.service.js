import apiClient from '../lib/apiClient.js';

export const registerApi = (data) => apiClient.post('/auth/register', data);
export const loginApi = (data) => apiClient.post('/auth/login', data);
export const logoutApi = () => apiClient.post('/auth/logout');
export const getMeApi = () => apiClient.get('/auth/me');
export const forgotPasswordApi = (email) => apiClient.post('/auth/forgot-password', { email });
export const resetPasswordApi = (token, password) => apiClient.post('/auth/reset-password', { token, password });
export const changePasswordApi = (data) => apiClient.post('/auth/change-password', data);
export const updateProfileApi = (data) => apiClient.put('/customers/profile', data);
export const getWishlistApi = () => apiClient.get('/customers/wishlist');
export const addWishlistApi = (productId) => apiClient.post(`/customers/wishlist/${productId}`);
export const removeWishlistApi = (productId) => apiClient.delete(`/customers/wishlist/${productId}`);
// OMS ব্যাকএন্ডে POST = শুধু যোগ, DELETE = শুধু মোছা (আর toggle নয়) — তাই বর্তমান অবস্থা জানাতে হয়
export const toggleWishlistApi = (productId, isInWishlist = false) => (isInWishlist ? removeWishlistApi(productId) : addWishlistApi(productId));
export const getAddressesApi = () => apiClient.get('/auth/me');
export const addAddressApi = (data) => apiClient.post('/customers/addresses', data);
export const updateAddressApi = (id, data) => apiClient.put(`/customers/addresses/${id}`, data);
export const deleteAddressApi = (id) => apiClient.delete(`/customers/addresses/${id}`);
export const getOrderHistoryApi = (params) => apiClient.get('/customers/orders', { params });
