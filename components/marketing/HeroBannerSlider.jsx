'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useHeroBanners } from '../../hooks/useMarketing.js';
import { trackBannerClickApi } from '../../services/marketing.service.js';

/**
 * HeroBannerSlider — V6
 * Auto-sliding hero banner with navigation dots
 */
export default function HeroBannerSlider() {
  const { data, isLoading } = useHeroBanners();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const banners = data?.data || [];

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % banners.length);
  }, [banners.length]);

  const prev = () => {
    setActiveIndex((i) => (i - 1 + banners.length) % banners.length);
  };

  // Auto-slide every 5s
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused, next]);

  const handleCtaClick = async (banner) => {
    try { await trackBannerClickApi(banner._id); } catch {}
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-[16/6] bg-surface-200 animate-pulse rounded-none" />
    );
  }

  // Fallback if no banners configured
  if (banners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="section-container py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/30">
              🇧🇩 Made for Bangladesh
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Shop Smart,<br /><span className="text-primary-200">Shop Local.</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-xl">
              Discover thousands of quality products from trusted sellers across Bangladesh.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
              Shop Now →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeBanner = banners[activeIndex];

  return (
    <section
      className="relative overflow-hidden bg-surface-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Image */}
      <div className="relative w-full aspect-[16/6] min-h-[280px]">
        {banners.map((banner, i) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={banner.image.url}
              alt={banner.image.altText || banner.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="section-container">
                <div className="max-w-xl text-white">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 drop-shadow-lg">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm md:text-lg text-white/80 mb-6 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {banner.ctaLink && (
                      <Link
                        href={banner.ctaLink}
                        onClick={() => handleCtaClick(banner)}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-lg text-sm"
                      >
                        {banner.ctaText || 'Shop Now'}
                      </Link>
                    )}
                    {banner.secondaryCtaLink && (
                      <Link
                        href={banner.secondaryCtaLink}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors text-sm"
                      >
                        {banner.secondaryCtaText || 'Learn More'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
