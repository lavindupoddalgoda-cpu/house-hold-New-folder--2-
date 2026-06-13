'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SEED_PRODUCTS } from '@/types';
import ProductCard from '@/components/ecommerce/ProductCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturedProducts() {
  const featured = SEED_PRODUCTS.filter((p) => p.featured && p.isActive);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Curated for You
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
              Featured Collection
            </h2>
          </div>
          <Link
            href="/catalog?filter=featured"
            className="hidden items-center gap-1.5 font-sans text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Products grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {featured.slice(0, 8).map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/catalog?filter=featured"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-emerald-500"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
