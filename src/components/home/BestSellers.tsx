'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { SEED_PRODUCTS } from '@/types';
import ProductCard from '@/components/ecommerce/ProductCard';

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  // Use all active products sorted by stock (simulate "best sellers")
  const bestSellers = [...SEED_PRODUCTS]
    .filter((p) => p.isActive)
    .sort((a, b) => a.stock - b.stock) // lower stock = more sold
    .slice(0, 10);

  return (
    <section className="bg-[#FAFAF7] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
              Best Sellers
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B]/10 px-3 py-1 font-sans text-xs font-semibold text-[#F59E0B]">
              <TrendingUp className="h-3 w-3" />
              This Week
            </span>
          </div>

          {/* Arrow buttons (desktop only) */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F172A]/10 text-[#0F172A]/40 transition-all hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-30 disabled:hover:border-[#0F172A]/10 disabled:hover:text-[#0F172A]/40"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F172A]/10 text-[#0F172A]/40 transition-all hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-30 disabled:hover:border-[#0F172A]/10 disabled:hover:text-[#0F172A]/40"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal scroll carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="w-72 flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
