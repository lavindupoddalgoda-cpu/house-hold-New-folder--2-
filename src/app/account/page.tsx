'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Package,
  Heart,
  Edit3,
  Plus,
  Trash2,
  Check,
  X,
  ChevronRight,
  Phone,
  Mail,
  LogOut,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import ProductCard from '@/components/ecommerce/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { SEED_PRODUCTS, SEED_REVIEWS, SL_DISTRICTS } from '@/types';
import type { Address, Order } from '@/types';
import { cn, formatCurrencyShort, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

type TabKey = 'profile' | 'addresses' | 'orders' | 'wishlist';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { wishlist } = useStore();

  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'addr-1', label: 'Home', line1: '42, Galle Road', line2: 'Apt 3B', city: 'Colombo', district: 'Colombo', postalCode: '00300', country: 'Sri Lanka', isDefault: true },
    { id: 'addr-2', label: 'Office', line1: '15, Duplication Road', city: 'Colombo', district: 'Colombo', postalCode: '00400', country: 'Sri Lanka', isDefault: false },
  ]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: '', line1: '', line2: '', city: '', district: '', postalCode: '', country: 'Sri Lanka', isDefault: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const wishlistedProducts = SEED_PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleSaveProfile = () => {
    setEditingProfile(false);
  };

  const handleAddAddress = () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.district) return;
    const addr: Address = {
      id: `addr-${Date.now()}`,
      label: newAddress.label || 'Address',
      line1: newAddress.line1 || '',
      line2: newAddress.line2,
      city: newAddress.city || '',
      district: newAddress.district || '',
      postalCode: newAddress.postalCode,
      country: 'Sri Lanka',
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, addr]);
    setAddingAddress(false);
    setNewAddress({ label: '', line1: '', line2: '', city: '', district: '', postalCode: '', country: 'Sri Lanka', isDefault: false });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

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
                My Account
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
                Welcome, {user.displayName}
              </h1>
              <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                {user.email}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Tabs */}
            <aside className="w-full lg:w-56 shrink-0">
              <div className="sticky top-24 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium transition-colors',
                      activeTab === tab.key
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-[#0F172A]/50 hover:bg-[#0F172A]/5'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.key === 'wishlist' && wishlist.length > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 font-sans text-[10px] font-bold text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                ))}
                <Separator className="my-2" />
                <button
                  onClick={() => { logout(); router.replace('/'); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl border border-[#0F172A]/5 bg-white p-6 sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-sans text-lg font-bold text-[#0F172A]">Profile Information</h2>
                      <Button
                        onClick={() => {
                          setEditName(user.displayName);
                          setEditPhone(user.phone);
                          setEditingProfile(!editingProfile);
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-xl border-emerald-200 font-sans text-emerald-600 hover:bg-emerald-50"
                      >
                        {editingProfile ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                        {editingProfile ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>

                    <div className="mt-6 space-y-5">
                      {editingProfile ? (
                        <>
                          <div className="space-y-1.5">
                            <Label className="font-sans text-xs text-[#0F172A]/60">Display Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-10 rounded-xl border-[#0F172A]/10 pl-9 font-sans text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="font-sans text-xs text-[#0F172A]/60">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                              <Input
                                value={user.email}
                                disabled
                                className="h-10 rounded-xl border-[#0F172A]/10 bg-[#FAFAF7] pl-9 font-sans text-sm text-[#0F172A]/50"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="font-sans text-xs text-[#0F172A]/60">Phone</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                              <Input
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                placeholder="0771234567"
                                className="h-10 rounded-xl border-[#0F172A]/10 pl-9 font-sans text-sm"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={handleSaveProfile}
                            className="gap-1.5 rounded-xl bg-emerald-500 font-sans hover:bg-emerald-600"
                          >
                            <Check className="h-4 w-4" />
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                              <span className="font-display text-2xl font-bold text-emerald-700">
                                {user.displayName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-sans text-lg font-semibold text-[#0F172A]">{user.displayName}</p>
                              <p className="font-sans text-sm text-[#0F172A]/50">{user.email}</p>
                              {user.phone && <p className="font-sans text-sm text-[#0F172A]/50">{user.phone}</p>}
                            </div>
                          </div>
                          <Separator />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-[#0F172A]/5 p-4">
                              <p className="font-sans text-xs text-[#0F172A]/40">Role</p>
                              <p className="mt-1 font-sans text-sm font-medium capitalize text-[#0F172A]">{user.role}</p>
                            </div>
                            <div className="rounded-xl border border-[#0F172A]/5 p-4">
                              <p className="font-sans text-xs text-[#0F172A]/40">Member Since</p>
                              <p className="mt-1 font-sans text-sm font-medium text-[#0F172A]">{formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="font-sans text-lg font-bold text-[#0F172A]">Saved Addresses</h2>
                      <Button
                        onClick={() => setAddingAddress(true)}
                        size="sm"
                        className="gap-1.5 rounded-xl bg-emerald-500 font-sans hover:bg-emerald-600"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Address
                      </Button>
                    </div>

                    {/* Add Address Form */}
                    <AnimatePresence>
                      {addingAddress && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-4">
                            <h3 className="font-sans text-sm font-semibold text-[#0F172A]">New Address</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <Label className="font-sans text-xs text-[#0F172A]/60">Label</Label>
                                <Input
                                  value={newAddress.label}
                                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                  placeholder="Home, Office, etc."
                                  className="h-9 rounded-xl border-[#0F172A]/10 font-sans text-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="font-sans text-xs text-[#0F172A]/60">Address Line 1</Label>
                                <Input
                                  value={newAddress.line1}
                                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                                  placeholder="Street address"
                                  className="h-9 rounded-xl border-[#0F172A]/10 font-sans text-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="font-sans text-xs text-[#0F172A]/60">Address Line 2</Label>
                                <Input
                                  value={newAddress.line2}
                                  onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                                  placeholder="Apt, suite, etc."
                                  className="h-9 rounded-xl border-[#0F172A]/10 font-sans text-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="font-sans text-xs text-[#0F172A]/60">City</Label>
                                <Input
                                  value={newAddress.city}
                                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                  placeholder="City"
                                  className="h-9 rounded-xl border-[#0F172A]/10 font-sans text-sm"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="font-sans text-xs text-[#0F172A]/60">District</Label>
                                <select
                                  value={newAddress.district}
                                  onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                                  className="flex h-9 w-full rounded-xl border border-[#0F172A]/10 bg-white px-3 font-sans text-sm outline-none focus:border-emerald-500"
                                >
                                  <option value="">Select district</option>
                                  {SL_DISTRICTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="font-sans text-xs text-[#0F172A]/60">Postal Code</Label>
                                <Input
                                  value={newAddress.postalCode}
                                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                  placeholder="00300"
                                  className="h-9 rounded-xl border-[#0F172A]/10 font-sans text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleAddAddress}
                                size="sm"
                                className="gap-1.5 rounded-xl bg-emerald-500 font-sans hover:bg-emerald-600"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Save Address
                              </Button>
                              <Button
                                onClick={() => setAddingAddress(false)}
                                variant="ghost"
                                size="sm"
                                className="font-sans text-[#0F172A]/50"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Address Cards */}
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <motion.div
                          key={addr.id}
                          layout
                          className="rounded-2xl border border-[#0F172A]/5 bg-white p-5"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-sans text-sm font-semibold text-[#0F172A]">{addr.label}</span>
                                {addr.isDefault && (
                                  <Badge className="rounded-lg bg-emerald-100 px-2 py-0.5 font-sans text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-2 font-sans text-sm text-[#0F172A]/60">
                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                              </p>
                              <p className="font-sans text-sm text-[#0F172A]/60">
                                {addr.city}, {addr.district} {addr.postalCode || ''}
                              </p>
                              <p className="font-sans text-sm text-[#0F172A]/40">{addr.country}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[#0F172A]/20 transition-colors hover:bg-red-50 hover:text-red-500"
                              aria-label="Delete address"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="font-sans text-lg font-bold text-[#0F172A]">Order History</h2>
                    {MOCK_ORDERS.map((order) => (
                      <motion.div
                        key={order.id}
                        layout
                        className="overflow-hidden rounded-2xl border border-[#0F172A]/5 bg-white"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0F172A]/5 px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="font-sans text-sm font-semibold text-[#0F172A]">#{order.id}</span>
                            <Badge className={cn('rounded-lg px-2 py-0.5 font-sans text-[10px] font-semibold', statusColors[order.status] || 'bg-gray-100 text-gray-700')}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="font-sans text-xs text-[#0F172A]/40">{formatDate(order.createdAt)}</span>
                        </div>

                        {/* Order Items */}
                        <div className="px-5 py-3 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex items-center justify-between">
                              <span className="font-sans text-sm text-[#0F172A]/70">
                                {item.productName} × {item.quantity}
                              </span>
                              <span className="font-sans text-sm font-medium text-[#0F172A]">
                                {formatCurrencyShort(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex items-center justify-between border-t border-[#0F172A]/5 px-5 py-3">
                          <span className="font-sans text-sm font-bold text-[#0F172A]">
                            Total: {formatCurrencyShort(order.total)}
                          </span>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="gap-1 font-sans text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <a href={`/order/${order.id}`}>
                              View Details
                              <ChevronRight className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="font-sans text-lg font-bold text-[#0F172A]">
                      My Wishlist ({wishlistedProducts.length})
                    </h2>
                    {wishlistedProducts.length === 0 ? (
                      <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                          <Heart className="h-8 w-8 text-[#0F172A]/20" />
                        </div>
                        <p className="font-sans text-sm text-[#0F172A]/40">
                          No items in your wishlist yet.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
                        {wishlistedProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
