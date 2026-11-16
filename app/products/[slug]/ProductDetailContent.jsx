"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiHeart,
  FiShare2,
  FiShoppingCart,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiGitBranch,
  FiZap,
} from "react-icons/fi";
import ProductImageGallery from "@/components/product/ProductImageGallery.jsx";
import ProductFlagBadge from "@/components/product/ProductFlagBadge.jsx";
import VariantSelector from "@/components/product/VariantSelector.jsx";
import RelatedProducts from "@/components/product/RelatedProducts.jsx";
import { useProduct } from "@/hooks/useProducts.js";
import { useQuery } from "@tanstack/react-query";
import {
  getNewArrivalsApi,
  getBestsellersApi,
} from "@/services/marketing.service.js";
import { useRelatedProducts } from "@/hooks/useVariants.js";
import {
  formatPrice,
  calculateDiscount,
  getStockStatus,
} from "../../../utils/helpers.js";
import { useRouter } from "next/navigation";

// component এর ভেতরে

import useCartStore from "../../../store/cartStore.js";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard.jsx";

export default function ProductDetailContent({ slug }) {
  const { data, isLoading, isError, error } = useProduct(slug);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const buyNow = useCartStore((s) => s.buyNow);

  // useProduct এর নিচে এই তিনটা যোগ করুন
  const { data: relatedData } = useRelatedProducts(slug);
  const { data: newArrivalsData } = useQuery({
    queryKey: ["new-arrivals-detail", 3],
    queryFn: () => getNewArrivalsApi(6),
    staleTime: 5 * 60 * 1000,
  });
  const { data: bestsellersData } = useQuery({
    queryKey: ["bestsellers-detail", 3],
    queryFn: () => getBestsellersApi(6),
    staleTime: 5 * 60 * 1000,
  });
console.log(bestsellersData);

  const relatedProducts = relatedData?.data || [];
  const newArrivals = (newArrivalsData?.data || []).filter(
    (p) => p.slug !== slug,
  );
  const bestsellers = (bestsellersData?.data || []).filter(
    (p) => p.slug !== slug,
  );

  if (isLoading) {
    return (
      <div className="animate-pulse grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-surface-200 rounded-xl" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-surface-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😞</div>
        <h2 className="text-xl font-bold text-surface-800 mb-2">
          Product not found
        </h2>
        <p className="text-surface-500 mb-6">{error?.message}</p>
        <Link href="/products" className="btn-primary text-sm">
          <FiArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  const { product, variants = [] } = data?.data || {};
  if (!product) return null;

  const {
    name,
    category,
    brand,
    regularPrice,
    salePrice,
    stock,
    images,
    thumbnailImage,
    shortDescription,
    description,
    productId,
    flags = [],
    hasVariants,
    visibilityStatus,
    // relatedProducts = [],
    frequentlyBoughtWith = [],
  } = product;

  // Use selected variant prices/stock if available
  const activePrice = selectedVariant
    ? selectedVariant.salePrice || selectedVariant.regularPrice
    : salePrice || regularPrice;
  const activeRegularPrice = selectedVariant
    ? selectedVariant.regularPrice
    : regularPrice;
  const activeStock = selectedVariant ? selectedVariant.stock : stock;
  const isOnSale =
    (selectedVariant?.salePrice || salePrice) &&
    activePrice < activeRegularPrice;
  const discount = calculateDiscount(activeRegularPrice, activePrice);
  const stockStatus = getStockStatus(activeStock);
  const isDisabled = visibilityStatus === "disabled";

  const galleryImages =
    images?.length > 0
      ? selectedVariant?.images?.length > 0
        ? selectedVariant.images
        : images
      : thumbnailImage?.url
        ? [
            {
              url: thumbnailImage.url,
              publicId: thumbnailImage.publicId,
              altText: thumbnailImage.altText,
              _id: "thumb",
            },
          ]
        : [];

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a variant first");
      return;
    }
    const cartProduct = {
      _id: product._id,
      variantId: selectedVariant?._id || null,
      variantLabel: selectedVariant?.label || "",
      name,
      slug,
      thumbnailImage: selectedVariant?.images?.[0] || thumbnailImage,
      regularPrice: activeRegularPrice,
      salePrice: selectedVariant?.salePrice || salePrice,
      stock: activeStock,
      category,
      brand,
    };
    addItem(cartProduct, 1);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("আগে variant বাছাই করুন");
      return;
    }
    const cartProduct = {
      _id: product._id,
      variantId: selectedVariant?._id || null,
      variantLabel: selectedVariant?.label || "",
      name,
      slug,
      thumbnailImage: selectedVariant?.images?.[0] || thumbnailImage,
      regularPrice: activeRegularPrice,
      salePrice: selectedVariant?.salePrice || salePrice,
      stock: activeStock,
      category,
      brand,
    };
    // শুধু এই পণ্য checkout এ যাবে
    buyNow(cartProduct, 1);
    router.push("/checkout");
  };

  const StockIcon =
    stockStatus.key === "out_of_stock"
      ? FiXCircle
      : stockStatus.key === "low_stock"
        ? FiAlertTriangle
        : FiCheckCircle;
  // description
  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-surface-500 mb-6"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-primary-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">
          Products
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="hover:text-primary-600"
            >
              {category}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-surface-700 font-medium truncate max-w-[200px]">
          {name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductImageGallery images={galleryImages} productName={name} />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Flags */}
          {flags.length > 0 && (
            <ProductFlagBadge flags={flags} className="mb-3" />
          )}

          {/* Brand */}
          <div className="flex items-center gap-2 mb-2">
            {brand && (
              <Link
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="text-xs font-semibold text-primary-600 uppercase tracking-wider"
              >
                {brand}
              </Link>
            )}
            {brand && category && <span className="text-surface-300">·</span>}
            {category && (
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="text-xs text-surface-500"
              >
                {category}
              </Link>
            )}
            {hasVariants && (
              <span className="ml-auto flex items-center gap-1 text-xs text-surface-400">
                <FiGitBranch className="w-3 h-3" />
                {variants.length} variants
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 leading-tight mb-4">
            {name}
          </h1>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`text-3xl font-extrabold ${isOnSale ? "text-primary-600" : "text-surface-900"}`}
            >
              {formatPrice(activePrice)}
            </span>
            {isOnSale && (
              <>
                <span className="text-lg text-surface-400 line-through">
                  {formatPrice(activeRegularPrice)}
                </span>
                <span className="badge-sale text-sm font-bold px-2.5 py-1">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          {isOnSale && (
            <p className="text-sm text-green-700 font-medium mb-4 flex items-center gap-1.5">
              <FiCheckCircle className="w-4 h-4" />
              You save {formatPrice(activeRegularPrice - activePrice)}
            </p>
          )}

          {shortDescription && (
            <p className="text-surface-600 text-sm leading-relaxed mb-5 border-l-2 border-primary-200 pl-3">
              {shortDescription}
            </p>
          )}

          {/* V5: Variant Selector */}
          {hasVariants && variants.length > 0 && (
            <div className="mb-5">
              <VariantSelector
                variants={variants}
                onVariantChange={setSelectedVariant}
              />
            </div>
          )}

          {/* Stock Status */}
          <div
            className={`flex items-center gap-2 text-sm font-medium mb-6 px-3 py-2.5 rounded-lg ${stockStatus.color}`}
          >
            <StockIcon
              className={`w-4 h-4 flex-shrink-0 ${stockStatus.textColor}`}
            />
            <span className={stockStatus.textColor}>
              {stockStatus.label}
              {stockStatus.key !== "out_of_stock" && ` — ${activeStock} units`}
            </span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Add-to-Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={stockStatus.key === "out_of_stock" || isDisabled}
              className="btn-primary flex-1 py-3 text-base gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="w-5 h-5" />
              {isDisabled
                ? "Currently Unavailable"
                : stockStatus.key === "out_of_stock"
                  ? "Out of Stock"
                  : "Add to Cart"}
            </button>
            {/* Buy-Now button */}
            {stockStatus.key !== "out_of_stock" && !isDisabled && (
              <button
                onClick={handleBuyNow}
                className="btn-secondary flex-1 py-3 text-base gap-2 bg-green-600 text-white border-green-600 hover:bg-green-700"
              >
                <FiZap className="w-5 h-5" />
                Order Now
              </button>
            )}

            {/* wishlist button */}
            <button
              className="btn-secondary py-3 text-sm gap-2"
              onClick={() =>
                alert(
                  "client/app/products/[slug]/ProductDetailContent.jsx  -- function not added",
                )
              }
            >
              <FiHeart className="w-4 h-4" />
              Wishlist
            </button>
            {/* compare button */}
            <Link
              href={`/compare?ids=${product._id}`}
              className="btn-ghost py-3 text-sm gap-2"
            >
              <FiGitBranch className="w-4 h-4" />
              Compare
            </Link>
          </div>

          {/* Product Meta */}
          <div className="border-t border-surface-100 pt-5 space-y-2">
            {productId && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-surface-500 w-24">Product ID:</span>
                <span className="font-mono text-xs text-surface-700">
                  {productId}
                </span>
              </div>
            )}
            {product.sku && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-surface-500 w-24">SKU:</span>
                <span className="font-mono text-xs text-surface-700">
                  {product.sku}
                </span>
              </div>
            )}
            {category && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-surface-500 w-24">Category:</span>
                <Link
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="text-primary-600 hover:underline"
                >
                  {category}
                </Link>
              </div>
            )}
            {brand && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-surface-500 w-24">Brand:</span>
                <Link
                  href={`/products?brand=${encodeURIComponent(brand)}`}
                  className="text-primary-600 hover:underline"
                >
                  {brand}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Description */}
      {description && (
        <div className="mt-12 pt-8 border-t border-surface-100">
          <h2 className="text-xl font-bold text-surface-900 mb-5">
            Description
          </h2>
          <div
            className="prose prose-sm max-w-none text-surface-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}

      {/*---------- Related Products show */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-surface-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-surface-900">
                Related Products
              </h2>
              <p className="text-sm text-surface-500 mt-0.5">একই ধরনের পণ্য</p>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              সব দেখুন →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- New Arrivals products */}
      {newArrivals.length > 0 && (
        <div className="mt-12 pt-8 border-t border-surface-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-surface-900">
                ✨ নতুন পণ্য
              </h2>
              <p className="text-sm text-surface-500 mt-0.5">
                সম্প্রতি যোগ হয়েছে
              </p>
            </div>
            <Link
              href="/products?sortBy=createdAt&sortOrder=desc"
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              সব দেখুন →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- Bestsellers / Popular products */}
      {bestsellers.length > 0 && (
        <div className="mt-12 pt-8 border-t border-surface-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-surface-900">
                🏆 জনপ্রিয় পণ্য
              </h2>
              <p className="text-sm text-surface-500 mt-0.5">
                সবচেয়ে বেশি বিক্রি হওয়া
              </p>
            </div>
            <Link
              href="/products?sortBy=totalSold&sortOrder=desc"
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              সব দেখুন →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Back to Product /products Button */}
      <div className="mt-10 pt-6 border-t border-surface-100">
        <Link href="/products" className="btn-ghost gap-2 text-sm">
          <FiArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    </div>
  );
}
