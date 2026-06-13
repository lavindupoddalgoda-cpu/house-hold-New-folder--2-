'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Printer,
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  CreditCard,
} from 'lucide-react';

const mockOrders: Order[] = [
  {
    id: 'HN-LK8F2A', userId: 'u1',
    customer: { firstName: 'Amal', lastName: 'Perera', email: 'amal@email.com', phone: '+94771234567' },
    items: [{ productId: 'p1', productName: 'Premium Rice Cooker', price: 4990, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80', quantity: 1, stock: 24 }],
    subtotal: 4990, shippingFee: 350, discount: 0, total: 5340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'pending_cod',
    shippingAddress: { line1: '45 Galle Road', line2: 'Bambalapitiya', city: 'Colombo', district: 'Colombo', postalCode: '00300', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
  },
  {
    id: 'HN-M3K9X1', userId: 'u2',
    customer: { firstName: 'Nishadi', lastName: 'Fernando', email: 'nishadi@email.com', phone: '+94779876543' },
    items: [
      { productId: 'p2', productName: 'Egyptian Cotton Bedsheet Set', price: 3200, image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80', quantity: 2, stock: 45 },
      { productId: 'p4', productName: 'Sofa Throw Blanket', price: 2100, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', quantity: 1, stock: 35 },
    ],
    subtotal: 8500, shippingFee: 0, discount: 0, total: 8500, couponCode: null,
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'processing',
    shippingAddress: { line1: '12 Temple Lane', city: 'Kandy', district: 'Kandy', postalCode: '20000', country: 'Sri Lanka' },
    deliveryType: 'express', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 },
  },
  {
    id: 'HN-P7R4T6', userId: 'u3',
    customer: { firstName: 'Kasun', lastName: 'Jayawardena', email: 'kasun@email.com', phone: '+94775551234' },
    items: [{ productId: 'p6', productName: 'Ceramic Dinner Set (24-Piece)', price: 6990, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', quantity: 1, stock: 12 }],
    subtotal: 6990, shippingFee: 350, discount: 500, total: 6840, couponCode: 'WELCOME500',
    paymentMethod: 'payhere', paymentStatus: 'paid', status: 'shipped',
    shippingAddress: { line1: '78 Hill Street', city: 'Galle', district: 'Galle', postalCode: '80000', country: 'Sri Lanka' },
    deliveryType: 'express', trackingNumber: 'SLEX-789456',
    createdAt: { seconds: Date.now() / 1000 - 345600, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 },
  },
  {
    id: 'HN-Q2W8E5', userId: 'u4',
    customer: { firstName: 'Dilini', lastName: 'Wickramasinghe', email: 'dilini@email.com', phone: '+94773456789' },
    items: [
      { productId: 'p10', productName: 'Blackout Curtains (Pair)', price: 7490, image: 'https://images.unsplash.com/photo-1518051876612-2f0f8d4b7b5e?w=400&q=80', quantity: 1, stock: 22 },
      { productId: 'p11', productName: 'Essential Oil Diffuser', price: 3600, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&q=80', quantity: 1, stock: 40 },
    ],
    subtotal: 11090, shippingFee: 0, discount: 0, total: 11090, couponCode: null,
    paymentMethod: 'bank_transfer', paymentStatus: 'paid', status: 'delivered',
    shippingAddress: { line1: '23 Peradeniya Road', city: 'Kandy', district: 'Kandy', postalCode: '20000', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: 'SLST-456123',
    createdAt: { seconds: Date.now() / 1000 - 604800, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 259200, nanoseconds: 0 },
  },
  {
    id: 'HN-V5N1H9', userId: 'u5',
    customer: { firstName: 'Ravindu', lastName: 'Senanayake', email: 'ravindu@email.com', phone: '+94776789012' },
    items: [{ productId: 'p9', productName: 'Professional Knife Set (7-Piece)', price: 5990, image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80', quantity: 1, stock: 18 }],
    subtotal: 5990, shippingFee: 350, discount: 0, total: 6340, couponCode: null,
    paymentMethod: 'cod', paymentStatus: 'pending', status: 'cancelled',
    shippingAddress: { line1: '56 High Level Road', city: 'Nugegoda', district: 'Colombo', postalCode: '10250', country: 'Sri Lanka' },
    deliveryType: 'standard', trackingNumber: null,
    createdAt: { seconds: Date.now() / 1000 - 432000, nanoseconds: 0 },
    updatedAt: { seconds: Date.now() / 1000 - 345600, nanoseconds: 0 },
  },
];

const statusOptions = ['pending_cod', 'pending_payment', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

const statusLabels: Record<string, string> = {
  pending_cod: 'Pending COD',
  pending_payment: 'Pending Payment',
  processing: 'Processing',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const timelineSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

function getStepIndex(status: string): number {
  if (status === 'cancelled') return -1;
  if (status.includes('pending')) return 0;
  if (status === 'processing' || status === 'paid') return 1;
  if (status === 'shipped') return 2;
  if (status === 'delivered') return 3;
  return 0;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const order = mockOrders.find((o) => o.id === id);
  const [currentStatus, setCurrentStatus] = useState(order?.status || '');

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-slate-500">Order not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const stepIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Order {order.id}</h2>
            <p className="text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
          <Select value={currentStatus} onValueChange={setCurrentStatus}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <Card className="rounded-2xl shadow">
            <CardContent className="p-6">
              {isCancelled ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-500 text-xl">✕</span>
                  </div>
                  <p className="text-base font-semibold text-red-600">Order Cancelled</p>
                  <p className="text-sm text-slate-500 mt-1">This order has been cancelled</p>
                </div>
              ) : (
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(stepIndex / 3) * 100}%` }}
                    />
                  </div>
                  {timelineSteps.map((step, index) => {
                    const Icon = step.icon;
                    const completed = index <= stepIndex;
                    const current = index === stepIndex;
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                            completed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-400'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <p
                          className={cn(
                            'text-xs mt-2 font-medium',
                            current ? 'text-emerald-600' : completed ? 'text-slate-900' : 'text-slate-400'
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.productName}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping ({order.deliveryType})</span>
                    <span className="text-slate-900">
                      {order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Discount</span>
                      <span className="text-emerald-600">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-slate-500">
                    Status: <span className="capitalize font-medium">{order.paymentStatus}</span>
                  </p>
                </div>
              </div>
              {order.trackingNumber && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Tracking Number</p>
                  <p className="text-sm font-mono font-medium text-slate-900">{order.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold flex-shrink-0">
                  {order.customer.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  {order.customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  {order.customer.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.district}
                  </p>
                  {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="rounded-2xl shadow">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono text-slate-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-900">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="capitalize text-slate-900">{order.deliveryType}</span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Coupon</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                    {order.couponCode}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
