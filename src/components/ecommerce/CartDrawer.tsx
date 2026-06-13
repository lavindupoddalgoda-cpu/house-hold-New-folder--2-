'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatCurrencyShort } from '@/lib/utils';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useStore();

  const total = getCartTotal();
  const count = getCartCount();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 bottom-0 right-0 z-[56] flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#0F172A]/5 px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  Your Cart
                </h2>
                {count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 font-sans text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 text-[#0F172A]/50" />
              </button>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FAFAF7]">
                  <ShoppingBag className="h-8 w-8 text-[#0F172A]/20" />
                </div>
                <p className="font-sans text-sm text-[#0F172A]/40">
                  Your cart is empty
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-lg bg-emerald-500 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {cart.map((item) => (
                        <motion.div
                          key={`${item.productId}-${item.variant?.value || ''}`}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-3 rounded-xl border border-[#0F172A]/5 p-3"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#FAFAF7]">
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex min-w-0 flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate font-sans text-sm font-semibold text-[#0F172A]">
                                  {item.productName}
                                </p>
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#0F172A]/20 transition-colors hover:bg-red-50 hover:text-red-500"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                              {item.variant && (
                                <p className="mt-0.5 font-sans text-xs text-[#0F172A]/40">
                                  {item.variant.type}: {item.variant.value}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="font-sans text-sm font-bold text-emerald-600">
                                {formatCurrencyShort(item.price * item.quantity)}
                              </p>
                              {/* Quantity Stepper */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#0F172A]/10 transition-colors hover:bg-[#0F172A]/5"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3 text-[#0F172A]/50" />
                                </button>
                                <span className="w-8 text-center font-sans text-sm font-medium text-[#0F172A]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#0F172A]/10 transition-colors hover:bg-[#0F172A]/5 disabled:opacity-30"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3 text-[#0F172A]/50" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="border-t border-[#0F172A]/5 bg-white px-5 py-4">
                  {/* Subtotal */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">
                      Subtotal ({count} item{count !== 1 ? 's' : ''})
                    </span>
                    <span className="font-display text-lg font-bold text-[#0F172A]">
                      {formatCurrencyShort(total)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <a
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#0F172A]/10 font-sans text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#0F172A]/5"
                    >
                      View Cart
                    </a>
                    <a
                      href="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Checkout
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
