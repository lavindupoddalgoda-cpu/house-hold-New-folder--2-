'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import ProductGrid from '@/components/ecommerce/ProductGrid';
import ProductCard from '@/components/ecommerce/ProductCard';
import ProductFilters, { type FilterState, type SortOption } from '@/components/ecommerce/ProductFilters';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '@/types';
import { cn, formatCurrencyShort } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 8;

const ALL_CATEGORIES = SEED_CATEGORIES.filter((c) => c.isActive);

const priceValues = SEED_PRODUCTS.map((p) => p.sellingPrice);
const PRICE_BOUNDS: [number, number] = [Math.min(...priceValues), Math.max(...priceValues)];

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort') as SortOption | null;
  const filterParam = searchParams.get('filter');

  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam
      ? ALL_CATEGORIES.find((c) => c.id === categoryParam)?.name || 'all'
      : 'all',
    priceRange: PRICE_BOUNDS,
    inStockOnly: false,
    sort: sortParam || (filterParam === 'featured' ? 'featured' : 'featured'),
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...SEED_PRODUCTS].filter((p) => p.isActive);

    // Category filter
    if (filters.category !== 'all') {
      products = products.filter((p) => p.category === filters.category);
    }

    // Price range filter
    products = products.filter((p) => {
      const price = p.discountPrice > 0 ? p.discountPrice : p.sellingPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // In stock filter
    if (filters.inStockOnly) {
      products = products.filter((p) => p.stock > 0);
    }

    // Sort
    switch (filters.sort) {
      case 'price-asc':
        products.sort((a, b) => {
          const pa = a.discountPrice > 0 ? a.discountPrice : a.sellingPrice;
          const pb = b.discountPrice > 0 ? b.discountPrice : b.sellingPrice;
          return pa - pb;
        });
        break;
      case 'price-desc':
        products.sort((a, b) => {
          const pa = a.discountPrice > 0 ? a.discountPrice : a.sellingPrice;
          const pb = b.discountPrice > 0 ? b.discountPrice : b.sellingPrice;
          return pb - pa;
        });
        break;
      case 'newest':
        products.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        break;
      case 'name-asc':
        products.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return products;
  }, [filters]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);

    // Update URL
    const params = new URLSearchParams();
    const catObj = ALL_CATEGORIES.find((c) => c.name === newFilters.category);
    if (catObj) params.set('category', catObj.id);
    if (newFilters.sort !== 'featured') params.set('sort', newFilters.sort);
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  }, [router]);

  const filterSidebar = (
    <ProductFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      categories={ALL_CATEGORIES}
      priceBounds={PRICE_BOUNDS}
    />
  );

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
        {/* Page Header */}
        <div className="border-b border-[#0F172A]/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                Shop
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
                {filters.category === 'all' ? 'All Products' : filters.category}
              </h1>
              <p className="mt-2 font-sans text-sm text-[#0F172A]/50">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </motion.div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 z-30 border-b border-[#0F172A]/5 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl border-[#0F172A]/10 font-sans text-[#0F172A]/70 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {filters.category !== 'all' && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                      1
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                <SheetTitle className="font-sans text-lg font-bold text-[#0F172A]">
                  Filters
                </SheetTitle>
                <div className="mt-4">
                  {filterSidebar}
                </div>
              </SheetContent>
            </Sheet>

            {/* Results count (desktop) */}
            <p className="hidden font-sans text-sm text-[#0F172A]/50 lg:block">
              Showing {visibleProducts.length} of {filteredProducts.length} products
            </p>

            {/* View mode toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'text-[#0F172A]/30 hover:text-[#0F172A]/60'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'text-[#0F172A]/30 hover:text-[#0F172A]/60'
                )}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-36">
                {filterSidebar}
              </div>
            </aside>

            {/* Products */}
            <div className="min-w-0 flex-1">
              {viewMode === 'grid' ? (
                <ProductGrid products={visibleProducts} />
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {visibleProducts.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                      >
                        <p className="font-sans text-lg font-semibold text-[#0F172A]">No products found</p>
                        <p className="mt-2 font-sans text-sm text-[#0F172A]/40">
                          Try adjusting your filters to discover our curated home collection.
                        </p>
                      </motion.div>
                    ) : (
                      visibleProducts.map((product) => {
                        const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.sellingPrice;
                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="overflow-hidden rounded-2xl border border-[#0F172A]/5 bg-white transition-shadow hover:shadow-lg hover:shadow-emerald-500/5"
                          >
                            <div className="flex gap-4 p-4">
                              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#FAFAF7] sm:h-32 sm:w-32">
                                <img
                                  src={product.images[0]}
                                  alt={product.productName}
                                  className="h-full w-full object-cover"
                                />
                                {product.discountPrice > 0 && (
                                  <span className="absolute top-1.5 left-1.5 rounded-md bg-emerald-500 px-1.5 py-0.5 font-sans text-[10px] font-bold text-white">
                                    -{Math.round(((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100)}%
                                  </span>
                                )}
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-emerald-600">
                                      {product.brand}
                                    </span>
                                    <span className="text-[#0F172A]/20">·</span>
                                    <span className="font-sans text-[11px] text-[#0F172A]/40">{product.category}</span>
                                  </div>
                                  <h3 className="mt-1 font-sans text-base font-semibold text-[#0F172A] line-clamp-1">
                                    {product.productName}
                                  </h3>
                                  <p className="mt-1 font-sans text-sm text-[#0F172A]/50 line-clamp-2">
                                    {product.shortDescription}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-sans text-lg font-bold text-emerald-600">
                                      {formatCurrencyShort(effectivePrice)}
                                    </span>
                                    {product.discountPrice > 0 && (
                                      <span className="font-sans text-xs text-[#0F172A]/30 line-through">
                                        {formatCurrencyShort(product.sellingPrice)}
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    asChild
                                    size="sm"
                                    className="rounded-xl bg-emerald-500 font-sans text-xs hover:bg-emerald-600"
                                  >
                                    <a href={`/product/${product.id}`}>View Details</a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center"
                >
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    className="gap-2 rounded-xl border-emerald-200 px-8 font-sans text-emerald-600 hover:bg-emerald-50"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Load More ({filteredProducts.length - visibleCount} remaining)
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
