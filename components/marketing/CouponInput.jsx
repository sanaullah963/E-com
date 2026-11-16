'use client';
import { useState } from 'react';
import { FiTag, FiX, FiCheck } from 'react-icons/fi';
import { useApplyCoupon } from '../../hooks/useMarketing.js';
import { formatPrice } from '../../utils/helpers.js';

/**
 * CouponInput — V6
 * Coupon code entry and validation for checkout
 */
export default function CouponInput({ cartSubtotal, items, onCouponApplied, appliedCoupon }) {
  const [code, setCode] = useState('');
  const { mutate: applyCoupon, isPending } = useApplyCoupon();

  const handleApply = () => {
    if (!code.trim()) return;
    applyCoupon(
      { code: code.trim().toUpperCase(), cartSubtotal, items },
      {
        onSuccess: (data) => {
          onCouponApplied?.(data.data);
          setCode('');
        },
      }
    );
  };

  const handleRemove = () => {
    onCouponApplied?.(null);
    setCode('');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheck className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800 font-mono">{appliedCoupon.coupon.code}</p>
            <p className="text-xs text-green-600">You save {formatPrice(appliedCoupon.discountAmount)}</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-green-600 hover:text-red-500 transition-colors"
          aria-label="Remove coupon"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Enter coupon code"
          className="input pl-9 text-sm font-mono uppercase tracking-widest"
          maxLength={20}
        />
      </div>
      <button
        onClick={handleApply}
        disabled={isPending || !code.trim()}
        className="btn-secondary text-sm whitespace-nowrap px-4 disabled:opacity-50"
      >
        {isPending ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
}
