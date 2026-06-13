'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomTransform, setZoomTransform] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile || !imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomTransform({ x, y });
    },
    [isMobile]
  );

  // Touch swipe for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-cream">
        <p className="font-sans text-sm text-navy/30">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Primary Image */}
      <div
        ref={imageRef}
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-cream"
        onMouseEnter={() => !isMobile && setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`${productName} - Image ${activeIndex + 1}`}
              fill
              className={cn(
                'object-cover transition-transform duration-200',
                isZooming && !isMobile ? 'scale-[2]' : 'scale-100'
              )}
              style={
                isZooming && !isMobile
                  ? { transformOrigin: `${zoomTransform.x}% ${zoomTransform.y}%` }
                  : undefined
              }
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator (desktop) */}
        {!isMobile && !isZooming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 font-sans text-[11px] text-navy/50 backdrop-blur-sm"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            Hover to zoom
          </motion.div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-navy/50 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-emerald-600"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-navy/50 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-emerald-600"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-navy/60 px-3 py-1 font-sans text-[11px] text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:w-20',
                i === activeIndex
                  ? 'border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
