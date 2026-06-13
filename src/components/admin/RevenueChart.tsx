'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrencyShort } from '@/lib/utils';

const data = [
  { date: 'Jun 1', revenue: 45000 },
  { date: 'Jun 2', revenue: 52000 },
  { date: 'Jun 3', revenue: 38000 },
  { date: 'Jun 4', revenue: 61000 },
  { date: 'Jun 5', revenue: 55000 },
  { date: 'Jun 6', revenue: 72000 },
  { date: 'Jun 7', revenue: 48000 },
  { date: 'Jun 8', revenue: 63000 },
  { date: 'Jun 9', revenue: 59000 },
  { date: 'Jun 10', revenue: 71000 },
  { date: 'Jun 11', revenue: 67000 },
  { date: 'Jun 12', revenue: 85000 },
  { date: 'Jun 13', revenue: 78000 },
  { date: 'Jun 14', revenue: 92000 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900">{formatCurrencyShort(payload[0].value)}</p>
    </div>
  );
}

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Revenue Overview</h3>
          <p className="text-sm text-slate-500 mt-0.5">Last 14 days</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{formatCurrencyShort(92000)}</p>
          <p className="text-xs text-emerald-600 font-medium">+21.1% from yesterday</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
