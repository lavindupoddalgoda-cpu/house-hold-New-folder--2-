'use client';

import { motion } from 'framer-motion';
import Preloader from '@/components/layout/Preloader';
import CustomCursor from '@/components/layout/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';

import HeroSection from '@/components/home/HeroSection';
import TrustBar from '@/components/home/TrustBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StatsSection from '@/components/home/StatsSection';
import BrandStory from '@/components/home/BrandStory';
import BestSellers from '@/components/home/BestSellers';
import Testimonials from '@/components/home/Testimonials';
import PromoBanner from '@/components/home/PromoBanner';
import Newsletter from '@/components/home/Newsletter';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FAFAF7]"
    >
      <Preloader />
      <CustomCursor />
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />

      <main>
        <HeroSection />
        <TrustBar />
        <CategoryGrid />
        <FeaturedProducts />
        <StatsSection />
        <BrandStory />
        <BestSellers />
        <Testimonials />
        <PromoBanner />
        <Newsletter />
      </main>

      <Footer />
    </motion.div>
  );
}
