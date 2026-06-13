'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headphones, Award, Lock } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over Rs. 5,000' },
  { icon: ShieldCheck, title: 'Genuine Products', description: '100% authentic guarantee' },
  { icon: RotateCcw, title: 'Easy Returns', description: '7-day hassle-free returns' },
  { icon: Headphones, title: '24/7 Support', description: 'Always here to help you' },
  { icon: Award, title: 'Top Rated', description: '4.9★ average customer rating' },
  { icon: Lock, title: 'Secure Payment', description: 'PayHere verified checkout' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TrustBar() {
  return (
    <section className="border-y border-[#0F172A]/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <feature.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mt-3 font-sans text-sm font-semibold text-[#0F172A]">
                {feature.title}
              </h3>
              <p className="mt-1 font-sans text-xs text-[#0F172A]/40">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
