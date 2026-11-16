import apiClient from '../lib/apiClient.js';

// Banners
export const getHeroBannersApi = () => apiClient.get('/banners?placement=hero');
export const getPromoBannersApi = () => apiClient.get('/banners?placement=promotional');
export const trackBannerClickApi = (id) => apiClient.post(`/banners/${id}/click`);

// Admin banners
export const getAllBannersApi = (params) => apiClient.get('/banners/admin/all', { params });
export const createBannerApi = (data) => apiClient.post('/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBannerApi = (id, data) => apiClient.put(`/banners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBannerApi = (id) => apiClient.delete(`/banners/${id}`);

// Coupons
// items পাঠালে সার্ভার নিজে দাম/ক্যাটাগরি যাচাই করে ছাড় হিসাব করে (cartSubtotal শুধু fallback)
export const applyCouponApi = (code, cartSubtotal, items) => apiClient.post('/coupons/apply', { code, cartSubtotal, items });
export const checkCouponApi = (code) => apiClient.get(`/coupons/check/${code}`);
export const getAllCouponsApi = (params) => apiClient.get('/coupons', { params });
export const createCouponApi = (data) => apiClient.post('/coupons', data);
export const updateCouponApi = (id, data) => apiClient.put(`/coupons/${id}`, data);
export const deleteCouponApi = (id) => apiClient.delete(`/coupons/${id}`);

// Campaigns & Collections
export const getActiveCampaignsApi = (type) => apiClient.get('/campaigns/active', { params: { type } });
export const getCampaignApi = (slug) => apiClient.get(`/campaigns/${slug}`);
export const getFeaturedProductsApi = (limit) => apiClient.get('/campaigns/featured', { params: { limit } });
export const getTrendingProductsApi = (limit) => apiClient.get('/campaigns/trending', { params: { limit } });
export const getNewArrivalsApi = (limit) => apiClient.get('/campaigns/new-arrivals', { params: { limit } });
export const getBestsellersApi = (limit) => apiClient.get('/campaigns/bestsellers', { params: { limit } });
export const getAllCampaignsApi = (params) => apiClient.get('/campaigns', { params });
export const createCampaignApi = (data) => apiClient.post('/campaigns', data);
export const updateCampaignApi = (id, data) => apiClient.put(`/campaigns/${id}`, data);
export const deleteCampaignApi = (id) => apiClient.delete(`/campaigns/${id}`);
