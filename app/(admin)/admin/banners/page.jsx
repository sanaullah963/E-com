'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { FiPlus, FiTrash2, FiUpload, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAdminBanners, useCreateBanner, useDeleteBanner } from '@/hooks/useMarketing.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBannerApi } from '@/services/marketing.service.js';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers.js';

const PLACEMENTS = ['hero', 'promotional', 'sidebar', 'popup', 'category_top'];

export default function AdminBannersPage() {
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useAdminBanners({});
  const { mutate: createBanner, isPending: creating } = useCreateBanner();
  const { mutate: deleteBanner } = useDeleteBanner();

  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, isActive }) => updateBannerApi(id, JSON.stringify({ isActive })),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Banner updated.'); },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { placement: 'hero', sortOrder: 0 },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = (formData) => {
    if (!imageFile) { toast.error('Please select a banner image'); return; }
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => { if (v) fd.append(k, v); });
    fd.append('images', imageFile);

    createBanner(fd, {
      onSuccess: () => { reset(); setImageFile(null); setImagePreview(''); setShowForm(false); },
    });
  };

  const banners = data?.data || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm gap-1.5">
          <FiPlus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card p-5 mb-6 border-2 border-primary-200 bg-primary-50/20">
          <h2 className="font-bold text-surface-900 mb-4">New Banner</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input {...register('title', { required: true })} className="input" placeholder="Banner title" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Subtitle</label>
                <input {...register('subtitle')} className="input" placeholder="Optional subtitle text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">CTA Text</label>
                <input {...register('ctaText')} className="input" placeholder="e.g. Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">CTA Link</label>
                <input {...register('ctaLink')} className="input" placeholder="/products" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Placement</label>
                <select {...register('placement')} className="input">
                  {PLACEMENTS.map((p) => <option key={p} value={p} className="capitalize">{p.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Sort Order</label>
                <input {...register('sortOrder')} type="number" className="input" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Start Date</label>
                <input {...register('startDate')} type="datetime-local" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">End Date</label>
                <input {...register('endDate')} type="datetime-local" className="input" />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Banner Image <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-surface-100">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer btn-secondary text-sm">
                  <FiUpload className="w-4 h-4" /> Choose Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-surface-400 mt-1">Recommended: 1920×600px. Max 5MB.</p>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={creating} className="btn-primary text-sm">
                {creating ? 'Creating...' : 'Create Banner'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); reset(); setImageFile(null); setImagePreview(''); }} className="btn-ghost text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-surface-100" />)
        ) : banners.length === 0 ? (
          <div className="card p-12 text-center text-surface-400">No banners yet.</div>
        ) : banners.map((banner) => (
          <div key={banner._id} className="card p-4 flex items-center gap-4">
            <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
              <Image src={banner.image.url} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-surface-800 truncate">{banner.title}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full capitalize">{banner.placement?.replace('_', ' ')}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-surface-500'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
                {banner.endDate && <span className="text-xs text-surface-400">Ends: {formatDate(banner.endDate)}</span>}
                <span className="text-xs text-surface-400">{banner.clickCount || 0} clicks</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive({ id: banner._id, isActive: !banner.isActive })}
                className="w-8 h-8 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                title={banner.isActive ? 'Deactivate' : 'Activate'}
              >
                {banner.isActive ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { if (confirm('Delete this banner?')) deleteBanner(banner._id); }}
                className="w-8 h-8 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-red-600 hover:border-red-300 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
