'use client';

import { DollarSign, ShoppingCart, Package, Users, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import RevenueChart from '@/components/admin/RevenueChart';
import OrdersTable from '@/components/admin/OrdersTable';
import { SEED_PRODUCTS, STORE } from '@/types';
import type { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

const mockOrders: Order[] = [
  {
    id: 'HN-LK8F2A',
    userId: 'u1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@email.com', phone: '+94771234567' },
    items: [
      { productId: 'p1', productName: 'Premium Rice Cooker', price: 4990, image: '', quantity: 1, stock: 24 },
    ],
    subtotal: 4990, shippingFee: 350, discount: 0, total: 5340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'pending_cod',
    shippingAddress: { line1: '45 Galle Road', city: 'Colombo', district: 'Colombo', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
  },
  {
    id: 'HN-M3K9X1',
    userId: 'u2',
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
    id: 'HN-P7R4T6',
    userId: 'u3',
    customer: { firstName: 'Kasun', lastName: 'Jayawardena', email: 'kasun@email.com', phone: '+94775551234' },
    items: [
      { productId: 'p6', productName: 'Ceramic Dinner Set (24-Piece)', price: 6990, image: '', quantity: 1, stock: 12 },
    ],
    subtotal: 6990, shippingFee: 350, discount: 500, total: 6840, couponCode: 'WELCOME500',
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'shipped',
    shippingAddress: { line1: '78 Hill Street', city: 'Galle', district: 'Galle', country: 'Sri Lanka' },
    deliveryType: 'express', trackingNumber: 'SLEX-789456',
    createdAt: { seconds: Date.now() / 1000 - 345600, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
  },
  {
    id: 'HN-Q2W8E5',
    userId: 'u4',
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
    id: 'HN-V5N1H9',
    userId: 'u5',
    customer: { firstName: 'Ravindu', lastName: 'Senanayake', email: 'ravindu@email.com', phone: '+94776789012' },
    items: [
      { productId: 'p9', productName: 'Professional Knife Set (7-Piece)', price: 5990, image: '', quantity: 1, stock: 18 },
    ],
    subtotal: 5990, shippingFee: 350, discount: 0, total: 6340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'cancelled',
    shippingAddress: { line1: '56 High Level Road', city: 'Nugegoda', district: 'Colombo', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 432000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 345600, nanoseconds: 0 },
  },
];

export default function AdminDashboard() {
  const lowStockProducts = SEED_PRODUCTS.filter(p => p.stock <= 25);

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Revenue"
          value={formatCurrency(384500)}
          change={12.5}
          icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
        />
        <StatsCard
          title="Orders"
          value="156"
          change={8.2}
          icon={<ShoppingCart className="w-6 h-6 text-emerald-500" />}
        />
        <StatsCard
          title="Products"
          value={String(SEED_PRODUCTS.length)}
          change={3.1}
          icon={<Package className="w-6 h-6 text-emerald-500" />}
        />
        <StatsCard
          title="Customers"
          value="1,248"
          change={5.7}
          icon={<Users className="w-6 h-6 text-emerald-500" />}
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </a>
          </div>
          <OrdersTable orders={mockOrders} maxRows={5} />
        </div>

        {/* Low Stock Alerts */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-4">Low Stock Alerts</h3>
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">All products are well-stocked!</p>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {product.productName}
                    </p>
                    <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-amber-600">{product.stock}</p>
                    <p className="text-xs text-slate-500">in stock</p>
                  </div>
                </div>
              ))
            )}
            <p className="text-xs text-slate-400 text-center pt-1">
              {STORE.name} Inventory Alert
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
