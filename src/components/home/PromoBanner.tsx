'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Timer, ArrowRight } from 'lucide-react';

const COUNTDOWN_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function useCountdown(durationMs: number) {
  const [mounted, setMounted] = useState(false);

  const calcTimeLeft = (target: Date) => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  // Stable placeholder that matches server output exactly
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Compute target date only on the client so server and client
    // always produce the same initial render (all zeros).
    const target = new Date(Date.now() + durationMs);
    setTimeLeft(calcTimeLeft(target));
    setMounted(true);

    const interval = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  return { timeLeft, mounted };
}

function TimeBlock({ value, label, mounted }: { value: number; label: string; mounted: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 font-display text-lg font-bold text-white sm:h-12 sm:w-12 sm:text-xl">
        {mounted ? String(value).padStart(2, '0') : '–'}
      </span>
      <span className="mt-1 font-sans text-[10px] uppercase tracking-wider text-white/60">
        {label}
      </span>
    </div>
  );
}

export default function PromoBanner() {
  const { timeLeft, mounted } = useCountdown(COUNTDOWN_DURATION_MS);
  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <section className="relative overflow-hidden bg-emerald-600 px-4 py-10 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-[80px]" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#F59E0B]/10 blur-[60px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                <Timer className="h-5 w-5 text-[#F59E0B]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-white/70">
                  Limited Time Offer
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                Free Shipping on orders over Rs. 5,000 island-wide!
              </h3>
              <p className="mt-2 font-sans text-sm text-white/60">
                Don&apos;t miss out &mdash; upgrade your home today with premium essentials delivered to your doorstep.
              </p>
            </motion.div>
          </div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <TimeBlock value={days} label="Days" mounted={mounted} />
            <span className="font-display text-xl font-bold text-white/40">:</span>
            <TimeBlock value={hours} label="Hours" mounted={mounted} />
            <span className="font-display text-xl font-bold text-white/40">:</span>
            <TimeBlock value={minutes} label="Min" mounted={mounted} />
            <span className="font-display text-xl font-bold text-white/40">:</span>
            <TimeBlock value={seconds} label="Sec" mounted={mounted} />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-sans text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
