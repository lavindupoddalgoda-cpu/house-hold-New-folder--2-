'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SEED_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function CategoryCard({ category }: { category: typeof SEED_CATEGORIES[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/catalog?category=${category.id}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl transition-transform duration-300 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Category image */}
          {category.imageURL && (
            <Image
              src={category.imageURL}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{category.icon}</span>
              <span className="font-display text-lg font-bold text-white">{category.name}</span>
            </div>
            <div className="mt-2 flex items-center gap-1 font-sans text-xs font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
              Shop
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* Subtle ring on hover */}
          <div
            className={cn(
              'absolute inset-0 rounded-2xl ring-0 ring-emerald-400/0 transition-all duration-300',
              'group-hover:ring-2 group-hover:ring-emerald-400/50'
            )}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryGrid() {
  return (
    <section className="bg-[#FAFAF7] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Browse By Room
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
            Shop By Category
          </h2>
        </motion.div>

        {/* Category grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3"
        >
          {SEED_CATEGORIES.filter((c) => c.isActive).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
