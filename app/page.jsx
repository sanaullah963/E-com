'use client';
import { Suspense } from 'react';
import HeroBannerSlider from '../components/marketing/HeroBannerSlider.jsx';
import ProductCollectionStrip from '../components/marketing/ProductCollectionStrip.jsx';
import {
  useFeaturedProducts,
  useTrendingProducts,
  useNewArrivals,
  useBestsellers,
  useActiveCampaigns,
} from '../hooks/useMarketing.js';
import Link from 'next/link';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiPhone } from 'react-icons/fi';

const features = [
  { icon: FiTruck, title: 'Fast Delivery', desc: 'Nationwide delivery to all 64 districts' },
  { icon: FiShield, title: 'Secure Payment', desc: 'Multiple secure payment options' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
  { icon: FiPhone, title: '24/7 Support', desc: 'Round-the-clock customer support' },
];

function MarketingCollections() {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts(8);
  const { data: trendingData, isLoading: trendingLoading } = useTrendingProducts(8);
  const { data: newData, isLoading: newLoading } = useNewArrivals(8);
  const { data: bestsellersData, isLoading: bestsellersLoading } = useBestsellers(8);
  const { data: campaignsData } = useActiveCampaigns();

  const featured = featuredData?.data || [];
  const trending = trendingData?.data || [];
  const newArrivals = newData?.data || [];
  const bestsellers = bestsellersData?.data || [];
  const campaigns = campaignsData?.data || [];

  return (
    <>
      {campaigns.length > 0 && (
        <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3">
          <div className="section-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔥</span>
              <div>
                <span className="font-bold text-sm">{campaigns[0].name}</span>
                {campaigns[0].daysRemaining <= 3 && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {campaigns[0].daysRemaining}d left
                  </span>
                )}
              </div>
            </div>
            <Link href={`/campaigns/${campaigns[0].slug}`} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-medium transition-colors">
              Shop Now →
            </Link>
          </div>
        </section>
      )}

      <section className="bg-white border-b border-surface-100">
        <div className="section-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-800 text-sm">{f.title}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white">
        <ProductCollectionStrip title="⭐ Featured Products" subtitle="Handpicked selections for you" products={featured} isLoading={featuredLoading} viewAllHref="/products?flag=featured" accentColor="text-blue-600" badgeColor="bg-blue-100 text-blue-700" />
      </div>
      <div className="bg-surface-50">
        <ProductCollectionStrip title="🔥 Trending Now" subtitle="What everyone is buying" products={trending} isLoading={trendingLoading} viewAllHref="/products?flag=trending" accentColor="text-red-600" badgeColor="bg-red-100 text-red-700" />
      </div>
      <div className="bg-white">
        <ProductCollectionStrip title="✨ New Arrivals" subtitle="Just landed in our store" products={newArrivals} isLoading={newLoading} viewAllHref="/products?sortBy=createdAt&sortOrder=desc" accentColor="text-purple-600" badgeColor="bg-purple-100 text-purple-700" />
      </div>
      <div className="bg-surface-50">
        <ProductCollectionStrip title="🏆 Bestsellers" subtitle="Most popular products" products={bestsellers} isLoading={bestsellersLoading} viewAllHref="/products?sortBy=totalSold&sortOrder=desc" accentColor="text-yellow-600" badgeColor="bg-yellow-100 text-yellow-700" />
      </div>

      <section className="section-container py-12 text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Explore Everything</h2>
        <p className="text-surface-500 text-sm mb-6">Browse our full catalog of thousands of products</p>
        <Link href="/products" className="btn-primary px-8 py-3 text-sm">
          View All Products <FiArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroBannerSlider />
      <Suspense fallback={<div className="py-20 text-center"><span className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin inline-block" /></div>}>
        <MarketingCollections />
      </Suspense>
    </div>
  );
}
