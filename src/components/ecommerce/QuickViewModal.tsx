'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { cn, formatCurrencyShort } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const { addToCart, addToast } = useStore();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.sellingPrice;
  const discountPercent =
    product.discountPrice > 0
      ? Math.round(((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100)
      : 0;

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    const variant = Object.keys(selectedVariants).length > 0
      ? { type: Object.keys(selectedVariants)[0], value: Object.values(selectedVariants)[0] }
      : undefined;

    addToCart({
      productId: product.id,
      productName: product.productName,
      price: effectivePrice,
      image: product.thumbnails[0] || product.images[0],
      quantity,
      stock: product.stock,
      variant,
    });

    setAdded(true);
    addToast({ message: `${product.productName} added to cart`, type: 'success' });
    setTimeout(() => setAdded(false), 2000);
  };

  const resetAndClose = () => {
    setSelectedVariants({});
    setQuantity(1);
    setActiveImage(0);
    setAdded(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-navy/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 z-[61] flex items-center justify-center sm:inset-8 md:inset-12 lg:inset-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="relative flex max-h-full w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* Close button */}
              <button
                onClick={resetAndClose}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-navy"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image Section */}
              <div className="hidden w-1/2 bg-cream md:block">
                <div className="relative aspect-square h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={product.images[activeImage] || product.images[0]}
                        alt={product.productName}
                        fill
                        className="object-cover"
                        sizes="50vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {product.images.slice(0, 4).map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            'relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all',
                            i === activeImage
                              ? 'border-emerald-500'
                              : 'border-white/60 opacity-60 hover:opacity-100'
                          )}
                        >
                          <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex max-h-full w-full flex-col overflow-y-auto md:w-1/2">
                <div className="p-6 sm:p-8">
                  {/* Mobile image */}
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-cream md:hidden">
                    <Image
                      src={product.images[activeImage] || product.images[0]}
                      alt={product.productName}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {product.images.slice(0, 4).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full transition-colors',
                              i === activeImage ? 'bg-emerald-500' : 'bg-navy/20'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category & Brand */}
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-emerald-600">
                      {product.brand}
                    </span>
                    <span className="text-navy/20">·</span>
                    <span className="font-sans text-[11px] text-navy/40">{product.category}</span>
                  </div>

                  {/* Name */}
                  <h2 className="mt-2 font-sans text-xl font-bold text-navy sm:text-2xl">
                    {product.productName}
                  </h2>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < 4 ? 'fill-gold text-gold' : 'fill-navy/10 text-navy/10'
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-sans text-xs text-navy/40">4.0</span>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-sans text-2xl font-bold text-emerald-600">
                      {formatCurrencyShort(effectivePrice)}
                    </span>
                    {product.discountPrice > 0 && (
                      <>
                        <span className="font-sans text-sm text-navy/30 line-through">
                          {formatCurrencyShort(product.sellingPrice)}
                        </span>
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-sans text-[10px] font-bold text-emerald-700">
                          -{discountPercent}%
                        </span>
                      </>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Description */}
                  <p className="font-sans text-sm leading-relaxed text-navy/60">
                    {product.shortDescription}
                  </p>

                  {/* Variants */}
                  {product.variants.length > 0 && (
                    <div className="mt-5 space-y-4">
                      {product.variants.map((variant) => (
                        <div key={variant.type}>
                          <label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
                            {variant.type}
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {variant.values.map((val) => (
                              <button
                                key={val}
                                onClick={() => handleVariantSelect(variant.type, val)}
                                className={cn(
                                  'rounded-xl border px-3 py-1.5 font-sans text-sm transition-all',
                                  selectedVariants[variant.type] === val
                                    ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-700'
                                    : 'border-navy/10 text-navy/60 hover:border-emerald-300'
                                )}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity & Add to Cart */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
                        Quantity
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy/10 text-navy/50 transition-colors hover:bg-cream"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-sans text-sm font-semibold text-navy">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy/10 text-navy/50 transition-colors hover:bg-cream disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-sans text-[11px] text-navy/30">
                        {product.stock} in stock
                      </span>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || added}
                      className={cn(
                        'w-full gap-2 rounded-xl py-3 font-sans text-sm font-semibold transition-all',
                        added
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      )}
                    >
                      {added ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart — {formatCurrencyShort(effectivePrice * quantity)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
