'use client';
import { useState, useCallback } from 'react';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '@/types';
import type { Product, Category } from '@/types';

export function useProducts() {
  const [products] = useState<Product[]>(SEED_PRODUCTS);
  const [categories] = useState<Category[]>(SEED_CATEGORIES);
  const [loading] = useState(false);

  const getProduct = useCallback((id: string) => {
    return products.find(p => p.id === id) || null;
  }, [products]);

  const getFeaturedProducts = useCallback(() => {
    return products.filter(p => p.featured && p.isActive);
  }, [products]);

  const getProductsByCategory = useCallback((category: string) => {
    return products.filter(p => p.category === category && p.isActive);
  }, [products]);

  const searchProducts = useCallback((query: string) => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.isActive && (
        p.productName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    );
  }, [products]);

  return {
    products,
    categories,
    loading,
    getProduct,
    getFeaturedProducts,
    getProductsByCategory,
    searchProducts,
  };
}
