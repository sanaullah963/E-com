// OMS ecommerce API — ডিফল্ট same-origin proxy (next.config.mjs rewrites → OMS /api/ecommerce)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/ecommerce';

// অ্যাডমিন লগইন (OMS /api/auth/login, proxy হয়ে)
export const ADMIN_LOGIN_URL = '/api/admin-auth/login';

// OMS ড্যাশবোর্ড (অর্ডার ম্যানেজমেন্ট/কুরিয়ার সেখানে)
export const OMS_URL = process.env.NEXT_PUBLIC_OMS_URL || '';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Ms Beauty';

export const QUERY_KEYS = {
  products: 'products',
  product: 'product',
  categories: 'categories',
  brands: 'brands',
};

export const PRODUCT_VISIBILITY = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  DISABLED: 'disabled',
};

export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
};

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'regularPrice:asc', label: 'Price: Low to High' },
  { value: 'regularPrice:desc', label: 'Price: High to Low' },
  { value: 'name:asc', label: 'Name: A-Z' },
  { value: 'name:desc', label: 'Name: Z-A' },
];
