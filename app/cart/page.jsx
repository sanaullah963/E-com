'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import useCartStore, { lineKey } from '../../store/cartStore.js';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers.js';

export default function CartPage() {
  const { items, removeItem, incrementQuantity, decrementQuantity, getSubtotal, getItemCount } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="section-container py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-surface-800 mb-3">Your cart is empty</h1>
        <p className="text-surface-500 mb-8">Add some products to get started!</p>
        <Link href="/products" className="btn-primary text-sm px-6">
          <FiShoppingBag className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">
        Shopping Cart
        <span className="ml-2 text-base font-normal text-surface-500">({itemCount} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={lineKey(item)} className="card p-4 flex gap-4">
              {/* Image */}
              <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-50">
                  <Image
                    src={item.thumbnailUrl || getPlaceholderImage(item.name)}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-medium text-surface-800 text-sm line-clamp-2 hover:text-primary-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                {item.variantLabel && (
                  <p className="text-xs text-surface-500 mt-0.5">{item.variantLabel}</p>
                )}
                {item.brand && (
                  <p className="text-xs text-surface-400 mt-0.5">{item.brand}</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementQuantity(lineKey(item))}
                      className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-50 transition-colors"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-surface-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(lineKey(item))}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center text-surface-600 hover:bg-surface-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                    {item.quantity >= item.stock && (
                      <span className="text-xs text-amber-600 font-medium">Max stock</span>
                    )}
                  </div>

                  {/* Price + Delete */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-surface-900 text-sm">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                      {item.salePrice && (
                        <p className="text-xs text-surface-400">
                          {formatPrice(item.unitPrice)} each
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(lineKey(item))}
                      className="w-8 h-8 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      aria-label="Remove item"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-bold text-surface-900 mb-4">Order Summary</h2>

            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-surface-600">Subtotal ({itemCount} items)</span>
                <span className="font-medium text-surface-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-600">Delivery charge</span>
                <span className="text-surface-500 text-xs">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-surface-100 pt-3 mb-5">
              <div className="flex justify-between">
                <span className="font-semibold text-surface-800">Subtotal</span>
                <span className="font-bold text-primary-600 text-lg">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full py-3 text-sm justify-center">
              Proceed to Checkout
              <FiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products"
              className="block text-center text-sm text-surface-500 hover:text-primary-600 mt-3 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
