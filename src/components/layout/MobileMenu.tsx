'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, User, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';

export default function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, user, wishlist, getCartCount, setCartOpen } = useStore();
  const { logout } = useAuth();
  const cartCount = getCartCount();

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Catalog', href: '/#catalog', icon: ShoppingCart },
    { label: 'Wishlist', href: '/#wishlist', icon: Heart },
  ];

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 bottom-0 left-0 z-[56] flex w-[300px] max-w-[80vw] flex-col bg-white shadow-2xl md:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#0F172A]/5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <span className="font-display text-lg font-bold text-[#0F172A]">
                  HomeNest LK
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-[#0F172A]/50" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 font-sans text-sm font-medium text-[#0F172A]/70 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                      {link.label === 'Wishlist' && wishlist.length > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 font-sans text-[10px] font-bold text-white">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Cart Quick Access */}
              <div className="mt-4 border-t border-[#0F172A]/5 pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => setCartOpen(true), 200);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 font-sans text-sm font-medium text-[#0F172A]/70 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 font-sans text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>

            {/* Account Section */}
            <div className="border-t border-[#0F172A]/5 px-5 py-4">
              {user ? (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                      {user.photoURL ? (
                        <div className="relative h-9 w-9 overflow-hidden rounded-full">
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="font-sans text-sm font-semibold text-emerald-700">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-semibold text-[#0F172A]">
                        {user.displayName}
                      </p>
                      <p className="truncate font-sans text-xs text-[#0F172A]/40">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/#signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
