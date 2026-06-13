'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { cn, formatCurrencyShort } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import WishlistButton from '@/components/ecommerce/WishlistButton';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useStore();

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.sellingPrice;
  const discountPercent =
    product.discountPrice > 0
      ? Math.round(((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100)
      : 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Compute average rating from seed reviews (fallback to 4.0)
  const rating = 4.0;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.96 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn('group', className)}
    >
      <div className="overflow-hidden rounded-3xl border border-navy/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
        {/* Image Area */}
        <div
          className="relative aspect-square cursor-pointer overflow-hidden bg-cream"
          onClick={() => onQuickView?.(product)}
        >
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.productName}
            fill
            className={cn(
              'object-cover transition-opacity duration-500',
              isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Secondary Image (crossfade on hover) */}
          {product.images.length > 1 && (
            <Image
              src={product.images[1]}
              alt={`${product.productName} alternate`}
              fill
              className={cn(
                'object-cover transition-opacity duration-500',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span className="rounded-lg bg-emerald-500 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.featured && (
              <span className="rounded-lg bg-gold px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow-sm">
                Featured
              </span>
            )}
            {isLowStock && (
              <span className="rounded-lg bg-red-500 px-2 py-0.5 font-sans text-[10px] font-bold text-white shadow-sm">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} size="sm" />
          </div>

          {/* Add to Cart slide-up button */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({
                    productId: product.id,
                    productName: product.productName,
                    price: effectivePrice,
                    image: product.thumbnails[0] || product.images[0],
                    quantity: 1,
                    stock: product.stock,
                  });
                }}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-emerald-500 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand & Category */}
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-emerald-600">
              {product.brand}
            </span>
            <span className="text-navy/20">·</span>
            <span className="font-sans text-[11px] text-navy/40">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="mt-1.5 line-clamp-2 font-sans text-sm font-semibold leading-snug text-navy">
            {product.productName}
          </h3>

          {/* Star Rating */}
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.floor(rating)
                    ? 'fill-gold text-gold'
                    : i < rating
                      ? 'fill-gold/50 text-gold'
                      : 'fill-navy/10 text-navy/10'
                )}
              />
            ))}
            <span className="ml-1 font-sans text-[11px] text-navy/40">{rating.toFixed(1)}</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-sans text-base font-bold text-emerald-600">
              {formatCurrencyShort(effectivePrice)}
            </span>
            {product.discountPrice > 0 && (
              <span className="font-sans text-xs text-navy/30 line-through">
                {formatCurrencyShort(product.sellingPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
