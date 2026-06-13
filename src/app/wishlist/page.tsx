'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import ProductCard from '@/components/ecommerce/ProductCard';
import { useStore } from '@/store/useStore';
import { SEED_PRODUCTS } from '@/types';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function WishlistPage() {
  const { wishlist } = useStore();
  const wishlistedProducts = SEED_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FAFAF7]"
    >
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />

      <main className="pt-20">
        {/* Page Header */}
        <div className="border-b border-[#0F172A]/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                My Wishlist
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
                Saved Items
              </h1>
              {wishlistedProducts.length > 0 && (
                <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                  {wishlistedProducts.length} item{wishlistedProducts.length !== 1 ? 's' : ''} saved
                </p>
              )}
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {wishlistedProducts.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                <Heart className="h-10 w-10 text-[#0F172A]/20" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">Your wishlist is empty</h2>
              <p className="mt-2 max-w-sm font-sans text-sm text-[#0F172A]/50">
                Save items you love by tapping the heart icon on any product. They&apos;ll appear here so you can easily find them later.
              </p>
              <Link
                href="/catalog"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                <ShoppingBag className="h-4 w-4" />
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {wishlistedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
