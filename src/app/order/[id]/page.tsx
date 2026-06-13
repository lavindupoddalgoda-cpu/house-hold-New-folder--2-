'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Check,
  Package,
  Truck,
  Home,
  Clock,
  CreditCard,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import type { Order } from '@/types';
import { cn, formatCurrencyShort, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Mock order data for demo
const MOCK_ORDERS: Record<string, Order> = {
  'HN-order-001': {
    id: 'HN-order-001',
    userId: 'user-1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@example.com', phone: '0771234567' },
    items: [
      { productId: 'p1', productName: 'Premium Rice Cooker', price: 4990, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80', quantity: 1, stock: 24 },
      { productId: 'p3', productName: 'Premium Towel Set (6-Pack)', price: 1590, image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80', quantity: 2, stock: 60 },
    ],
    subtotal: 8170,
    shippingFee: 0,
    discount: 500,
    total: 7670,
    couponCode: 'SAVE500',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'shipped',
    shippingAddress: { id: 'addr-1', label: 'Home', line1: '42, Galle Road', line2: 'Apt 3B', city: 'Colombo', district: 'Colombo', postalCode: '00300', country: 'Sri Lanka', isDefault: true },
    deliveryType: 'standard',
    trackingNumber: 'SL-EXP-2024-001234',
    createdAt: { seconds: Date.now() / 1000 - 86400 * 3, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 1, nanoseconds: 0 },
  },
  'HN-order-002': {
    id: 'HN-order-002',
    userId: 'user-1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@example.com', phone: '0771234567' },
    items: [
      { productId: 'p2', productName: 'Egyptian Cotton Bedsheet Set', price: 3200, image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80', quantity: 1, stock: 45 },
    ],
    subtotal: 3200,
    shippingFee: 350,
    discount: 0,
    total: 3550,
    couponCode: null,
    paymentMethod: 'payhere',
    paymentStatus: 'paid',
    status: 'delivered',
    shippingAddress: { id: 'addr-1', label: 'Home', line1: '42, Galle Road', line2: 'Apt 3B', city: 'Colombo', district: 'Colombo', postalCode: '00300', country: 'Sri Lanka', isDefault: true },
    deliveryType: 'standard',
    trackingNumber: 'SL-EXP-2024-000987',
    createdAt: { seconds: Date.now() / 1000 - 86400 * 10, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 7, nanoseconds: 0 },
  },
  'HN-order-003': {
    id: 'HN-order-003',
    userId: 'user-1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@example.com', phone: '0771234567' },
    items: [
      { productId: 'p9', productName: 'Professional Knife Set (7-Piece)', price: 5990, image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80', quantity: 1, stock: 18 },
      { productId: 'p6', productName: 'Ceramic Dinner Set (24-Piece)', price: 6990, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', quantity: 1, stock: 12 },
    ],
    subtotal: 12980,
    shippingFee: 0,
    discount: 1298,
    total: 11682,
    couponCode: 'WELCOME10',
    paymentMethod: 'payhere',
    paymentStatus: 'paid',
    status: 'processing',
    shippingAddress: { id: 'addr-2', label: 'Office', line1: '15, Duplication Road', city: 'Colombo', district: 'Colombo', postalCode: '00400', country: 'Sri Lanka' },
    deliveryType: 'express',
    trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 86400 * 0.5, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 0.5, nanoseconds: 0 },
  },
};

// Confetti-like particle component
function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute h-2 w-2 rounded-full"
      style={{ backgroundColor: color, left: `${x}%`, top: '40%' }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -80 - Math.random() * 60, -150 - Math.random() * 80],
        x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
        scale: [1, 1.2, 0.5],
        rotate: [0, 180 + Math.random() * 180, 360],
      }}
      transition={{ duration: 1.8, delay, ease: 'easeOut' }}
    />
  );
}

const statusSteps = [
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'paid', label: 'Payment Confirmed', icon: CreditCard },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const statusOrder: Record<string, number> = {
  processing: 0,
  pending_cod: 0,
  pending_payment: 0,
  paid: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  const order = useMemo(() => MOCK_ORDERS[orderId] || null, [orderId]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => setShowConfetti(true), 400);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <main className="flex min-h-[60vh] flex-col items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="font-display text-2xl font-bold text-[#0F172A]">Order Not Found</h1>
            <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
              The order you are looking for does not exist.
            </p>
            <Link
              href="/orders"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              View All Orders
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStep = statusOrder[order.status] ?? 0;
  const isCancelled = order.status === 'cancelled';

  const confettiColors = ['#10B981', '#F59E0B', '#0F172A', '#34D399', '#FCD34D', '#6EE7B7'];
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    delay: i * 0.04,
    x: 30 + Math.random() * 40,
    color: confettiColors[i % confettiColors.length],
  }));

  const paymentMethodLabels: Record<string, string> = {
    payhere: 'PayHere',
    bank_transfer: 'Bank Transfer',
    cod: 'Cash on Delivery',
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
        {/* Success Header */}
        <div className="relative overflow-hidden bg-emerald-500">
          {/* Confetti */}
          {showConfetti && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {confettiParticles.map((p, i) => (
                <ConfettiParticle key={i} delay={p.delay} x={p.x} color={p.color} />
              ))}
            </div>
          )}

          <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 }}
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-3xl font-bold text-white sm:text-4xl"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 font-sans text-base text-white/70"
            >
              Your order <span className="font-semibold text-white">#{order.id}</span> has been placed successfully
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-1 font-sans text-sm text-white/50"
            >
              {formatDate(order.createdAt)}
            </motion.p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Status Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
              >
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#0F172A]/50">
                  Order Status
                </h2>

                {!isCancelled ? (
                  <div className="mt-6 flex items-center justify-between">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = currentStep >= idx;
                      const isCurrent = currentStep === idx;
                      return (
                        <div key={step.key} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: isCurrent ? 1.1 : 1 }}
                              transition={{ delay: 0.6 + idx * 0.1 }}
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                                isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#0F172A]/5 text-[#0F172A]/30'
                              )}
                            >
                              <step.icon className="h-4 w-4" />
                            </motion.div>
                            <span className={cn(
                              'mt-2 font-sans text-[11px] text-center',
                              isCompleted ? 'font-semibold text-emerald-600' : 'text-[#0F172A]/30'
                            )}>
                              {step.label}
                            </span>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div className="mx-1 h-0.5 flex-1 sm:mx-2">
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: currentStep > idx ? 1 : 0 }}
                                transition={{ delay: 0.8 + idx * 0.15, duration: 0.4 }}
                                className={cn(
                                  'h-full origin-left',
                                  currentStep > idx ? 'bg-emerald-500' : 'bg-[#0F172A]/5'
                                )}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 text-center">
                    <Badge className="rounded-lg bg-red-100 px-3 py-1 font-sans text-sm text-red-600 hover:bg-red-100">
                      Order Cancelled
                    </Badge>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="mt-4 rounded-xl border border-[#0F172A]/5 bg-[#FAFAF7] p-3">
                    <p className="font-sans text-xs text-[#0F172A]/40">Tracking Number</p>
                    <p className="mt-0.5 font-sans text-sm font-semibold text-[#0F172A]">{order.trackingNumber}</p>
                  </div>
                )}
              </motion.div>

              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
              >
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#0F172A]/50">
                  Order Items
                </h2>
                <div className="mt-4 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FAFAF7]">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-sm font-semibold text-[#0F172A]">
                          {item.productName}
                        </p>
                        <p className="font-sans text-xs text-[#0F172A]/40">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-sans text-sm font-bold text-emerald-600">
                        {formatCurrencyShort(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              {/* Order Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
              >
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#0F172A]/50">
                  Order Details
                </h2>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">Order ID</span>
                    <span className="font-sans text-sm font-semibold text-[#0F172A]">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">Date</span>
                    <span className="font-sans text-sm text-[#0F172A]">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">Payment</span>
                    <span className="font-sans text-sm text-[#0F172A]">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">Delivery</span>
                    <span className="font-sans text-sm capitalize text-[#0F172A]">{order.deliveryType}</span>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
              >
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#0F172A]/50">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Shipping Address
                  </span>
                </h2>
                <div className="mt-3 font-sans text-sm text-[#0F172A]/70 leading-relaxed">
                  <p>{order.customer.firstName} {order.customer.lastName}</p>
                  <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </motion.div>

              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="rounded-2xl border border-[#0F172A]/5 bg-white p-6"
              >
                <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#0F172A]/50">
                  Payment Summary
                </h2>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">Subtotal</span>
                    <span className="font-sans text-sm text-[#0F172A]">{formatCurrencyShort(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-sm text-[#0F172A]/50">Shipping</span>
                    <span className={cn('font-sans text-sm', order.shippingFee === 0 ? 'text-emerald-600 font-semibold' : 'text-[#0F172A]')}>
                      {order.shippingFee === 0 ? 'FREE' : formatCurrencyShort(order.shippingFee)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-emerald-600">Discount</span>
                      <span className="font-sans text-sm font-medium text-emerald-600">-{formatCurrencyShort(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-sans text-base font-bold text-[#0F172A]">Total</span>
                    <span className="font-sans text-lg font-bold text-emerald-600">{formatCurrencyShort(order.total)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="gap-2 rounded-xl bg-emerald-500 py-5 font-sans font-semibold hover:bg-emerald-600"
                >
                  <Link href="/catalog">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 rounded-xl border-[#0F172A]/10 font-sans hover:bg-[#0F172A]/5"
                >
                  <Link href="/orders">
                    <Package className="h-4 w-4" />
                    View All Orders
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
