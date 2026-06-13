'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { STORE } from '@/types';

const ROTATING_WORDS = ['Beautiful', 'Elegant', 'Comfortable', 'Luxurious', 'Modern'];

const FLOATING_PRODUCTS = [
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', alt: 'Kitchen essentials', top: '15%', right: '8%', duration: 6 },
  { src: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80', alt: 'Bedding collection', top: '40%', right: '18%', duration: 7 },
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', alt: 'Living room decor', top: '65%', right: '5%', duration: 8 },
];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0F172A]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/15 blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Grid overlay pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating product images (desktop only) */}
      {FLOATING_PRODUCTS.map((item, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute hidden opacity-60 lg:block"
          style={{ top: item.top, right: item.right }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl shadow-2xl xl:h-56 xl:w-56">
            <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="224px" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
          </div>
        </motion.div>
      ))}

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="h-px w-10 bg-emerald-500" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              {STORE.name} &mdash; Sri Lanka&apos;s Premium Home Store
            </span>
          </motion.div>

          {/* H1 with rotating word */}
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Elevate Your{' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-emerald-400 to-[#F59E0B] bg-clip-text text-transparent"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            Living Space
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 max-w-lg font-sans text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Discover premium home essentials crafted for Sri Lankan homes.
            From kitchen to bedroom and beyond &mdash; quality you can trust,
            style you&apos;ll love.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/catalog"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-emerald-500 px-7 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Shop Collection</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/catalog?filter=featured"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 font-sans text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              View Featured
            </Link>
          </motion.div>

          {/* Trust metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/40 sm:text-base"
          >
            <span className="flex items-center gap-2 font-sans">
              <span className="font-bold text-white/80">2,400+</span> Customers
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-2 font-sans">
              <span className="font-bold text-white/80">500+</span> Products
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-2 font-sans">
              <span className="font-bold text-[#F59E0B]">4.9★</span> Rating
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/20 p-1.5">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-white/50"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
