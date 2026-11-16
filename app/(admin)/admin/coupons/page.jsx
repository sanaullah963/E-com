'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiTag } from 'react-icons/fi';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useMarketing.js';
import { formatDate, formatPrice } from '@/utils/helpers.js';

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useAdminCoupons({ limit: 50 });
  const { mutate: createCoupon, isPending: creating } = useCreateCoupon();
  const { mutate: updateCoupon, isPending: updating } = useUpdateCoupon();
  const { mutate: deleteCoupon } = useDeleteCoupon();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { discountType: 'percentage', minimumOrderAmount: 0, usageLimitPerUser: 1 },
  });

  const coupons = data?.data || [];

  const startEdit = (coupon) => {
    setEditing(coupon);
    Object.entries(coupon).forEach(([k, v]) => {
      if (['code', 'description', 'discountType', 'discountValue', 'maxDiscountAmount', 'minimumOrderAmount', 'usageLimit', 'usageLimitPerUser'].includes(k)) {
        setValue(k, v);
      }
    });
    if (coupon.expiryDate) setValue('expiryDate', new Date(coupon.expiryDate).toISOString().slice(0, 16));
    setShowForm(true);
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minimumOrderAmount: parseFloat(formData.minimumOrderAmount || 0),
      usageLimitPerUser: parseInt(formData.usageLimitPerUser || 1),
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
    };

    if (editing) {
      updateCoupon({ id: editing._id, data: payload }, {
        onSuccess: () => { reset(); setEditing(null); setShowForm(false); },
      });
    } else {
      createCoupon(payload, {
        onSuccess: () => { reset(); setShowForm(false); },
      });
    }
  };

  const STATUS_COLORS = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-red-100 text-red-600',
    inactive: 'bg-surface-100 text-surface-500',
    limit_reached: 'bg-orange-100 text-orange-600',
  };

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return 'inactive';
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return 'expired';
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return 'limit_reached';
    return 'active';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Coupons</h1>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); reset(); }} className="btn-primary text-sm gap-1.5">
          <FiPlus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 mb-6 border-2 border-primary-200 bg-primary-50/20">
          <h2 className="font-bold text-surface-900 mb-4">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Code <span className="text-red-500">*</span></label>
              <input {...register('code', { required: true })} className="input font-mono uppercase" placeholder="SAVE20" disabled={!!editing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Discount Type <span className="text-red-500">*</span></label>
              <select {...register('discountType')} className="input">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Discount Value <span className="text-red-500">*</span></label>
              <input {...register('discountValue', { required: true, min: 0 })} type="number" min="0" step="0.01" className="input" placeholder="e.g. 20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Max Discount (৳)</label>
              <input {...register('maxDiscountAmount')} type="number" min="0" className="input" placeholder="Cap for % coupons" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Min Order (৳)</label>
              <input {...register('minimumOrderAmount')} type="number" min="0" className="input" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Total Usage Limit</label>
              <input {...register('usageLimit')} type="number" min="1" className="input" placeholder="Unlimited if empty" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Per User Limit</label>
              <input {...register('usageLimitPerUser')} type="number" min="1" className="input" placeholder="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Expiry Date</label>
              <input {...register('expiryDate')} type="datetime-local" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
              <input {...register('description')} className="input" placeholder="Optional description" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
              <button type="submit" disabled={creating || updating} className="btn-primary text-sm gap-1.5">
                <FiCheck className="w-4 h-4" /> {editing ? 'Update' : 'Create'} Coupon
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="btn-ghost text-sm gap-1.5">
                <FiX className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              {['Code', 'Discount', 'Min Order', 'Usage', 'Expiry', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {isLoading ? (
              [...Array(4)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-surface-100 rounded animate-pulse" /></td></tr>)
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-surface-400">No coupons yet</td></tr>
            ) : coupons.map((coupon) => {
              const status = getCouponStatus(coupon);
              return (
                <tr key={coupon._id} className="hover:bg-surface-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FiTag className="w-3.5 h-3.5 text-primary-500" />
                      <span className="font-mono font-bold text-primary-700 text-sm">{coupon.code}</span>
                    </div>
                    {coupon.description && <p className="text-xs text-surface-400 mt-0.5">{coupon.description}</p>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-surface-800">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                    {coupon.maxDiscountAmount && <span className="text-xs text-surface-400 ml-1">(max {formatPrice(coupon.maxDiscountAmount)})</span>}
                  </td>
                  <td className="px-4 py-3 text-surface-600">{coupon.minimumOrderAmount > 0 ? formatPrice(coupon.minimumOrderAmount) : '—'}</td>
                  <td className="px-4 py-3 text-surface-600">
                    {coupon.usageCount}/{coupon.usageLimit || '∞'}
                    <span className="text-xs text-surface-400 block">per user: {coupon.usageLimitPerUser}</span>
                  </td>
                  <td className="px-4 py-3 text-surface-500 text-xs">
                    {coupon.expiryDate ? formatDate(coupon.expiryDate) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[status]}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(coupon)} className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm(`Delete coupon "${coupon.code}"?`)) deleteCoupon(coupon._id); }} className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-red-600 hover:border-red-300 transition-colors">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
