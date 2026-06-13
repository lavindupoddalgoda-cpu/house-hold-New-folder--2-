'use client';

import { useRouter } from 'next/navigation';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';

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

interface OrdersTableProps {
  orders: Order[];
  maxRows?: number;
}

export default function OrdersTable({ orders, maxRows }: OrdersTableProps) {
  const router = useRouter();
  const displayOrders = maxRows ? orders.slice(0, maxRows) : orders;

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Items
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-mono font-medium text-slate-900">
                  {order.id}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{order.customer.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={cn(
                      'text-xs font-medium border',
                      statusColors[order.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                    )}
                  >
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
