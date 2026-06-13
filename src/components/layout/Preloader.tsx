'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from 'lucide-react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAFAF7]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-3xl font-bold text-[#0F172A]">
                HomeNest LK
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="font-sans text-sm tracking-widest text-[#0F172A]/50 uppercase"
            >
              Elevate Your Living Space
            </motion.p>

            <div className="mt-4 w-64 space-y-3">
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#0F172A]/10">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              </div>
              <motion.p
                className="font-sans text-center text-xs tabular-nums text-[#0F172A]/40"
              >
                {Math.min(Math.round(progress), 100)}%
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
