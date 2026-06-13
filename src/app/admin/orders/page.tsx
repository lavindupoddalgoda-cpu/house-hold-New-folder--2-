'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending_cod: 'bg-amber-50 text-amber-700 border-amber-200',
  pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  pending_cod: 'Pending COD',
  pending_payment: 'Pending Payment',
  processing: 'Processing',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const mockOrders: Order[] = [
  {
    id: 'HN-LK8F2A', userId: 'u1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@email.com', phone: '+94771234567' },
    items: [{ productId: 'p1', productName: 'Premium Rice Cooker', price: 4990, image: '', quantity: 1, stock: 24 }],
    subtotal: 4990, shippingFee: 350, discount: 0, total: 5340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'pending_cod',
    shippingAddress: { line1: '45 Galle Road', city: 'Colombo', district: 'Colombo', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
  },
  {
    id: 'HN-M3K9X1', userId: 'u2',
    customer: { firstName: 'Nishadi', lastName: 'Fernando', email: 'nishadi@email.com', phone: '+94779876543' },
    items: [
      { productId: 'p2', productName: 'Egyptian Cotton Bedsheet Set', price: 3200, image: '', quantity: 2, stock: 45 },
      { productId: 'p4', productName: 'Sofa Throw Blanket', price: 2100, image: '', quantity: 1, stock: 35 },
    ],
    subtotal: 8500, shippingFee: 0, discount: 0, total: 8500, couponCode: null,
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'processing',
    shippingAddress: { line1: '12 Temple Lane', city: 'Kandy', district: 'Kandy', country: 'Sri Lanka' },
    deliveryType: 'express', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
  },
  {
    id: 'HN-P7R4T6', userId: 'u3',
    customer: { firstName: 'Kasun', lastName: 'Jayawardena', email: 'kasun@email.com', phone: '+94775551234' },
    items: [{ productId: 'p6', productName: 'Ceramic Dinner Set (24-Piece)', price: 6990, image: '', quantity: 1, stock: 12 }],
    subtotal: 6990, shippingFee: 350, discount: 500, total: 6840, couponCode: 'WELCOME500',
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'shipped',
    shippingAddress: { line1: '78 Hill Street', city: 'Galle', district: 'Galle', country: 'Sri Lanka' },
    deliveryType: 'express', trackingNumber: 'SLEX-789456',
    createdAt: { seconds: Date.now() / 1000 - 345600, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
  },
  {
    id: 'HN-Q2W8E5', userId: 'u4',
    customer: { firstName: 'Dilini', lastName: 'Wickramasinghe', email: 'dilini@email.com', phone: '+94773456789' },
    items: [
      { productId: 'p10', productName: 'Blackout Curtains (Pair)', price: 7490, image: '', quantity: 1, stock: 22 },
      { productId: 'p11', productName: 'Essential Oil Diffuser', price: 3600, image: '', quantity: 1, stock: 40 },
    ],
    subtotal: 11090, shippingFee: 0, discount: 0, total: 11090, couponCode: null,
    paymentMethod: 'bank_transfer', paymentStatus: 'paid', status: 'delivered',
    shippingAddress: { line1: '23 Peradeniya Road', city: 'Kandy', district: 'Kandy', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: 'SLST-456123',
    createdAt: { seconds: Date.now() / 1000 - 604800, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 259200, nanoseconds: 0 },
  },
  {
    id: 'HN-V5N1H9', userId: 'u5',
    customer: { firstName: 'Ravindu', lastName: 'Senanayake', email: 'ravindu@email.com', phone: '+94776789012' },
    items: [{ productId: 'p9', productName: 'Professional Knife Set (7-Piece)', price: 5990, image: '', quantity: 1, stock: 18 }],
    subtotal: 5990, shippingFee: 350, discount: 0, total: 6340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'cancelled',
    shippingAddress: { line1: '56 High Level Road', city: 'Nugegoda', district: 'Colombo', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 432000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 345600, nanoseconds: 0 },
  },
  {
    id: 'HN-B8D2J4', userId: 'u6',
    customer: { firstName: 'Sanduni', lastName: 'Rajapaksa', email: 'sanduni@email.com', phone: '+94774445566' },
    items: [
      { productId: 'p3', productName: 'Premium Towel Set (6-Pack)', price: 1590, image: '', quantity: 2, stock: 60 },
      { productId: 'p5', productName: 'Bamboo Storage Basket', price: 950, image: '', quantity: 3, stock: 80 },
    ],
    subtotal: 6030, shippingFee: 350, discount: 0, total: 6380, couponCode: null,
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'paid',
    shippingAddress: { line1: '89 Main Street', city: 'Matara', district: 'Matara', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 259200, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
  },
  {
    id: 'HN-F6G1K3', userId: 'u7',
    customer: { firstName: 'Tharindu', lastName: 'De Silva', email: 'tharindu@email.com', phone: '+94773334455' },
    items: [{ productId: 'p8', productName: 'Wooden Plant Stand', price: 990, image: '', quantity: 1, stock: 50 }],
    subtotal: 990, shippingFee: 350, discount: 0, total: 1340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'pending_cod',
    shippingAddress: { line1: '34 Station Road', city: 'Kurunegala', district: 'Kurunegala', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 518400, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 518400, nanoseconds: 0 },
  },
  {
    id: 'HN-C4H7M2', userId: 'u8',
    customer: { firstName: 'Ishara', lastName: 'Bandara', email: 'ishara@email.com', phone: '+94772223344' },
    items: [{ productId: 'p7', productName: 'LED Desk Lamp', price: 4400, image: '', quantity: 1, stock: 30 }],
    subtotal: 4400, shippingFee: 350, discount: 0, total: 4750, couponCode: null,
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'shipped',
    shippingAddress: { line1: '67 Temple Lane', city: 'Negombo', district: 'Gampaha', country: 'Sri Lanka' },
    deliveryType: 'express', trackingNumber: 'SLEX-123456',
    createdAt: { seconds: Date.now() / 1000 - 432000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
  },
];

const statusTabs = ['all', 'pending_cod', 'pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = activeTab === 'all' || o.status === activeTab;
      return matchSearch && matchStatus;
    });
  }, [search, activeTab]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockOrders.length };
    for (const o of mockOrders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Orders</h2>
        <p className="text-sm text-slate-500">{mockOrders.length} total orders</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by order ID, customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white shadow rounded-xl h-auto p-1 flex-wrap">
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg"
            >
              {tab === 'all' ? 'All' : statusLabels[tab] || tab}
              <span className="ml-1.5 text-[10px] opacity-60">({tabCounts[tab] || 0})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono font-medium text-slate-900">{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{order.customer.firstName} {order.customer.lastName}</p>
                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{order.paymentMethod.replace('_', ' ')}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn('text-xs font-medium border', statusColors[order.status] || 'bg-slate-50 text-slate-700 border-slate-200')}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
