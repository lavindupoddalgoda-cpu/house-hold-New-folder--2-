'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SEED_REVIEWS } from '@/types';
import { cn } from '@/lib/utils';

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;
    el.scrollLeft += 1;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
      el.scrollLeft = 0;
    }
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(autoScroll, 30);
    return () => clearInterval(interval);
  }, [autoScroll]);

  // Duplicate reviews for seamless scrolling
  const reviews = [...SEED_REVIEWS, ...SEED_REVIEWS];

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Testimonials
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Auto-scrolling carousel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={`${review.id}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="w-80 flex-shrink-0 rounded-2xl border border-[#0F172A]/5 bg-[#FAFAF7] p-6"
            >
              {/* Quote icon */}
              <Quote className="mb-3 h-6 w-6 text-emerald-200" />

              {/* Stars */}
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={cn(
                      'h-4 w-4',
                      j < review.rating
                        ? 'fill-[#F59E0B] text-[#F59E0B]'
                        : 'fill-[#0F172A]/10 text-[#0F172A]/10'
                    )}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="font-sans text-sm leading-relaxed text-[#0F172A]/70">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer info */}
              <div className="mt-4 border-t border-[#0F172A]/5 pt-4">
                <p className="font-sans text-sm font-semibold text-[#0F172A]">
                  {review.displayName}
                </p>
                <p className="font-sans text-xs text-[#0F172A]/40">
                  Verified Customer
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
