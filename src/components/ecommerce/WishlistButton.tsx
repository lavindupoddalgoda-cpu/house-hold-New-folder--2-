'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ productId, className, size = 'md' }: WishlistButtonProps) {
  const { wishlist, addToWishlist, removeFromWishlist } = useStore();
  const isWishlisted = wishlist.includes(productId);

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const iconSize = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white',
        sizeClasses[size],
        className
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      whileTap={{ scale: 0.85 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isWishlisted ? 'filled' : 'outline'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <Heart
            className={cn(
              iconSize[size],
              'transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-navy/30 hover:text-red-400'
            )}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
