'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag } from 'react-icons/fi';
import { useCampaign } from '@/hooks/useMarketing.js';
import ProductCard from '@/components/product/ProductCard.jsx';
import { formatPrice, getPlaceholderImage } from '@/utils/helpers.js';

export default function CampaignPage() {
  const { slug } = useParams();
  const { data, isLoading } = useCampaign(slug);

  if (isLoading) {
    return (
      <div className="section-container py-8 animate-pulse">
        <div className="h-48 bg-surface-200 rounded-2xl mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-surface-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const campaign = data?.data?.campaign;
  const products = data?.data?.products || [];

  if (!campaign) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-surface-800 mb-4">Campaign not found</h2>
        <Link href="/" className="btn-primary text-sm">Go Home</Link>
      </div>
    );
  }

  const isLive = campaign.isLive;
  const isUpcoming = campaign.isUpcoming;
  const isExpired = campaign.isExpired;

  return (
    <div>
      {/* Campaign Header */}
      <div className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white overflow-hidden">
        {campaign.bannerImage?.url && (
          <div className="absolute inset-0">
            <Image src={campaign.bannerImage.url} alt={campaign.name} fill className="object-cover opacity-20" />
          </div>
        )}
        <div className="relative section-container py-12">
          <div className="max-w-2xl">
            {isLive && (
              <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE NOW
              </span>
            )}
            {isUpcoming && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                <FiClock className="w-3 h-3" /> UPCOMING
              </span>
            )}
            {isExpired && (
              <span className="inline-block bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">ENDED</span>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{campaign.name}</h1>
            {campaign.description && <p className="text-primary-100 text-sm leading-relaxed mb-4">{campaign.description}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {isLive && campaign.daysRemaining > 0 && (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <FiClock className="w-4 h-4" />
                  <span>{campaign.daysRemaining} days remaining</span>
                </div>
              )}
              {campaign.couponId && (
                <div className="flex items-center gap-1.5 bg-yellow-400/20 border border-yellow-400/40 px-3 py-1.5 rounded-full">
                  <FiTag className="w-4 h-4 text-yellow-300" />
                  <span className="font-mono font-bold text-yellow-200">{campaign.couponId.code}</span>
                  <span className="text-yellow-200 text-xs">
                    — {campaign.couponId.discountType === 'percentage'
                      ? `${campaign.couponId.discountValue}% off`
                      : `৳${campaign.couponId.discountValue} off`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="section-container py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-surface-500">No products in this campaign yet.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-surface-500 mb-5">{products.length} products in this campaign</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
