import apiClient from '../lib/apiClient.js';

/**
 * Order API Service — Version 2
 */

/**
 * Place a new order
 */
export const placeOrder = async (orderData, idempotencyKey) => {
  // Idempotency-Key: একই অর্ডার ডাবল-সাবমিট/রিট্রাই হলেও সার্ভার একটিই অর্ডার তৈরি করে
  return apiClient.post('/orders', orderData, idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : undefined);
};

/**
 * Track order by orderId + phone
 */
export const trackOrder = async (orderId, phone) => {
  return apiClient.get('/orders/track', { params: { orderId, phone } });
};

/**
 * Get all districts with delivery charges
 */
export const fetchDistricts = async () => {
  return apiClient.get('/orders/districts');
};

/**
 * Get delivery charge for a district
 */
export const fetchDeliveryCharge = async (district) => {
  return apiClient.get('/orders/delivery-charge', { params: { district } });
};
