// import Link from 'next/link';
// import Image from 'next/image';
// import { FiShoppingCart, FiHeart, FiGitBranch } from 'react-icons/fi';
// import ProductFlagBadge from './ProductFlagBadge.jsx';
// import { formatPrice, calculateDiscount, getStockStatus, getPlaceholderImage } from '../../utils/helpers.js';

// export default function ProductCard({ product }) {
//   const { name, slug, regularPrice, salePrice, stock, thumbnailImage, shortDescription, category, brand, flags = [], hasVariants } = product;
//   const discount = calculateDiscount(regularPrice, salePrice);
//   const stockStatus = getStockStatus(stock);
//   const imageUrl = thumbnailImage?.url || getPlaceholderImage(name);
//   const isOnSale = salePrice && salePrice < regularPrice;
//   const displayPrice = isOnSale ? salePrice : regularPrice;

//   return (
//     <article className="group card product-card h-full flex flex-col">
//       <Link href={`/products/${slug}`} className="relative block overflow-hidden bg-surface-50">
//         <div className="aspect-square relative">
//           <Image src={imageUrl} alt={thumbnailImage?.altText || name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
//           {discount > 0 && <div className="absolute top-2 left-2"><span className="badge-sale">-{discount}%</span></div>}
//           {stockStatus.key === 'out_of_stock' && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">Out of Stock</span></div>}
//           {hasVariants && <div className="absolute top-2 right-2 bg-white/90 text-primary-600 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"><FiGitBranch className="w-3 h-3" />Variants</div>}
//         </div>
//       </Link>

//       <div className="p-3 flex flex-col flex-1">
//         {category && <p className="text-xs text-surface-400 uppercase tracking-wide mb-1 font-medium">{brand ? `${brand} · ` : ''}{category}</p>}

//         <Link href={`/products/${slug}`} className="block mb-2">
//           <h3 className="text-sm font-medium text-surface-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">{name}</h3>
//         </Link>

//         {/* V5: Flags */}
//         {flags.length > 0 && <ProductFlagBadge flags={flags} className="mb-2" />}

//         {shortDescription && <p className="text-xs text-surface-500 line-clamp-2 mb-2 flex-1">{shortDescription}</p>}
//         <div className="flex-1" />

//         <div className="flex items-center gap-2 mb-2.5">
//           <span className={`font-bold text-base ${isOnSale ? 'text-primary-600' : 'text-surface-800'}`}>{formatPrice(displayPrice)}</span>
//           {isOnSale && <span className="text-surface-400 line-through text-xs">{formatPrice(regularPrice)}</span>}
//         </div>

//         <div className="flex items-center justify-between">
//           <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockStatus.color} ${stockStatus.textColor}`}>{stockStatus.label}</span>
//           <Link href={`/products/${slug}`} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${stockStatus.key === 'out_of_stock' ? 'bg-surface-100 text-surface-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'}`}>
//             <FiShoppingCart className="w-3.5 h-3.5" />View
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }






'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiZap } from 'react-icons/fi';
import ProductFlagBadge from './ProductFlagBadge.jsx';
import StarRating from '../review/StarRating.jsx';
import { formatPrice, calculateDiscount, getStockStatus, getPlaceholderImage } from '../../utils/helpers.js';
import useCartStore from '../../store/cartStore.js';
import { toast } from 'sonner';

export default  function ProductCard({ product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const buyNow = useCartStore((s) => s.buyNow);

  const {
    name, slug, regularPrice, salePrice, stock,
    thumbnailImage, shortDescription, category, brand,
    flags = [], hasVariants,
  } = product;

  const discount = calculateDiscount(regularPrice, salePrice);
  const stockStatus = getStockStatus(stock);
  const imageUrl = thumbnailImage?.url || getPlaceholderImage(name);
  const isOnSale = salePrice && salePrice < regularPrice;
  const displayPrice = isOnSale ? salePrice : regularPrice;
  const isOutOfStock = stockStatus.key === 'out_of_stock';
  const hasVariantsOnly = hasVariants; // variant থাকলে detail page এ যেতে হবে

  // Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    if (hasVariantsOnly) {
      router.push(`/products/${slug}`);
      return;
    }
    addItem(product, 1);
    toast.success('Cart এ যোগ হয়েছে!');
  };

  // Buy Now / Order — Cart এ যোগ করে সরাসরি Checkout এ

// const handleBuyNow = (e) => {
//   e.preventDefault();
//   if (isOutOfStock) return;
//   if (hasVariantsOnly) {
//     router.push(`/products/${slug}`);
//     return;
//   }
//   // Cart এ add করে সরাসরি checkout এ
//   addItem(product, 1);
//   router.push('/checkout');
// };



const handleBuyNow = (e) => {
  e.preventDefault();
  if (isOutOfStock) return;
  if (hasVariantsOnly) {
    router.push(`/products/${slug}`);
    return;
  }
  // Cart clear করে শুধু এই পণ্য রাখো
  buyNow(product, 1);
  router.push('/checkout');
};

  return (
    <article className="group card product-card h-full flex flex-col">
  
      {/* Image */}
      <Link href={`/products/${slug}`} className="relative block overflow-hidden bg-surface-50">
        <div className="aspect-square relative">
          <Image
            src={imageUrl}
            alt={thumbnailImage?.altText || name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2">
              <span className="badge-sale">-{discount}%</span>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          {hasVariants && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-white/90 text-primary-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              Variants
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
       
        {category && (
          <p className="text-xs text-surface-400 uppercase tracking-wide mb-1 font-medium">
            {brand ? `${brand} · ` : ''}{category}
          </p>
        )}

        <Link href={`/products/${slug}`} className="block mb-2">
          <h3 className="text-sm font-medium text-surface-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {flags.length > 0 && <ProductFlagBadge flags={flags} className="mb-2" />}

        {product.ratingStats?.total > 0 && (
          <div className="mb-2">
            
            <StarRating rating={product.ratingStats.average} size="xs" showCount count={product.ratingStats.total} />
          </div>
        )}

        {shortDescription && (
          <p className="text-xs text-surface-500 line-clamp-2 mb-2">{shortDescription}</p>
        )}

        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`font-bold text-base ${isOnSale ? 'text-primary-600' : 'text-surface-800'}`}>
            {formatPrice(displayPrice)}
          </span>
          {isOnSale && (
            <span className="text-surface-400 line-through text-xs">{formatPrice(regularPrice)}</span>
          )}
        </div>

        {/* ✅ দুইটা বাটন */}
        {isOutOfStock ? (
          <div className="flex items-center justify-center py-2 bg-surface-100 rounded-lg">
            <span className="text-xs text-surface-400 font-medium">Stock নেই</span>
          </div>
        ) : (
          <div className="flex gap-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-2 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <FiShoppingCart className="w-3.5 h-3.5" />
              {hasVariantsOnly ? 'দেখুন' : 'Cart'}
            </button>

            {/* Buy Now / Order */}
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <FiZap className="w-3.5 h-3.5" />
              {hasVariantsOnly ? 'Select' : 'অর্ডার'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}