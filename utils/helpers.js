/**
 * Format price in BDT (Bangladeshi Taka)
 * @param {number} price
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '৳0';
  return `৳${Number(price).toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Calculate discount percentage
 * @param {number} regularPrice
 * @param {number} salePrice
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (regularPrice, salePrice) => {
  if (!salePrice || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

/**
 * Get stock status label and color
 * @param {number} stock
 * @returns {Object} { label, color, textColor }
 */
export const getStockStatus = (stock) => {
  if (stock === 0) {
    return { label: 'Out of Stock', color: 'bg-red-100', textColor: 'text-red-600', key: 'out_of_stock' };
  }
  if (stock <= 5) {
    return { label: `Only ${stock} left`, color: 'bg-yellow-100', textColor: 'text-yellow-700', key: 'low_stock' };
  }
  return { label: 'In Stock', color: 'bg-green-100', textColor: 'text-green-700', key: 'in_stock' };
};

/**
 * Truncate text to specified length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Generate placeholder image URL for Cloudinary
 * @param {string} text - Alt text
 * @returns {string}
 */
export const getPlaceholderImage = (text = 'Product') => {
  return `https://placehold.co/600x600/f1f5f9/94a3b8?text=${encodeURIComponent(text)}`;
};

/**
 * Build URL query string from params object
 * @param {Object} params
 * @returns {string}
 */
export const buildQueryString = (params) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );
  return new URLSearchParams(clean).toString();
};

/**
 * Debounce function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Format date to local BD format
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get Cloudinary optimized image URL
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string}
 */
export const getOptimizedImageUrl = (url, { width = 400, height = 400, quality = 'auto' } = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/`);
};
