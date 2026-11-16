'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useTrackOrder } from '../../hooks/useOrders.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
  { key: 'processing', label: 'Processing', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
];

const CANCELLED_STATUSES = ['cancelled', 'returned'];

function StatusTimeline({ currentStatus }) {
  if (CANCELLED_STATUSES.includes(currentStatus)) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
        <FiXCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-700 capitalize">{currentStatus}</p>
          <p className="text-xs text-red-500">This order has been {currentStatus}</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="relative">
      <div className="flex justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-200">
          <div
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${isCompleted ? 'bg-primary-600 text-white' : 'bg-surface-200 text-surface-400'}
                ${isCurrent ? 'ring-4 ring-primary-200' : ''}
              `}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-xs font-medium text-center max-w-[60px] leading-tight
                ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-surface-700' : 'text-surface-400'}
              `}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackingResult({ order }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Order Header */}
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-surface-500 mb-1">Order ID</p>
            <p className="font-black text-primary-600 text-xl font-mono">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-surface-500 mb-1">Placed on</p>
            <p className="text-sm font-medium text-surface-700">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Status Timeline */}
        <StatusTimeline currentStatus={order.status} />
      </div>

      {/* Order Items */}
      <div className="card p-5">
        <h3 className="font-bold text-surface-900 mb-3 text-sm">
          Items ({order.items?.length || 0})
        </h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-surface-50 last:border-0">
              <div>
                <p className="font-medium text-surface-800 line-clamp-1">{item.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-surface-800">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing + Delivery */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-surface-900 mb-3 text-sm">Payment</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-600">Subtotal</span>
              <span>{formatPrice(order.pricing?.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-600">Delivery</span>
              <span>{formatPrice(order.pricing?.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-surface-100 pt-1.5">
              <span>Total</span>
              <span className="text-primary-600">{formatPrice(order.pricing?.total)}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-surface-500">Payment</span>
              <span className="uppercase font-medium text-surface-700">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-surface-900 mb-3 text-sm">Delivery Address</h3>
          <div className="text-sm text-surface-600 space-y-1">
            <p className="font-medium text-surface-800">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.addressLine}</p>
            <p>{order.shippingAddress?.area && `${order.shippingAddress.area}, `}{order.shippingAddress?.district}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const { mutate: trackOrderMutation, isPending, isError, error } = useTrackOrder();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      orderId: searchParams.get('orderId') || '',
      phone: '',
    },
  });

  const onSubmit = (data) => {
    trackOrderMutation(
      { orderId: data.orderId, phone: data.phone },
      { onSuccess: (res) => setOrderData(res.data) }
    );
  };

  return (
    <div className="section-container py-10 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiSearch className="w-7 h-7 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900">Track Your Order</h1>
        <p className="text-surface-500 text-sm mt-2">Enter your Order ID and phone number</p>
      </div>

      {/* Search Form */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Order ID <span className="text-red-500">*</span>
            </label>
            <input
              {...register('orderId', { required: 'Order ID is required' })}
              className="input font-mono uppercase"
              placeholder="SBD-20241201-XXXXX"
            />
            {errors.orderId && <p className="text-xs text-red-500 mt-1">{errors.orderId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone', { required: 'Phone number is required' })}
              className="input"
              placeholder="01XXXXXXXXX"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm">
            {isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </span>
            ) : (
              <>
                <FiSearch className="w-4 h-4" /> Track Order
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          {error?.message || 'Order not found. Please check your Order ID and phone number.'}
        </div>
      )}

      {/* Result */}
      {orderData && <TrackingResult order={orderData} />}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="section-container py-16 text-center"><p>Loading...</p></div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
