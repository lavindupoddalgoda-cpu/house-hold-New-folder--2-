'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Heart, ShieldCheck, Truck } from 'lucide-react';

const VALUES = [
  { icon: Leaf, label: 'Eco-Friendly Sourcing' },
  { icon: Heart, label: 'Curated with Care' },
  { icon: ShieldCheck, label: 'Quality Guaranteed' },
  { icon: Truck, label: 'Island-wide Delivery' },
];

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} className="bg-[#FAFAF7] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Our Story
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
              Crafting Homes, Building Stories
            </h2>
            <p className="mt-5 font-sans text-sm leading-relaxed text-[#0F172A]/60 sm:text-base">
              HomeNest LK was born from a simple idea: every Sri Lankan home deserves
              access to premium quality home essentials without the premium price tag.
              We carefully curate each product in our collection, ensuring it meets
              our high standards for quality, durability, and style.
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#0F172A]/60 sm:text-base">
              From our warehouse in Colombo, we deliver island-wide, bringing comfort
              and elegance to homes across all 25 districts. Our commitment to customer
              satisfaction drives everything we do &mdash; from the products we select
              to the service we provide.
            </p>

            {/* Values */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {VALUES.map((value, i) => (
                <motion.div
                  key={value.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <value.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="font-sans text-sm font-medium text-[#0F172A]">
                    {value.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8"
            >
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Explore Our Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Parallax image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
                alt="Beautiful home interior by HomeNest LK"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-[#0F172A]/5" />
            </motion.div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 rounded-xl bg-white p-4 shadow-lg sm:-bottom-6 sm:-left-6"
            >
              <p className="font-display text-2xl font-bold text-emerald-500">25+</p>
              <p className="font-sans text-xs text-[#0F172A]/50">Districts Served</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
