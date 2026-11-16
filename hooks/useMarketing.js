import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getHeroBannersApi, getPromoBannersApi,
  getFeaturedProductsApi, getTrendingProductsApi,
  getNewArrivalsApi, getBestsellersApi,
  getActiveCampaignsApi, getCampaignApi,
  applyCouponApi, getAllCouponsApi,
  createCouponApi, updateCouponApi, deleteCouponApi,
  getAllBannersApi, createBannerApi, updateBannerApi, deleteBannerApi,
  getAllCampaignsApi, createCampaignApi, updateCampaignApi, deleteCampaignApi,
} from '../services/marketing.service.js';

// ── Banners ──────────────────────────────
export const useHeroBanners = () => useQuery({
  queryKey: ['banners', 'hero'],
  queryFn: getHeroBannersApi,
  staleTime: 5 * 60 * 1000,
});

export const usePromoBanners = () => useQuery({
  queryKey: ['banners', 'promo'],
  queryFn: getPromoBannersApi,
  staleTime: 5 * 60 * 1000,
});

// ── Collections ──────────────────────────────
export const useFeaturedProducts = (limit = 8) => useQuery({
  queryKey: ['featured-products', limit],
  queryFn: () => getFeaturedProductsApi(limit),
  staleTime: 5 * 60 * 1000,
});

export const useTrendingProducts = (limit = 8) => useQuery({
  queryKey: ['trending-products', limit],
  queryFn: () => getTrendingProductsApi(limit),
  staleTime: 5 * 60 * 1000,
});

export const useNewArrivals = (limit = 8) => useQuery({
  queryKey: ['new-arrivals', limit],
  queryFn: () => getNewArrivalsApi(limit),
  staleTime: 5 * 60 * 1000,
});

export const useBestsellers = (limit = 8) => useQuery({
  queryKey: ['bestsellers', limit],
  queryFn: () => getBestsellersApi(limit),
  staleTime: 5 * 60 * 1000,
});

// ── Campaigns ──────────────────────────────
export const useActiveCampaigns = (type) => useQuery({
  queryKey: ['active-campaigns', type],
  queryFn: () => getActiveCampaignsApi(type),
  staleTime: 5 * 60 * 1000,
});

export const useCampaign = (slug) => useQuery({
  queryKey: ['campaign', slug],
  queryFn: () => getCampaignApi(slug),
  enabled: !!slug,
});

// ── Coupons ──────────────────────────────
export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: ({ code, cartSubtotal, items }) => applyCouponApi(code, cartSubtotal, items),
    onSuccess: (data) => toast.success(`Coupon applied! You saved ৳${data.data.discountAmount}`),
    onError: (err) => toast.error(err.message || 'Invalid coupon'),
  });
};

// ── Admin: Coupons ──────────────────────────────
export const useAdminCoupons = (params) => useQuery({
  queryKey: ['admin-coupons', params],
  queryFn: () => getAllCouponsApi(params),
});

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCouponApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon created!'); },
    onError: (err) => toast.error(err.message),
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCouponApi(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon updated!'); },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCouponApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon deleted.'); },
  });
};

// ── Admin: Banners ──────────────────────────────
export const useAdminBanners = (params) => useQuery({
  queryKey: ['admin-banners', params],
  queryFn: () => getAllBannersApi(params),
});

export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBannerApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner created!'); },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBannerApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner deleted.'); },
  });
};

// ── Admin: Campaigns ──────────────────────────────
export const useAdminCampaigns = (params) => useQuery({
  queryKey: ['admin-campaigns', params],
  queryFn: () => getAllCampaignsApi(params),
});

export const useCreateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCampaignApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-campaigns'] }); toast.success('Campaign created!'); },
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaignApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-campaigns'] }); toast.success('Campaign deleted.'); },
  });
};
