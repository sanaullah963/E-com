import { useQuery, useMutation } from '@tanstack/react-query';
import { placeOrder, trackOrder, fetchDistricts, fetchDeliveryCharge } from '../services/order.service.js';
import { toast } from 'sonner';
import useCartStore from '../store/cartStore.js';
import { useRouter } from 'next/navigation';

/**
 * Hook: Fetch all districts
 */
export const useDistricts = () => {
  return useQuery({
    queryKey: ['districts'],
    queryFn: fetchDistricts,
    staleTime: Infinity, // Districts don't change
  });
};

/**
 * Hook: Get delivery charge for selected district
 */
export const useDeliveryCharge = (district) => {
  return useQuery({
    queryKey: ['delivery-charge', district],
    queryFn: () => fetchDeliveryCharge(district),
    enabled: !!district,
    staleTime: Infinity,
  });
};

/**
 * Hook: Track order
 */
export const useTrackOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, phone }) => trackOrder(orderId, phone),
    onError: (error) => {
      toast.error(error.message || 'Order not found');
    },
  });
};

/**
 * Hook: Place order mutation
 */
export const usePlaceOrder = () => {
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ payload, idempotencyKey }) => placeOrder(payload, idempotencyKey),
    onSuccess: (data) => {
      clearCart();
      const orderId = data.data.orderId;
      toast.success(`Order placed! Your Order ID: ${orderId}`);
      router.push(`/order-confirmation?orderId=${orderId}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to place order. Please try again.');
    },
  });
};
