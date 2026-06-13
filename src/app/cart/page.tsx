'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import OrderSummary from '@/components/ecommerce/OrderSummary';
import { useStore } from '@/store/useStore';
import { formatCurrencyShort } from '@/lib/utils';
import { STORE } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const MOCK_COUPONS: Record<string, { type: 'percentage' | 'fixed'; value: number; minOrderValue: number }> = {
  WELCOME10: { type: 'percentage', value: 10, minOrderValue: 2000 },
  SAVE500: { type: 'fixed', value: 500, minOrderValue: 3000 },
  HOMENEST15: { type: 'percentage', value: 15, minOrderValue: 5000 },
};

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const subtotal = getCartTotal();
  const count = getCartCount();

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess(false);

    if (!code) {
      setCouponError('Enter a coupon code');
      return;
    }

    const coupon = MOCK_COUPONS[code];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (subtotal < coupon.minOrderValue) {
      setCouponError(`Minimum order ${formatCurrencyShort(coupon.minOrderValue)} required`);
      return;
    }

    applyCoupon({ code, type: coupon.type, value: coupon.value });
    setCouponSuccess(true);
    setCouponInput('');
    setTimeout(() => setCouponSuccess(false), 2000);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponError('');
    setCouponSuccess(false);
  };

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
                Your Cart
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
                Shopping Cart
              </h1>
              {cart.length > 0 && (
                <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                  {count} item{count !== 1 ? 's' : ''} in your cart
                </p>
              )}
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                <ShoppingBag className="h-10 w-10 text-[#0F172A]/20" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">Your cart is empty</h2>
              <p className="mt-2 max-w-sm font-sans text-sm text-[#0F172A]/50">
                Looks like you haven&apos;t added any items to your cart yet. Start exploring our curated home collection.
              </p>
              <Link
                href="/catalog"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variant?.value || ''}`}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden rounded-2xl border border-[#0F172A]/5 bg-white p-4 sm:p-5"
                      >
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <Link href={`/product/${item.productId}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FAFAF7] sm:h-28 sm:w-28">
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/product/${item.productId}`}
                                  className="truncate font-sans text-sm font-semibold text-[#0F172A] transition-colors hover:text-emerald-600 sm:text-base"
                                >
                                  {item.productName}
                                </Link>
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#0F172A]/20 transition-colors hover:bg-red-50 hover:text-red-500"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              {item.variant && (
                                <p className="mt-0.5 font-sans text-xs text-[#0F172A]/40">
                                  {item.variant.type}: {item.variant.value}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Price */}
                              <span className="font-sans text-base font-bold text-emerald-600 sm:text-lg">
                                {formatCurrencyShort(item.price * item.quantity)}
                              </span>

                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0F172A]/10 transition-colors hover:bg-[#FAFAF7]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5 text-[#0F172A]/50" />
                                </button>
                                <span className="w-8 text-center font-sans text-sm font-semibold text-[#0F172A]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0F172A]/10 transition-colors hover:bg-[#FAFAF7] disabled:opacity-30"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5 text-[#0F172A]/50" />
                                </button>
                              </div>
                            </div>

                            <p className="mt-1 font-sans text-[11px] text-[#0F172A]/30">
                              {formatCurrencyShort(item.price)} each
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Coupon Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 rounded-2xl border border-[#0F172A]/5 bg-white p-5"
                >
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0F172A]/50">
                    Coupon Code
                  </label>
                  {appliedCoupon ? (
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="font-sans text-sm font-semibold text-emerald-700">
                          {appliedCoupon.code}
                        </span>
                        <span className="font-sans text-xs text-emerald-600">
                          {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `${formatCurrencyShort(appliedCoupon.value)} off`}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[#0F172A]/30 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove coupon"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError('');
                          }}
                          placeholder="Enter code (try WELCOME10)"
                          className="h-10 rounded-xl border-[#0F172A]/10 font-sans text-sm uppercase"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <AnimatePresence>
                          {couponSuccess && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <Button
                        onClick={handleApplyCoupon}
                        variant="outline"
                        className="h-10 rounded-xl border-emerald-200 font-sans text-emerald-600 hover:bg-emerald-50"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 font-sans text-[11px] text-red-500"
                    >
                      {couponError}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
                  >
                    <h2 className="font-sans text-lg font-bold text-[#0F172A]">Order Summary</h2>

                    <div className="mt-5">
                      <OrderSummary />
                    </div>

                    <Separator className="my-5" />

                    <Button
                      asChild
                      className="w-full gap-2 rounded-xl bg-emerald-500 py-5 font-sans text-sm font-semibold hover:bg-emerald-600"
                    >
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Link
                      href="/catalog"
                      className="mt-3 block text-center font-sans text-sm text-[#0F172A]/40 transition-colors hover:text-emerald-500"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
