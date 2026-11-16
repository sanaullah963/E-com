'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import { getPlaceholderImage } from '../../utils/helpers.js';

/**
 * ProductImageGallery
 * Displays main image with thumbnail navigation
 * Extensible for video support (Version 5)
 */
export default function ProductImageGallery({ images = [], productName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const allImages = images.length > 0
    ? images
    : [{ url: getPlaceholderImage(productName), altText: productName, _id: 'placeholder' }];

  const activeImage = allImages[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-surface-50 cursor-zoom-in group"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={activeImage.url || getPlaceholderImage(productName)}
          alt={activeImage.altText || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-125' : 'group-hover:scale-105'}`}
        />

        {/* Zoom Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <FiZoomIn className="w-4 h-4 text-surface-600" />
          </div>
        </div>

        {/* Navigation Arrows (only if multiple images) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-5 h-5 text-surface-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FiChevronRight className="w-5 h-5 text-surface-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails (only if multiple images) */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((image, index) => (
            <button
              key={image._id || index}
              onClick={() => setActiveIndex(index)}
              className={`
                relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                ${activeIndex === index
                  ? 'border-primary-500 shadow-md'
                  : 'border-surface-200 hover:border-surface-300 opacity-60 hover:opacity-100'
                }
              `}
            >
              <Image
                src={image.url || getPlaceholderImage()}
                alt={image.altText || `${productName} image ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
