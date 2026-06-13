'use client';

import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Menu, Bell } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/marketing': 'Marketing',
  '/admin/settings': 'Settings',
};

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useStore();

  const getTitle = () => {
    if (pageTitles[pathname]) return pageTitles[pathname];
    if (pathname.startsWith('/admin/products/add')) return 'Add Product';
    if (pathname.match(/\/admin\/products\/[^/]+$/)) return 'Edit Product';
    if (pathname.match(/\/admin\/orders\/[^/]+$/)) return 'Order Details';
    return 'Admin';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold ml-1">
          {user?.displayName?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
