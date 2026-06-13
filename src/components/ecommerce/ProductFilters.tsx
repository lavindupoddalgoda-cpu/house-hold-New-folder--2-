'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrencyShort } from '@/lib/utils';
import type { Category } from '@/types';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc';

export interface FilterState {
  category: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sort: SortOption;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Category[];
  priceBounds: [number, number];
  className?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

export default function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  priceBounds,
  className,
}: ProductFiltersProps) {
  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > priceBounds[0] || filters.priceRange[1] < priceBounds[1] ? 1 : 0);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      priceRange: priceBounds,
      inStockOnly: false,
      sort: 'featured',
    });
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn('w-full space-y-6', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <h3 className="font-sans text-sm font-semibold text-navy">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge className="h-5 min-w-5 bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 font-sans text-xs text-navy/40 transition-colors hover:text-emerald-600"
          >
            <RotateCcw className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-2.5">
        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
          Sort By
        </label>
        <Select
          value={filters.sort}
          onValueChange={(val) => updateFilter('sort', val as SortOption)}
        >
          <SelectTrigger className="h-9 rounded-xl border-navy/10 bg-white font-sans text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="font-sans text-sm">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', 'all')}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-sans text-sm transition-colors',
              filters.category === 'all'
                ? 'bg-emerald-50 font-semibold text-emerald-700'
                : 'text-navy/60 hover:bg-cream'
            )}
          >
            <span className="text-base">🏠</span>
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.name)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-sans text-sm transition-colors',
                filters.category === cat.name
                  ? 'bg-emerald-50 font-semibold text-emerald-700'
                  : 'text-navy/60 hover:bg-cream'
              )}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <label className="font-sans text-xs font-semibold uppercase tracking-wider text-navy/50">
          Price Range
        </label>
        <Slider
          value={filters.priceRange}
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={100}
          onValueChange={(val) => updateFilter('priceRange', val as [number, number])}
          className="py-2"
        />
        <div className="flex items-center justify-between font-sans text-xs text-navy/50">
          <span>{formatCurrencyShort(filters.priceRange[0])}</span>
          <span>{formatCurrencyShort(filters.priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      {/* In Stock Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-sm font-medium text-navy">In Stock Only</p>
          <p className="font-sans text-[11px] text-navy/40">Hide out-of-stock items</p>
        </div>
        <Switch
          checked={filters.inStockOnly}
          onCheckedChange={(checked) => updateFilter('inStockOnly', checked)}
        />
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-1.5">
            {filters.category !== 'all' && (
              <Badge
                variant="secondary"
                className="gap-1 rounded-lg bg-emerald-50 font-sans text-xs text-emerald-700"
              >
                {filters.category}
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className="ml-0.5 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.inStockOnly && (
              <Badge
                variant="secondary"
                className="gap-1 rounded-lg bg-emerald-50 font-sans text-xs text-emerald-700"
              >
                In Stock
                <button
                  onClick={() => updateFilter('inStockOnly', false)}
                  className="ml-0.5 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.priceRange[0] > priceBounds[0] ||
              filters.priceRange[1] < priceBounds[1]) && (
              <Badge
                variant="secondary"
                className="gap-1 rounded-lg bg-emerald-50 font-sans text-xs text-emerald-700"
              >
                {formatCurrencyShort(filters.priceRange[0])} – {formatCurrencyShort(filters.priceRange[1])}
                <button
                  onClick={() => updateFilter('priceRange', priceBounds)}
                  className="ml-0.5 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </>
      )}
    </motion.aside>
  );
}
