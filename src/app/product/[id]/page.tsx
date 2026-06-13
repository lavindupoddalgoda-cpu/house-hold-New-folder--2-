'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import ProductGallery from '@/components/ecommerce/ProductGallery';
import ProductReviews from '@/components/ecommerce/ProductReviews';
import ProductCard from '@/components/ecommerce/ProductCard';
import WishlistButton from '@/components/ecommerce/WishlistButton';
import { SEED_PRODUCTS, SEED_REVIEWS, STORE } from '@/types';
import { useStore } from '@/store/useStore';
import { cn, formatCurrencyShort } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

type TabKey = 'description' | 'specifications' | 'reviews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = useMemo(() => SEED_PRODUCTS.find((p) => p.id === productId), [productId]);
  const { addToCart, addToast } = useStore();

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <main className="flex min-h-[60vh] flex-col items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="font-display text-2xl font-bold text-[#0F172A]">Product Not Found</h1>
            <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
              The product you are looking for does not exist.
            </p>
            <Link
              href="/catalog"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Back to Catalog
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.sellingPrice;
  const discountPercent =
    product.discountPrice > 0
      ? Math.round(((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100)
      : 0;

  const productReviews = SEED_REVIEWS.filter((r) => r.productId === productId);
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      : 4.0;

  const relatedProducts = SEED_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id && p.isActive
  ).slice(0, 4);

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    const variant =
      Object.keys(selectedVariants).length > 0
        ? { type: Object.keys(selectedVariants)[0], value: Object.values(selectedVariants)[0] }
        : undefined;

    addToCart({
      productId: product.id,
      productName: product.productName,
      price: effectivePrice,
      image: product.thumbnails[0] || product.images[0],
      quantity,
      stock: product.stock,
      variant,
    });

    setAdded(true);
    addToast({ message: `${product.productName} added to cart`, type: 'success' });
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'reviews', label: `Reviews (${productReviews.length})` },
  ];

  // Color swatch map
  const colorMap: Record<string, string> = {
    'White': '#FFFFFF',
    'Black': '#1a1a1a',
    'Ivory': '#FFFFF0',
    'Grey': '#9CA3AF',
    'Navy': '#1E3A5F',
    'Sage': '#9DC183',
    'Cream': '#FFFDD0',
    'Charcoal': '#36454F',
    'Forest Green': '#228B22',
    'Matte White': '#F5F5F0',
    'Sage Green': '#B2AC88',
    'Midnight Blue': '#191970',
    'Rose Gold': '#B76E79',
    'Silver': '#C0C0C0',
    'Beige': '#F5F5DC',
    'White Wood Grain': '#F5F0E8',
    'Dark Wood Grain': '#5C4033',
    'Natural': '#D2B48C',
    'Walnut': '#773F1A',
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FAFAF7]"
    >
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-[#0F172A]/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 font-sans text-xs text-[#0F172A]/40">
              <Link href="/" className="transition-colors hover:text-emerald-500">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/catalog" className="transition-colors hover:text-emerald-500">Catalog</Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/catalog?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="transition-colors hover:text-emerald-500"
              >
                {product.category}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#0F172A]/70">{product.productName}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGallery images={product.images} productName={product.productName} />
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5"
            >
              {/* Brand & Category */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-emerald-600">
                  {product.brand}
                </span>
                <span className="text-[#0F172A]/20">·</span>
                <span className="font-sans text-[11px] text-[#0F172A]/40">{product.category}</span>
              </div>

              {/* Product Name */}
              <h1 className="font-display text-2xl font-bold text-[#0F172A] sm:text-3xl">
                {product.productName}
              </h1>

              {/* SKU */}
              <p className="font-sans text-xs text-[#0F172A]/30">
                SKU: {product.sku}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.round(averageRating)
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'fill-[#0F172A]/10 text-[#0F172A]/10'
                      )}
                    />
                  ))}
                </div>
                <span className="font-sans text-sm text-[#0F172A]/50">
                  {averageRating.toFixed(1)} ({productReviews.length} review{productReviews.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-3xl font-bold text-emerald-600">
                  {formatCurrencyShort(effectivePrice)}
                </span>
                {product.discountPrice > 0 && (
                  <>
                    <span className="font-sans text-lg text-[#0F172A]/30 line-through">
                      {formatCurrencyShort(product.sellingPrice)}
                    </span>
                    <Badge className="rounded-lg bg-emerald-100 px-2 py-0.5 font-sans text-[11px] font-bold text-emerald-700 hover:bg-emerald-100">
                      -{discountPercent}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Badge */}
              <div>
                {product.stock > 10 ? (
                  <Badge className="rounded-lg bg-emerald-50 px-2 py-0.5 font-sans text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50">
                    In Stock
                  </Badge>
                ) : product.stock > 0 ? (
                  <Badge className="rounded-lg bg-[#F59E0B]/10 px-2 py-0.5 font-sans text-[11px] font-semibold text-[#F59E0B] hover:bg-[#F59E0B]/10">
                    Only {product.stock} left
                  </Badge>
                ) : (
                  <Badge className="rounded-lg bg-red-50 px-2 py-0.5 font-sans text-[11px] font-semibold text-red-500 hover:bg-red-50">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Variant Selection */}
              {product.variants.length > 0 && (
                <div className="space-y-4">
                  {product.variants.map((variant) => (
                    <div key={variant.type}>
                      <label className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0F172A]/50">
                        {variant.type}: <span className="text-[#0F172A]">{selectedVariants[variant.type] || 'Select'}</span>
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {variant.type.toLowerCase() === 'color' ? (
                          // Color swatches
                          variant.values.map((val) => (
                            <button
                              key={val}
                              onClick={() => handleVariantSelect(variant.type, val)}
                              className={cn(
                                'group relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all',
                                selectedVariants[variant.type] === val
                                  ? 'border-emerald-500 shadow-md shadow-emerald-500/20'
                                  : 'border-[#0F172A]/10 hover:border-emerald-300'
                              )}
                              title={val}
                            >
                              <span
                                className="h-6 w-6 rounded-full border border-[#0F172A]/10"
                                style={{ backgroundColor: colorMap[val] || '#ccc' }}
                              />
                              {selectedVariants[variant.type] === val && (
                                <Check
                                  className={cn(
                                    'absolute h-3.5 w-3.5',
                                    ['White', 'Ivory', 'Cream', 'Beige', 'Sage', 'Matte White', 'White Wood Grain', 'Silver'].includes(val)
                                      ? 'text-[#0F172A]'
                                      : 'text-white'
                                  )}
                                />
                              )}
                            </button>
                          ))
                        ) : (
                          // Size pills
                          variant.values.map((val) => (
                            <button
                              key={val}
                              onClick={() => handleVariantSelect(variant.type, val)}
                              className={cn(
                                'rounded-xl border px-4 py-2 font-sans text-sm transition-all',
                                selectedVariants[variant.type] === val
                                  ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-700'
                                  : 'border-[#0F172A]/10 text-[#0F172A]/60 hover:border-emerald-300'
                              )}
                            >
                              {val}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#0F172A]/50">
                  Quantity
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#0F172A]/10 text-[#0F172A]/50 transition-colors hover:bg-[#FAFAF7]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-sans text-sm font-semibold text-[#0F172A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#0F172A]/10 text-[#0F172A]/50 transition-colors hover:bg-[#FAFAF7] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-sans text-[11px] text-[#0F172A]/30">
                  {product.stock} available
                </span>
              </div>

              {/* Add to Cart + Wishlist */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || added}
                  className={cn(
                    'h-12 flex-1 gap-2 rounded-xl font-sans text-sm font-semibold transition-all',
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  )}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart — {formatCurrencyShort(effectivePrice * quantity)}
                    </>
                  )}
                </Button>
                <WishlistButton productId={product.id} size="lg" className="h-12 w-12 shrink-0 rounded-xl border border-[#0F172A]/10" />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Truck, label: 'Free Shipping', detail: `Over ${formatCurrencyShort(STORE.freeShippingThreshold)}` },
                  { icon: ShieldCheck, label: 'Genuine', detail: 'Authentic guarantee' },
                  { icon: RotateCcw, label: 'Easy Returns', detail: '7-day returns' },
                  { icon: Package, label: 'Secure Pack', detail: 'Careful packaging' },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center rounded-xl border border-[#0F172A]/5 bg-white p-3 text-center"
                  >
                    <badge.icon className="h-5 w-5 text-emerald-500" />
                    <span className="mt-1 font-sans text-[11px] font-semibold text-[#0F172A]">{badge.label}</span>
                    <span className="font-sans text-[10px] text-[#0F172A]/30">{badge.detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Animated Tab Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative border-b border-[#0F172A]/10">
              <div className="flex gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'relative px-6 py-3 font-sans text-sm font-medium transition-colors',
                      activeTab === tab.key
                        ? 'text-emerald-600'
                        : 'text-[#0F172A]/40 hover:text-[#0F172A]/60'
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="py-8"
              >
                {activeTab === 'description' && (
                  <div className="max-w-3xl">
                    <p className="font-sans text-sm leading-relaxed text-[#0F172A]/70">
                      {product.description}
                    </p>
                    {product.tags.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-[#0F172A]/5 px-3 py-1 font-sans text-xs text-[#0F172A]/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="max-w-2xl">
                    <div className="space-y-3">
                      {[
                        { label: 'SKU', value: product.sku },
                        { label: 'Brand', value: product.brand },
                        { label: 'Category', value: product.category },
                        { label: 'Weight', value: `${product.weight}g` },
                        { label: 'Dimensions (L×W×H)', value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm` },
                        ...product.variants.map((v) => ({
                          label: v.type,
                          value: v.values.join(', '),
                        })),
                      ].map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between rounded-xl border border-[#0F172A]/5 bg-white px-4 py-3"
                        >
                          <span className="font-sans text-sm text-[#0F172A]/50">{spec.label}</span>
                          <span className="font-sans text-sm font-medium text-[#0F172A]">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="max-w-3xl">
                    <ProductReviews productId={product.id} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                    You May Also Like
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-[#0F172A]">
                    Related Products
                  </h2>
                </div>
                <Link
                  href={`/catalog?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-sans text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
