'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Package, Star, Clock } from 'lucide-react';

const STATS = [
  { icon: Users, target: 2400, suffix: '+', label: 'Happy Customers' },
  { icon: Package, target: 500, suffix: '+', label: 'Premium Products' },
  { icon: Star, target: 4.9, suffix: '★', label: 'Average Rating', decimals: 1 },
  { icon: Clock, target: 48, suffix: 'h', label: 'Fast Delivery' },
];

function CountUpNumber({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(target, increment * step);
      if (step >= steps) {
        current = target;
        clearInterval(interval);
      }
      setCount(current);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isInView, target]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-4 py-20 sm:px-6 lg:px-8">
      {/* Background orbs */}
      <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#F59E0B]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            By The Numbers
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            Trusted by Thousands
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                <stat.icon className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
                <CountUpNumber
                  target={stat.target}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </p>
              <p className="mt-2 font-sans text-sm text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
