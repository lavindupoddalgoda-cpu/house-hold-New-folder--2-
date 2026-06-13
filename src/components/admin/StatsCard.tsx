'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span
            className={cn(
              'text-xs font-semibold',
              isPositive ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-slate-400 ml-1">vs last month</span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </div>
  );
}
