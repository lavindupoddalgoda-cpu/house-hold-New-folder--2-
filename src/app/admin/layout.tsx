'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:pl-60">
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
