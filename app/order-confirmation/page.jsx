'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiSearch, FiHome } from 'react-icons/fi';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-500">No order ID found.</p>
        <Link href="/" className="btn-primary text-sm mt-4">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="section-container py-16 max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-surface-900 mb-2">Order Placed! 🎉</h1>
      <p className="text-surface-500 mb-8">
        Thank you for your order. We&apos;ll process it shortly.
      </p>

      {/* Order ID Card */}
      <div className="card p-6 mb-8 bg-primary-50 border border-primary-200">
        <p className="text-sm text-primary-700 font-medium mb-1">Your Order ID</p>
        <p className="text-3xl font-black text-primary-600 tracking-wider font-mono">
          {orderId}
        </p>
        <p className="text-xs text-primary-600 mt-2 opacity-75">
          Save this ID to track your order
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiPackage className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-surface-800 text-sm">What&apos;s Next?</h3>
          </div>
          <ul className="text-xs text-surface-600 space-y-1.5">
            <li>• Our team will confirm your order</li>
            <li>• Delivery within 3-5 business days</li>
            <li>• Cash on delivery at your doorstep</li>
          </ul>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiSearch className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-surface-800 text-sm">Track Your Order</h3>
          </div>
          <p className="text-xs text-surface-600 mb-3">
            Use your Order ID and phone number to track delivery status anytime.
          </p>
          <Link
            href={`/order-tracking?orderId=${orderId}`}
            className="text-xs text-primary-600 font-semibold hover:underline"
          >
            Track Order →
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/order-tracking?orderId=${orderId}`}
          className="btn-primary text-sm px-6"
        >
          <FiSearch className="w-4 h-4" />
          Track Order
        </Link>
        <Link href="/products" className="btn-secondary text-sm px-6">
          <FiHome className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="section-container py-16 text-center"><p>Loading...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
