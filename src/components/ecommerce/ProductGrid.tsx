'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import ProductCard from '@/components/ecommerce/ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

export default function ProductGrid({ products, onQuickView }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cream">
          <PackageOpen className="h-10 w-10 text-navy/20" />
        </div>
        <h3 className="font-sans text-lg font-semibold text-navy">No products found</h3>
        <p className="mt-2 max-w-xs font-sans text-sm text-navy/40">
          Try adjusting your filters or search terms to discover our curated home collection.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div key={product.id} layout variants={itemVariants}>
            <ProductCard product={product} onQuickView={onQuickView} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
