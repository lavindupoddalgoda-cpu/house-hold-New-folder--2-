'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import CheckoutForm from '@/components/ecommerce/CheckoutForm';
import OrderSummary from '@/components/ecommerce/OrderSummary';
import { useStore } from '@/store/useStore';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartCount } = useStore();
  const count = getCartCount();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/cart');
    }
  }, [cart.length, router]);

  if (cart.length === 0) {
    return null;
  }

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
                Secure Checkout
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
                Checkout
              </h1>
              <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                {count} item{count !== 1 ? 's' : ''} in your cart
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-[#0F172A]/5 bg-white p-6 sm:p-8"
              >
                <CheckoutForm />
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
                >
                  <h2 className="font-sans text-lg font-bold text-[#0F172A]">Order Summary</h2>
                  <div className="mt-5">
                    <OrderSummary />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
