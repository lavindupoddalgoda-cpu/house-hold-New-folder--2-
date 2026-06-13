'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrencyShort } from '@/lib/utils';
import type { Product } from '@/types';

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const { searchProducts } = useProducts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    if (searchOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [searchOpen, closeSearch]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.trim().length > 1) {
        setSearching(true);
        // Simulate a small delay for UX
        setTimeout(() => {
          const found = searchProducts(value.trim());
          setResults(found);
          setSearching(false);
        }, 150);
      } else {
        setResults([]);
        setSearching(false);
      }
    },
    [searchProducts]
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeSearch();
    }
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[58] bg-white/95 backdrop-blur-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={handleBackdropClick}
        >
          <div className="mx-auto max-w-3xl px-4 pt-24 sm:px-6">
            {/* Close Button */}
            <button
              onClick={() => closeSearch()}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Close search"
            >
              <X className="h-5 w-5 text-[#0F172A]/50" />
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute top-1/2 left-0 h-6 w-6 -translate-y-1/2 text-[#0F172A]/30" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for products, categories..."
                className="w-full border-b-2 border-[#0F172A]/10 bg-transparent py-4 pl-10 pr-4 font-display text-2xl font-semibold text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/20 focus:border-emerald-500"
              />
              {searching && (
                <Loader2 className="absolute top-1/2 right-0 h-5 w-5 -translate-y-1/2 animate-spin text-emerald-500" />
              )}
            </div>

            {/* Results */}
            <div className="mt-6 max-h-[60vh] overflow-y-auto pb-8">
              {query.trim().length > 1 && !searching && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <p className="font-sans text-[#0F172A]/40">
                    No products found for &ldquo;{query}&rdquo;
                  </p>
                </motion.div>
              )}

              {results.length > 0 && (
                <div className="space-y-2">
                  <p className="mb-3 font-sans text-xs font-medium uppercase tracking-wider text-[#0F172A]/40">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  {results.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={`/#product-${product.id}`}
                        onClick={() => closeSearch()}
                        className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-[#0F172A]/5"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#FAFAF7]">
                          <Image
                            src={product.thumbnails[0] || product.images[0]}
                            alt={product.productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sans text-sm font-semibold text-[#0F172A]">
                            {product.productName}
                          </p>
                          <p className="font-sans text-xs text-[#0F172A]/40">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          {product.discountPrice > 0 ? (
                            <div>
                              <p className="font-sans text-sm font-semibold text-emerald-600">
                                {formatCurrencyShort(product.discountPrice)}
                              </p>
                              <p className="font-sans text-xs text-[#0F172A]/30 line-through">
                                {formatCurrencyShort(product.sellingPrice)}
                              </p>
                            </div>
                          ) : (
                            <p className="font-sans text-sm font-semibold text-[#0F172A]">
                              {formatCurrencyShort(product.sellingPrice)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {query.trim().length <= 1 && (
                <div className="py-12 text-center">
                  <p className="font-sans text-[#0F172A]/30">
                    Type at least 2 characters to search
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
