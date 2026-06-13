'use client';

import { useState, useMemo } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Search, UserCheck, UserX } from 'lucide-react';

interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  orders: number;
  totalSpent: number;
  banned: boolean;
  joinedAt: { seconds: number; nanoseconds: number };
}

const mockCustomers: MockCustomer[] = [
  {
    id: 'u1', name: 'Amal Perera', email: 'amal@email.com', phone: '+94771234567',
    avatar: '', orders: 5, totalSpent: 24670, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 2592000, nanoseconds: 0 },
  },
  {
    id: 'u2', name: 'Nishadi Fernando', email: 'nishadi@email.com', phone: '+94779876543',
    avatar: '', orders: 8, totalSpent: 42150, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 5184000, nanoseconds: 0 },
  },
  {
    id: 'u3', name: 'Kasun Jayawardena', email: 'kasun@email.com', phone: '+94775551234',
    avatar: '', orders: 3, totalSpent: 15680, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 7776000, nanoseconds: 0 },
  },
  {
    id: 'u4', name: 'Dilini Wickramasinghe', email: 'dilini@email.com', phone: '+94773456789',
    avatar: '', orders: 12, totalSpent: 67340, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 10368000, nanoseconds: 0 },
  },
  {
    id: 'u5', name: 'Ravindu Senanayake', email: 'ravindu@email.com', phone: '+94776789012',
    avatar: '', orders: 2, totalSpent: 8340, banned: true,
    joinedAt: { seconds: Date.now() / 1000 - 15552000, nanoseconds: 0 },
  },
  {
    id: 'u6', name: 'Sanduni Rajapaksa', email: 'sanduni@email.com', phone: '+94774445566',
    avatar: '', orders: 6, totalSpent: 31200, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 20736000, nanoseconds: 0 },
  },
  {
    id: 'u7', name: 'Tharindu De Silva', email: 'tharindu@email.com', phone: '+94773334455',
    avatar: '', orders: 1, totalSpent: 1340, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 25920000, nanoseconds: 0 },
  },
  {
    id: 'u8', name: 'Ishara Bandara', email: 'ishara@email.com', phone: '+94772223344',
    avatar: '', orders: 4, totalSpent: 18750, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 31104000, nanoseconds: 0 },
  },
  {
    id: 'u9', name: 'Chamara Wijesinghe', email: 'chamara@email.com', phone: '+94771112233',
    avatar: '', orders: 7, totalSpent: 38900, banned: true,
    joinedAt: { seconds: Date.now() / 1000 - 36288000, nanoseconds: 0 },
  },
  {
    id: 'u10', name: 'Malini Peris', email: 'malini@email.com', phone: '+94779998877',
    avatar: '', orders: 9, totalSpent: 52340, banned: false,
    joinedAt: { seconds: Date.now() / 1000 - 41472000, nanoseconds: 0 },
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(search)
      );
    });
  }, [customers, search]);

  const toggleBan = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, banned: !c.banned } : c))
    );
  };

  const totalCustomers = customers.length;
  const bannedCustomers = customers.filter((c) => c.banned).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Customers</h2>
        <p className="text-sm text-slate-500">{totalCustomers} total customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-slate-500">Total Customers</p>
          <p className="text-2xl font-bold text-slate-900">{totalCustomers}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-slate-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{totalCustomers - bannedCustomers}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className={cn(
                    'border-b border-slate-50 transition-colors',
                    customer.banned ? 'bg-red-50/30' : 'hover:bg-slate-50/50'
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(customer.joinedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={cn(
                        'text-xs font-medium border',
                        customer.banned
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      )}
                    >
                      {customer.banned ? 'Banned' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!customer.banned}
                        onCheckedChange={() => toggleBan(customer.id)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      {customer.banned ? (
                        <UserX className="w-4 h-4 text-red-500" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
