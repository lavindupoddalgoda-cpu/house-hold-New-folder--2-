'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  UserCircle,
  Chrome,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Navbar() {
  const {
    cart,
    wishlist,
    user,
    searchOpen,
    mobileMenuOpen,
    setSearchOpen,
    setMobileMenuOpen,
    setCartOpen,
    getCartCount,
  } = useStore();
  const { login, register, logout, loginWithGoogle, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);
    if (result) {
      setLoginOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(registerName, registerEmail, registerPassword);
    if (result) {
      setRegisterOpen(false);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className={`font-display text-lg font-bold ${scrolled ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>
              HomeNest LK
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-sans text-sm font-medium transition-colors hover:text-emerald-500 ${
                  scrolled ? 'text-[#0F172A]/70' : 'text-[#0F172A]/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px] text-[#0F172A]/70" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px] text-[#0F172A]/70" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 font-sans text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Cart"
            >
              <ShoppingCart className="h-[18px] w-[18px] text-[#0F172A]/70" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 font-sans text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-[#0F172A]/5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    {user.photoURL ? (
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="font-sans text-xs font-semibold text-emerald-700">
                        {user.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-[#0F172A]/40 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#0F172A]/5 bg-white py-1 shadow-lg"
                    >
                      <div className="border-b border-[#0F172A]/5 px-4 py-3">
                        <p className="font-sans text-sm font-semibold text-[#0F172A]">
                          {user.displayName}
                        </p>
                        <p className="font-sans text-xs text-[#0F172A]/50">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-[#0F172A]/70 transition-colors hover:bg-[#0F172A]/5"
                      >
                        <UserCircle className="h-4 w-4" />
                        Account
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-[#0F172A]/70 transition-colors hover:bg-[#0F172A]/5"
                      >
                        <Package className="h-4 w-4" />
                        Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 font-sans text-sm text-[#0F172A]/70 transition-colors hover:bg-[#0F172A]/5"
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 font-sans text-sm text-red-500 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex h-9 items-center gap-1.5 rounded-full px-3 font-sans text-sm font-medium text-[#0F172A]/70 transition-colors hover:bg-[#0F172A]/5"
              >
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px] text-[#0F172A]/70" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Cart"
            >
              <ShoppingCart className="h-[18px] w-[18px] text-[#0F172A]/70" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 font-sans text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-[#0F172A]/70" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Login Modal */}
      <AnimatePresence>
        {loginOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setLoginOpen(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setLoginOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              >
                <X className="h-4 w-4 text-[#0F172A]/50" />
              </button>

              <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                Welcome Back
              </h2>
              <p className="mt-1 font-sans text-sm text-[#0F172A]/50">
                Sign in to your HomeNest LK account
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block font-sans text-xs font-medium text-[#0F172A]/60 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-lg border border-[#0F172A]/10 bg-[#FAFAF7] pl-10 pr-4 font-sans text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block font-sans text-xs font-medium text-[#0F172A]/60 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="h-11 w-full rounded-lg border border-[#0F172A]/10 bg-[#FAFAF7] pl-10 pr-10 font-sans text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-[#0F172A]/30 hover:text-[#0F172A]/60"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="h-11 w-full rounded-lg bg-emerald-500 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#0F172A]/10" />
                <span className="font-sans text-xs text-[#0F172A]/30">or</span>
                <div className="h-px flex-1 bg-[#0F172A]/10" />
              </div>

              <button
                onClick={async () => {
                  await loginWithGoogle();
                  setLoginOpen(false);
                }}
                disabled={authLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#0F172A]/10 font-sans text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#0F172A]/5 disabled:opacity-50"
              >
                <Chrome className="h-4 w-4" />
                Continue with Google
              </button>

              <p className="mt-4 text-center font-sans text-sm text-[#0F172A]/50">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setLoginOpen(false);
                    setRegisterOpen(true);
                  }}
                  className="font-semibold text-emerald-500 hover:text-emerald-600"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {registerOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setRegisterOpen(false)}
            />
            <motion.div
              className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setRegisterOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#0F172A]/5"
              >
                <X className="h-4 w-4 text-[#0F172A]/50" />
              </button>

              <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                Create Account
              </h2>
              <p className="mt-1 font-sans text-sm text-[#0F172A]/50">
                Join HomeNest LK for exclusive deals
              </p>

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block font-sans text-xs font-medium text-[#0F172A]/60 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="h-11 w-full rounded-lg border border-[#0F172A]/10 bg-[#FAFAF7] pl-10 pr-4 font-sans text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block font-sans text-xs font-medium text-[#0F172A]/60 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-lg border border-[#0F172A]/10 bg-[#FAFAF7] pl-10 pr-4 font-sans text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block font-sans text-xs font-medium text-[#0F172A]/60 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                      className="h-11 w-full rounded-lg border border-[#0F172A]/10 bg-[#FAFAF7] pl-10 pr-10 font-sans text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-[#0F172A]/30 hover:text-[#0F172A]/60"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="h-11 w-full rounded-lg bg-emerald-500 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                >
                  {authLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#0F172A]/10" />
                <span className="font-sans text-xs text-[#0F172A]/30">or</span>
                <div className="h-px flex-1 bg-[#0F172A]/10" />
              </div>

              <button
                onClick={async () => {
                  await loginWithGoogle();
                  setRegisterOpen(false);
                }}
                disabled={authLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#0F172A]/10 font-sans text-sm font-medium text-[#0F172A] transition-colors hover:bg-[#0F172A]/5 disabled:opacity-50"
              >
                <Chrome className="h-4 w-4" />
                Continue with Google
              </button>

              <p className="mt-4 text-center font-sans text-sm text-[#0F172A]/50">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setRegisterOpen(false);
                    setLoginOpen(true);
                  }}
                  className="font-semibold text-emerald-500 hover:text-emerald-600"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
