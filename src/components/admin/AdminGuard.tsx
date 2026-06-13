'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useStore();
  const router = useRouter();

  const isChecking = authLoading || !user || user.role !== 'admin';

  if (isChecking && !authLoading && (!user || user.role !== 'admin')) {
    // Not an admin, redirect
    if (typeof window !== 'undefined') {
      router.replace('/');
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    if (typeof window !== 'undefined') {
      router.replace('/');
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
