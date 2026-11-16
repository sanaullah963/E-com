'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiTrash2, FiX, FiCheck, FiClock, FiZap } from 'react-icons/fi';
import { useAdminCampaigns, useCreateCampaign, useDeleteCampaign } from '@/hooks/useMarketing.js';
import { formatDate } from '@/utils/helpers.js';

const CAMPAIGN_TYPES = ['flash_sale', 'seasonal', 'clearance', 'new_arrival', 'featured', 'custom'];

const TYPE_COLORS = {
  flash_sale: 'bg-red-100 text-red-700',
  seasonal: 'bg-green-100 text-green-700',
  clearance: 'bg-orange-100 text-orange-700',
  new_arrival: 'bg-blue-100 text-blue-700',
  featured: 'bg-purple-100 text-purple-700',
  custom: 'bg-surface-100 text-surface-600',
};

export default function AdminCampaignsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useAdminCampaigns({ limit: 50 });
  const { mutate: createCampaign, isPending: creating } = useCreateCampaign();
  const { mutate: deleteCampaign } = useDeleteCampaign();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { type: 'custom', isActive: true },
  });

  const campaigns = data?.data || [];

  const onSubmit = (formData) => {
    createCampaign(formData, {
      onSuccess: () => { reset(); setShowForm(false); },
    });
  };

  const getStatus = (campaign) => {
    const now = new Date();
    if (!campaign.isActive) return { label: 'Inactive', color: 'bg-surface-100 text-surface-500' };
    if (new Date(campaign.endDate) < now) return { label: 'Expired', color: 'bg-red-100 text-red-600' };
    if (new Date(campaign.startDate) > now) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Live', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Campaigns</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm gap-1.5">
          <FiPlus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 mb-6 border-2 border-primary-200 bg-primary-50/20">
          <h2 className="font-bold text-surface-900 mb-4">New Campaign</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Campaign Name <span className="text-red-500">*</span></label>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="e.g. Eid Sale 2025" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Type</label>
              <select {...register('type')} className="input">
                {CAMPAIGN_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Badge Text</label>
              <input {...register('badgeText')} className="input" placeholder="e.g. UP TO 50% OFF" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
              <input {...register('startDate', { required: 'Start date is required' })} type="datetime-local" className="input" />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
              <input {...register('endDate', { required: 'End date is required' })} type="datetime-local" className="input" />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
              <textarea {...register('description')} className="input min-h-[70px] resize-none" placeholder="Campaign description..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Target Categories (comma-separated)</label>
              <input {...register('targetCategories')} className="input" placeholder="Electronics, Fashion, Home" />
              <p className="text-xs text-surface-400 mt-1">Leave empty to target specific products (add after creation)</p>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={creating} className="btn-primary text-sm gap-1.5">
                <FiCheck className="w-4 h-4" /> {creating ? 'Creating...' : 'Create Campaign'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-ghost text-sm gap-1.5">
                <FiX className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 border-b border-surface-100">
            <tr>
              {['Campaign', 'Type', 'Schedule', 'Products', 'Views', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-surface-100 rounded animate-pulse" /></td></tr>)
            ) : campaigns.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-surface-400">No campaigns yet</td></tr>
            ) : campaigns.map((campaign) => {
              const status = getStatus(campaign);
              return (
                <tr key={campaign._id} className="hover:bg-surface-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-surface-800">{campaign.name}</p>
                    {campaign.badgeText && <p className="text-xs text-primary-600 font-medium mt-0.5">{campaign.badgeText}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[campaign.type] || 'bg-surface-100 text-surface-500'}`}>
                      {campaign.type?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-surface-500">
                    <div className="flex items-center gap-1 mb-0.5"><FiClock className="w-3 h-3" />{formatDate(campaign.startDate)}</div>
                    <div>→ {formatDate(campaign.endDate)}</div>
                  </td>
                  <td className="px-4 py-3 text-surface-600">{campaign.products?.length || 0}</td>
                  <td className="px-4 py-3 text-surface-600">{campaign.viewCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${status.color}`}>
                      {status.label === 'Live' && <FiZap className="w-3 h-3" />}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { if (confirm(`Delete "${campaign.name}"?`)) deleteCampaign(campaign._id); }}
                      className="w-7 h-7 border border-surface-200 rounded-lg flex items-center justify-center text-surface-500 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
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
