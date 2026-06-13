'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types';
import { cn, formatCurrencyShort, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Mock orders for demo
const MOCK_ORDERS: Order[] = [
  {
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
  {
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
  {
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
  {
    id: 'HN-order-004',
    userId: 'user-1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@example.com', phone: '0771234567' },
    items: [
      { productId: 'p4', productName: 'Sofa Throw Blanket', price: 2100, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', quantity: 1, stock: 35 },
    ],
    subtotal: 2100,
    shippingFee: 350,
    discount: 0,
    total: 2450,
    couponCode: null,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'pending_cod',
    shippingAddress: { id: 'addr-1', label: 'Home', line1: '42, Galle Road', line2: 'Apt 3B', city: 'Colombo', district: 'Colombo', postalCode: '00300', country: 'Sri Lanka', isDefault: true },
    deliveryType: 'standard',
    trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 86400 * 0.2, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400 * 0.2, nanoseconds: 0 },
  },
];

const statusColors: Record<string, string> = {
  processing: 'bg-yellow-100 text-yellow-700',
  pending_cod: 'bg-yellow-100 text-yellow-700',
  pending_payment: 'bg-orange-100 text-orange-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
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
                My Orders
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
                Order History
              </h1>
              <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                Track and manage your orders
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {MOCK_ORDERS.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                <Package className="h-10 w-10 text-[#0F172A]/20" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">No orders yet</h2>
              <p className="mt-2 max-w-sm font-sans text-sm text-[#0F172A]/50">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href="/catalog"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {MOCK_ORDERS.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="overflow-hidden rounded-2xl border border-[#0F172A]/5 bg-white transition-shadow hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0F172A]/5 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-emerald-500" />
                      <span className="font-sans text-sm font-semibold text-[#0F172A]">#{order.id}</span>
                      <Badge className={cn('rounded-lg px-2 py-0.5 font-sans text-[10px] font-semibold capitalize', statusColors[order.status] || 'bg-gray-100 text-gray-700')}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-xs text-[#0F172A]/40">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-5 py-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <span className="font-sans text-sm text-[#0F172A]/70">
                          {item.productName} <span className="text-[#0F172A]/40">× {item.quantity}</span>
                        </span>
                        <span className="font-sans text-sm font-medium text-[#0F172A]">
                          {formatCurrencyShort(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between border-t border-[#0F172A]/5 bg-[#FAFAF7]/50 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm text-[#0F172A]/50">Total:</span>
                      <span className="font-sans text-base font-bold text-emerald-600">
                        {formatCurrencyShort(order.total)}
                      </span>
                      {order.couponCode && (
                        <Badge className="rounded-lg bg-emerald-50 px-1.5 py-0.5 font-sans text-[9px] text-emerald-600 hover:bg-emerald-50">
                          {order.couponCode}
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/order/${order.id}`}
                      className="flex items-center gap-1 font-sans text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      View Details
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
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
