'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    addToast({ message: 'Welcome to the HomeNest family! 🎉', type: 'success' });
  };

  return (
    <section className="bg-[#FAFAF7] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-8 shadow-lg shadow-[#0F172A]/5 backdrop-blur-xl sm:p-10"
        >
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-100/50 blur-[60px]" />
          <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#F59E0B]/10 blur-[40px]" />

          <div className="relative text-center">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="py-4"
                >
                  <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-[#0F172A]">
                    You&apos;re In!
                  </h3>
                  <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                    Welcome to the HomeNest family. Check your inbox for a welcome surprise.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-[#0F172A] sm:text-3xl">
                    Stay in the Loop
                  </h3>
                  <p className="mt-2 font-sans text-sm text-[#0F172A]/50 sm:text-base">
                    Get exclusive deals, new arrivals, and home styling tips delivered to your inbox.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F172A]/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="h-11 w-full rounded-lg border border-[#0F172A]/10 bg-white pl-10 pr-4 font-sans text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#0F172A]/30 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-11 rounded-lg bg-emerald-500 px-6 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Subscribe
                    </button>
                  </form>

                  <p className="mt-3 font-sans text-[11px] text-[#0F172A]/30">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
