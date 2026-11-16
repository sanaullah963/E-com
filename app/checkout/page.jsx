'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiTruck, FiPhone, FiMapPin, FiUser, FiMail } from 'react-icons/fi';
import useCartStore, { lineKey } from '../../store/cartStore.js';
import CouponInput from '../../components/marketing/CouponInput.jsx';
import { useDistricts, useDeliveryCharge, usePlaceOrder } from '../../hooks/useOrders.js';
import { formatPrice, getPlaceholderImage } from '../../utils/helpers.js';

// Idempotency key (UUID; পুরোনো/অনিরাপদ কনটেক্সটে fallback)
const newIdempotencyKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `k${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`.slice(0, 40).padEnd(16, 'x');

// Zod validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^(\+880|880|0)?1[3-9]\d{8}$/, 'Enter a valid Bangladesh phone number (e.g. 01XXXXXXXXX)'),
  altPhone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  addressLine: z.string().min(5, 'Address must be at least 5 characters').max(300),
  area: z.string().optional(),
  district: z.string().min(1, 'Please select your district'),
  zipCode: z.string().optional(),
  deliveryNote: z.string().max(300).optional(),
  customerNote: z.string().max(500).optional(),
  paymentMethod: z.enum(['cod']),
});

export default function CheckoutPage() {
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { data: districtsData } = useDistricts();
  const { mutate: placeOrderMutation, isPending } = usePlaceOrder();
  // একই payload-এর পুনঃসাবমিটে একই Idempotency-Key; payload বদলালে নতুন key
  const idemRef = useRef({ fingerprint: '', key: '' });
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const { data: deliveryData } = useDeliveryCharge(selectedDistrict);
  const deliveryCharge = deliveryData?.data?.deliveryCharge || 0;

  const districts = districtsData?.data?.districts || [];
  const subtotal = getSubtotal();
  const discount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + deliveryCharge - discount;
  const itemCount = getItemCount();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cod' },
  });

  const watchedDistrict = watch('district');
  useEffect(() => {
    if (watchedDistrict) setSelectedDistrict(watchedDistrict);
  }, [watchedDistrict]);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="section-container py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-surface-800 mb-4">Your cart is empty</h2>
        <Link href="/products" className="btn-primary text-sm">Browse Products</Link>
      </div>
    );
  }

  const onSubmit = (formData) => {
    const orderPayload = {
      items: items.map((item) => ({
        productId: item.productId,
        ...(item.variantId ? { variantId: item.variantId } : {}),
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        altPhone: formData.altPhone || '',
        addressLine: formData.addressLine,
        area: formData.area || '',
        district: formData.district,
        zipCode: formData.zipCode || '',
        deliveryNote: formData.deliveryNote || '',
      },
      paymentMethod: formData.paymentMethod,
      customerNote: formData.customerNote || '',
      guestEmail: formData.email || '',
      couponCode: appliedCoupon?.coupon?.code || '',
    };

    const fingerprint = JSON.stringify(orderPayload);
    if (idemRef.current.fingerprint !== fingerprint) {
      idemRef.current = { fingerprint, key: newIdempotencyKey() };
    }
    placeOrderMutation({ payload: orderPayload, idempotencyKey: idemRef.current.key });
  };

  return (
    <div className="section-container py-8">
      {/* Back */}
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 mb-6 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-surface-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact Info */}
            <div className="card p-5">
              <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-primary-600" />
                Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input {...register('fullName')} className="input" placeholder="আপনার পূর্ণ নাম" />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input {...register('phone')} className="input" placeholder="01XXXXXXXXX" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Alternate Phone
                  </label>
                  <input {...register('altPhone')} className="input" placeholder="01XXXXXXXXX (optional)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Email <span className="text-surface-400 text-xs">(optional)</span>
                  </label>
                  <input {...register('email')} type="email" className="input" placeholder="email@example.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-5">
              <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-primary-600" />
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select {...register('district')} className="input">
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.division})
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>}
                  {selectedDistrict && deliveryCharge > 0 && (
                    <p className="text-xs text-green-700 mt-1 font-medium">
                      ✅ Delivery charge: {formatPrice(deliveryCharge)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('addressLine')}
                    className="input min-h-[80px] resize-none"
                    placeholder="House no, Road, Area..."
                  />
                  {errors.addressLine && <p className="text-xs text-red-500 mt-1">{errors.addressLine.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Area / Thana</label>
                    <input {...register('area')} className="input" placeholder="e.g. Mirpur, Dhanmondi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">ZIP Code</label>
                    <input {...register('zipCode')} className="input" placeholder="e.g. 1216" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Delivery Note</label>
                  <input
                    {...register('deliveryNote')}
                    className="input"
                    placeholder="e.g. Call before delivery"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-5">
              <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-primary-600" />
                Payment Method
              </h2>
              <label className="flex items-center gap-3 p-3 border-2 border-primary-500 rounded-xl bg-primary-50 cursor-pointer">
                <input
                  type="radio"
                  value="cod"
                  {...register('paymentMethod')}
                  defaultChecked
                  className="text-primary-600"
                />
                <div>
                  <p className="font-semibold text-surface-800 text-sm">Cash on Delivery (COD)</p>
                  <p className="text-xs text-surface-500 mt-0.5">Pay when you receive your order</p>
                </div>
                <span className="ml-auto text-2xl">💵</span>
              </label>
              <p className="text-xs text-surface-400 mt-2 text-center">
                bKash, Nagad & card payment coming soon
              </p>
            </div>

            {/* Order Note */}
            <div className="card p-5">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Order Note <span className="text-surface-400 text-xs">(optional)</span>
              </label>
              <textarea
                {...register('customerNote')}
                className="input min-h-[70px] resize-none"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-20">
              <h2 className="font-bold text-surface-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={lineKey(item)} className="flex gap-2.5">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-surface-50">
                      <Image
                        src={item.thumbnailUrl || getPlaceholderImage(item.name)}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-800 line-clamp-2">{item.name}</p>
                      {item.variantLabel && <p className="text-xs text-surface-500">{item.variantLabel}</p>}
                      <p className="text-xs text-primary-600 font-semibold mt-0.5">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              {/* V6: Coupon Input */}
              <div className="border-t border-surface-100 pt-3 mb-3">
                <p className="text-xs font-semibold text-surface-600 uppercase tracking-wide mb-2">Coupon Code</p>
                <CouponInput
                  cartSubtotal={subtotal}
                  items={items.map((i) => ({ productId: i.productId, ...(i.variantId ? { variantId: i.variantId } : {}), quantity: i.quantity }))}
                  appliedCoupon={appliedCoupon}
                  onCouponApplied={setAppliedCoupon}
                />
              </div>
              <div className="border-t border-surface-100 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Delivery</span>
                  <span className={`font-medium ${deliveryCharge > 0 ? 'text-surface-800' : 'text-surface-400'}`}>
                    {selectedDistrict ? formatPrice(deliveryCharge) : 'Select district'}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-surface-100 pt-2">
                  <span className="text-surface-800">Total</span>
                  <span className="text-primary-600 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !selectedDistrict}
                className="btn-primary w-full py-3 text-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  `Place Order — ${formatPrice(total)}`
                )}
              </button>

              <p className="text-xs text-surface-400 text-center mt-3">
                By placing order, you agree to our terms & conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
