'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  Settings,
  LogOut,
  X,
  Home,
} from 'lucide-react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useStore();

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  const handleNav = (href: string) => {
    router.push(href);
    onClose();
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-sm leading-tight">HomeNest LK</span>
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 w-fit">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
            {user?.displayName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.displayName || 'Admin'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'admin@homestlk.com'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-60 bg-white shadow-xl animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-end px-3 h-16 border-b border-slate-100">
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </aside>
        </div>
      )}
    </>
  );
}
