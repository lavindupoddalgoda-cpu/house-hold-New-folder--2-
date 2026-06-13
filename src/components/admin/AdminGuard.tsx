'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useStore();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Only decide after auth has finished loading
    if (!authLoading && (!user || user.role !== 'admin')) {
      setRedirecting(true);
      router.replace('/');
    }
  }, [authLoading, user, router]);

  // Still loading — show spinner
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-500">Verifying access…</p>
        </div>
      </div>
    );
  }

  // Auth finished → not admin → redirecting
  if (!user || user.role !== 'admin') {
    if (!redirecting) {
      // Will be caught by the useEffect on next render
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm text-slate-500">Redirecting…</p>
          </div>
        </div>
      );
    }
    return null;
  }

  // Auth finished → admin user → render children
  return <>{children}</>;
}
